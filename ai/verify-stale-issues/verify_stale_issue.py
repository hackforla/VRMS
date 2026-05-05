#!/usr/bin/env python3

"""
VRMS Stale Issue Verification Skill

Automatically verifies open stale issues (>1 year old) and determines if they should be:
- CLOSE: Issue is complete or abandoned
- KEEP_OPEN: Issue is legitimate ongoing work
- FLAG_PM: Issue needs stakeholder/PM decision
- VERIFY_CODE: Needs code inspection to determine status

Usage:
    python3 verify_stale_issue.py <issue_number>
    python3 verify_stale_issue.py --batch issues.json --output report.json
    python3 verify_stale_issue.py --list (shows all stale issues)
"""

import json
import subprocess
import sys
import argparse
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import re


class StaleIssueVerifier:
    """Verifies stale GitHub issues and provides action recommendations"""

    # Code verification patterns
    CODE_CHECKS = {
        "form_validation": {
            "patterns": [
                "frontend/src/pages",
                "frontend/src/components",
                "client/src/pages",
                "client/src/components",
            ],
            "keywords": ["validat", "required", "error", "FormValidation"],
        },
        "mui_styling": {
            "patterns": ["@mui", "material-ui", "MUI"],
            "keywords": ["Button", "TextField", "Box", "Container"],
        },
        "checkin": {
            "patterns": ["CheckIn", "check-in", "checkIn"],
            "keywords": ["attendance", "event", "status"],
        },
        "google_drive": {
            "patterns": ["docs/", "README", "CONTRIBUTING"],
            "keywords": ["google", "drive", "docs"],
        },
        "502_error": {
            "patterns": ["deployment", "nginx", "server", "error"],
            "keywords": ["502", "gateway", "timeout"],
        },
    }

    # Decision tree weights and patterns
    LABEL_PATTERNS = {
        "meeting": ["agenda", "meeting", "standup", "sync"],
        "draft": ["draft"],
        "pm_decision": ["ready for product manager"],
        "stakeholder": ["stakeholder", "feedback"],
        "epic": ["epic", "overview"],
        "security": ["security"],
        "blocked": ["blocked", "blocking"],
        "recurring": ["weekly", "monthly", "recurring"],
        "bug": ["bug"],
        "feature": ["feature", "enhancement"],
    }

    TITLE_PATTERNS = {
        "stakeholder": r"stakeholder|feedback",
        "meeting": r"agenda|meeting|standup|sync",
        "recurring": r"weekly|monthly|recurring|audit",
    }

    # Dev-related roles that indicate code verification needed
    DEV_ROLES = [
        "role: database",
        "role: back end",
        "role: front end",
        "role: devops",
        "role: dev lead",
    ]

    # Non-dev roles that indicate docs/process verification
    NON_DEV_ROLES = [
        "role: product",
        "role: ui/ux",
        "role: design",
        "role: branding",
        "role: org rep",
        "role: missing",
    ]

    # Issue type detection patterns - determines verification scope
    ISSUE_TYPES = {
        "documentation": {
            "keywords": ["documentation", "docs", "readme", "wiki", "guide", "link", "url", "guide"],
            "verification_method": "manual_review",
            "description": "Documentation/wiki updates - requires manual review",
        },
        "process": {
            "keywords": ["process", "workflow", "procedure", "setup", "onboarding", "migration"],
            "verification_method": "stakeholder_approval",
            "description": "Process/workflow changes - requires stakeholder approval",
        },
        "infrastructure": {
            "keywords": ["deploy", "server", "502", "500", "gateway", "docker", "kubernetes"],
            "verification_method": "logs_monitoring",
            "description": "Infrastructure/deployment - check logs and monitoring",
        },
        "feature": {
            "keywords": ["add", "implement", "feature", "new", "create"],
            "verification_method": "code_inspection",
            "description": "Feature implementation - verify code exists and works",
        },
        "bug": {
            "keywords": ["bug", "fix", "issue", "error", "cannot", "broken", "not working"],
            "verification_method": "code_inspection",
            "description": "Bug fix - verify in code and git history",
        },
        "refactor": {
            "keywords": ["refactor", "cleanup", "update", "migrate", "convert"],
            "verification_method": "code_inspection",
            "description": "Code refactoring - verify in code changes",
        },
        "styling": {
            "keywords": ["style", "ui", "design", "css", "styling", "appearance"],
            "verification_method": "code_inspection",
            "description": "UI/styling changes - verify in code",
        },
    }

    def __init__(self, gh_token: Optional[str] = None):
        """Initialize verifier with optional GitHub token"""
        self.gh_token = gh_token
        self.today = datetime.now().replace(tzinfo=None)
        self.repo_root = "/Users/trilliumsmith/code/VRMS/VRMS"
        self.issue_cache = {}  # Cache exact issue titles for consistency

    def fetch_issue(self, issue_num: int) -> Optional[Dict[str, Any]]:
        """Fetch issue data from GitHub"""
        try:
            cmd = [
                "gh",
                "issue",
                "view",
                str(issue_num),
                "--json",
                "number,title,state,labels,createdAt,updatedAt,assignees,body,milestone",
            ]
            result = subprocess.run(
                cmd, capture_output=True, text=True, check=True
            )
            issue_data = json.loads(result.stdout)
            # Cache the exact title for consistency
            exact_title = issue_data.get("title", "")
            self.issue_cache[issue_num] = exact_title
            return issue_data
        except subprocess.CalledProcessError as e:
            print(f"Error fetching issue #{issue_num}: {e.stderr}", file=sys.stderr)
            return None

    def get_exact_title(self, issue_num: int) -> str:
        """Get the exact issue title (cached for consistency)"""
        return self.issue_cache.get(issue_num, "")

    def days_since(self, date_str: str) -> int:
        """Calculate days between date string and today"""
        try:
            # Parse ISO format date, handle UTC timezone
            date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            # Remove timezone info for comparison
            date = date.replace(tzinfo=None)
            delta = self.today - date
            return delta.days
        except (ValueError, AttributeError):
            return -1

    def extract_labels(self, labels: List[Dict]) -> set:
        """Extract label names as lowercase set"""
        return {label["name"].lower() for label in labels}

    def matches_patterns(self, text: str, patterns: List[str]) -> bool:
        """Check if text matches any pattern"""
        text_lower = text.lower()
        return any(pattern.lower() in text_lower for pattern in patterns)

    def detect_label_category(self, labels: set) -> Dict[str, bool]:
        """Detect category flags from labels"""
        categories = {}
        for category, patterns in self.LABEL_PATTERNS.items():
            categories[f"has_{category}"] = any(
                pattern in text for pattern in patterns for text in labels
            )
        return categories

    def detect_title_category(self, title: str) -> Dict[str, bool]:
        """Detect category flags from title"""
        categories = {}
        for category, pattern in self.TITLE_PATTERNS.items():
            categories[f"has_{category}_title"] = bool(
                re.search(pattern, title, re.IGNORECASE)
            )
        return categories

    def verify_issue(self, issue_num: int) -> Dict[str, Any]:
        """Run full verification on an issue"""
        issue = self.fetch_issue(issue_num)
        if not issue:
            return {"error": f"Issue #{issue_num} not found"}

        # Extract data
        title = issue["title"]
        state = issue["state"]
        created = issue["createdAt"].split("T")[0]
        updated = issue["updatedAt"].split("T")[0]
        labels = self.extract_labels(issue.get("labels", []))
        assignees = [a["login"] for a in issue.get("assignees", [])]
        milestone = issue.get("milestone", {})

        # Calculate days
        days_created = self.days_since(issue["createdAt"])
        days_updated = self.days_since(issue["updatedAt"])

        # STEP 1: Detect issue type to determine verification scope
        issue_type_info = self.detect_issue_type(title, labels)

        # Detect categories
        label_cats = self.detect_label_category(labels)
        title_cats = self.detect_title_category(title)
        all_metadata = {**label_cats, **title_cats}

        # Apply decision tree
        verdict = self._apply_decision_tree(
            title, all_metadata, assignees, days_created, days_updated
        )

        # Find related commits
        related_keywords = [title.split()[0:3], issue["title"]]  # Use first few words as search
        related_commits = self.find_related_commits(
            [" ".join(related_keywords[0]).lower(), issue["title"].lower()]
        )

        return {
            "issue": issue_num,
            "title": title,
            "state": state,
            "issue_type": issue_type_info,
            "verification_scope": {
                "method": issue_type_info["verification_method"],
                "description": issue_type_info["description"],
                "confidence": issue_type_info["confidence"],
            },
            "verdict": verdict["verdict"],
            "category": verdict["category"],
            "confidence": verdict["confidence"],
            "reasoning": verdict["reasoning"],
            "action": verdict["action"],
            "blocker": verdict.get("blocker"),
            "dates": {
                "created": created,
                "updated": updated,
                "days_since_created": days_created,
                "days_since_updated": days_updated,
            },
            "metadata": {
                "assigned_to": assignees if assignees else None,
                **all_metadata,
            },
            "related_commits": related_commits,
        }

    def detect_issue_type(self, title: str, labels: set) -> Dict[str, Any]:
        """
        Detect issue type to determine appropriate verification scope.
        This is the PRE-VERIFICATION step that decides HOW to verify.

        Uses two signals:
        1. Title keywords (what the issue is about)
        2. Role labels (who should work on it)
        """
        title_lower = title.lower()
        labels_lower = {label.lower() for label in labels}

        # SIGNAL 1: Check role labels for dev indication
        has_dev_role = any(role in label for role in self.DEV_ROLES for label in labels_lower)
        has_non_dev_role = any(role in label for role in self.NON_DEV_ROLES for label in labels_lower)

        # SIGNAL 2: Check title for issue type keywords
        detected_types = []

        for issue_type, config in self.ISSUE_TYPES.items():
            keywords = config.get("keywords", [])
            if any(keyword in title_lower for keyword in keywords):
                detected_types.append({
                    "type": issue_type,
                    "verification_method": config["verification_method"],
                    "description": config["description"],
                    "reason": f"Keywords matched: {', '.join([k for k in keywords if k in title_lower])}",
                })

        # COMBINE SIGNALS: Labels override or confirm type
        primary_type = None
        verification_method = None
        reason_parts = []

        # Strong signal: Role labels indicate verification method
        if has_dev_role and not has_non_dev_role:
            verification_method = "code_inspection"
            reason_parts.append("Dev role detected (code verification needed)")
        elif has_non_dev_role and not has_dev_role:
            verification_method = "manual_review"
            reason_parts.append("Non-dev role detected (manual review needed)")

        # Use title detection if available
        if detected_types:
            primary_type = detected_types[0]["type"]
            if not verification_method:
                verification_method = detected_types[0]["verification_method"]
            reason_parts.append(f"Type detected: {detected_types[0]['reason']}")

        # Default if nothing detected
        if not primary_type:
            primary_type = "unknown"
        if not verification_method:
            verification_method = "manual_review"
            reason_parts.append("No detection signals - defaulting to manual review")

        confidence = "high" if len(reason_parts) > 1 else "medium" if reason_parts else "low"

        return {
            "primary_type": primary_type,
            "verification_method": verification_method,
            "description": f"Issue type: {primary_type}, Verification: {verification_method}",
            "confidence": confidence,
            "detected_types": detected_types,
            "reason": " | ".join(reason_parts) if reason_parts else "No detection signals",
            "label_signals": {
                "has_dev_role": has_dev_role,
                "has_non_dev_role": has_non_dev_role,
            },
        }

    def validate_title_consistency(self, issues: List[int]) -> Dict[int, str]:
        """Pre-cache all issue titles for batch processing consistency"""
        titles_by_issue = {}
        for issue_num in issues:
            issue = self.fetch_issue(issue_num)
            if issue:
                exact_title = issue.get("title", "")
                titles_by_issue[issue_num] = exact_title
                self.issue_cache[issue_num] = exact_title
        return titles_by_issue

    def _apply_decision_tree(
        self,
        title: str,
        metadata: Dict[str, bool],
        assignees: List[str],
        days_created: int,
        days_updated: int,
    ) -> Dict[str, str]:
        """Apply decision tree logic"""

        # 1. Recurring meetings
        if metadata.get("has_meeting") or metadata.get("has_meeting_title"):
            return {
                "verdict": "KEEP_OPEN",
                "category": "recurring_process",
                "confidence": "high",
                "reasoning": "This is a recurring meeting or status item",
                "action": "Keep open - legitimate ongoing process",
            }

        # 2. Draft status (not PM-ready)
        if metadata.get("has_draft") and not metadata.get("has_pm_decision"):
            return {
                "verdict": "FLAG_PM",
                "category": "draft_status",
                "confidence": "high",
                "blocker": "DRAFT - not ready for work",
                "reasoning": "Issue is in draft status and not prioritized",
                "action": "FLAG FOR PM: Review and decide if draft should be actioned or closed",
            }

        # 3. PM decision needed
        if metadata.get("has_pm_decision"):
            return {
                "verdict": "FLAG_PM",
                "category": "stakeholder_decision",
                "confidence": "high",
                "blocker": "STAKEHOLDER - needs PM approval",
                "reasoning": "Issue marked as ready for PM review/prioritization",
                "action": "FLAG FOR PM: Prioritize or decide on closure",
            }

        # 4. Stakeholder feedback
        if metadata.get("has_stakeholder") or metadata.get("has_stakeholder_title"):
            return {
                "verdict": "FLAG_PM",
                "category": "stakeholder_decision",
                "confidence": "high",
                "blocker": "STAKEHOLDER - awaiting feedback incorporation",
                "reasoning": "Issue involves stakeholder input needing PM triage",
                "action": "FLAG FOR PM: Incorporate feedback or close",
            }

        # 5. Epic issues
        if metadata.get("has_epic"):
            return {
                "verdict": "FLAG_PM",
                "category": "epic_scope",
                "confidence": "high",
                "blocker": "EPIC - needs scope clarification",
                "reasoning": "Epic requires scope review and active management",
                "action": "FLAG FOR PM: Clarify scope and status",
            }

        # 6. Security issues
        if metadata.get("has_security"):
            return {
                "verdict": "VERIFY_CODE",
                "category": "security",
                "confidence": "medium",
                "reasoning": "Security issue needs verification of fix status",
                "action": "VERIFY: Check if security concern has been addressed",
            }

        # 7. Blocked issues
        if metadata.get("has_blocked"):
            return {
                "verdict": "FLAG_PM",
                "category": "blocked",
                "confidence": "high",
                "blocker": "BLOCKED - awaiting dependencies",
                "reasoning": "Issue is blocked on other work",
                "action": "FLAG FOR PM: Review blockers and unblock if ready",
            }

        # 8. Unassigned and very old
        if not assignees and days_created > 900 and days_updated > 180:
            return {
                "verdict": "CLOSE",
                "category": "abandoned",
                "confidence": "high",
                "reasoning": f"Unassigned {days_created}d old, no updates {days_updated}d",
                "action": "CLOSE: Issue appears abandoned",
            }

        # 9. Default
        return {
            "verdict": "VERIFY_CODE",
            "category": "needs_classification",
            "confidence": "medium",
            "reasoning": "Insufficient label data - needs code inspection",
            "action": "INVESTIGATE: Check code state or flag for PM",
        }

    def find_related_commits(self, keywords: List[str], file_paths: List[str] = None) -> List[Dict[str, str]]:
        """Find commits related to an issue by keywords or files"""
        commits = []
        try:
            # Search commit messages for keywords
            for keyword in keywords:
                cmd = [
                    "git",
                    "log",
                    "--oneline",
                    "--all",
                    "-S",
                    keyword,
                    "-i",
                ]
                if file_paths:
                    cmd.extend(file_paths)

                result = subprocess.run(cmd, capture_output=True, text=True, cwd=self.repo_root)

                if result.stdout:
                    for line in result.stdout.strip().split("\n"):
                        if not line:
                            continue
                        parts = line.split(" ", 1)
                        if len(parts) == 2:
                            commit_hash = parts[0]
                            message = parts[1]
                            commits.append(
                                {
                                    "hash": commit_hash,
                                    "message": message,
                                    "keyword": keyword,
                                }
                            )

            # Search for PR references in commit messages
            pr_pattern = r"#(\d+)"
            for commit in commits:
                match = re.search(pr_pattern, commit["message"])
                if match:
                    commit["pr_number"] = match.group(1)

            # Remove duplicates, keep first occurrence
            seen = set()
            unique_commits = []
            for commit in commits:
                if commit["hash"] not in seen:
                    seen.add(commit["hash"])
                    unique_commits.append(commit)

            return unique_commits[:5]  # Return top 5 most recent
        except Exception as e:
            print(f"Error finding commits: {e}", file=sys.stderr)
            return []

    def verify_code(self, check_type: str) -> Dict[str, Any]:
        """Verify if code has been implemented/fixed"""
        import os
        import re

        if check_type not in self.CODE_CHECKS:
            return {"found": False, "evidence": "Check type not recognized"}

        check_config = self.CODE_CHECKS[check_type]
        patterns = check_config.get("patterns", [])
        keywords = check_config.get("keywords", [])

        evidence = {"files_found": [], "code_snippets": []}

        try:
            for pattern in patterns:
                search_path = os.path.join(self.repo_root, pattern)
                if not os.path.exists(search_path):
                    continue

                for root, dirs, files in os.walk(search_path):
                    # Skip node_modules and common irrelevant dirs
                    dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "dist", "build"]]

                    for file in files:
                        if not file.endswith((".tsx", ".ts", ".jsx", ".js", ".md")):
                            continue

                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                                content = f.read()

                                # Check for keywords
                                for keyword in keywords:
                                    if re.search(keyword, content, re.IGNORECASE):
                                        rel_path = filepath.replace(self.repo_root, "").lstrip("/")
                                        evidence["files_found"].append(rel_path)
                                        # Extract snippet
                                        for match in re.finditer(
                                            f".{{0,50}}{keyword}.{{0,50}}", content, re.IGNORECASE
                                        ):
                                            evidence["code_snippets"].append(match.group(0).strip())
                                        break
                        except (IOError, UnicodeDecodeError):
                            pass
        except Exception as e:
            return {"found": False, "error": str(e), "evidence": evidence}

        found = len(evidence["files_found"]) > 0
        return {"found": found, "evidence": evidence}

    def verify_batch(self, issues: List[int]) -> Dict[str, Any]:
        """Verify multiple issues and generate report"""
        results = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_issues": len(issues),
            },
            "verdicts": {"CLOSE": [], "KEEP_OPEN": [], "FLAG_PM": [], "VERIFY_CODE": []},
            "by_category": {},
        }

        for i, issue_num in enumerate(issues, 1):
            print(f"  [{i}/{len(issues)}] Processing #{issue_num}...", file=sys.stderr)
            result = self.verify_issue(issue_num)

            if "error" in result:
                continue

            verdict = result["verdict"]
            category = result["category"]

            results["verdicts"][verdict].append(result)

            if category not in results["by_category"]:
                results["by_category"][category] = []
            results["by_category"][category].append(result)

        # Add summary
        results["summary"] = {
            "close_count": len(results["verdicts"]["CLOSE"]),
            "keep_open_count": len(results["verdicts"]["KEEP_OPEN"]),
            "flag_pm_count": len(results["verdicts"]["FLAG_PM"]),
            "verify_code_count": len(results["verdicts"]["VERIFY_CODE"]),
        }

        return results


def main():
    parser = argparse.ArgumentParser(
        description="Verify stale GitHub issues and generate recommendations"
    )
    parser.add_argument("--issue", type=int, help="Verify single issue number")
    parser.add_argument(
        "--batch", help="Batch process from issues.json file"
    )
    parser.add_argument(
        "--output", default="stale_report.json", help="Output file for batch results"
    )
    parser.add_argument(
        "--list", action="store_true", help="List all stale open issues"
    )

    args = parser.parse_args()

    verifier = StaleIssueVerifier()

    if args.issue:
        # Single issue verification
        result = verifier.verify_issue(args.issue)
        print(json.dumps(result, indent=2))

    elif args.batch:
        # Batch verification
        print(f"Loading issues from {args.batch}...", file=sys.stderr)
        with open(args.batch) as f:
            issues = json.load(f)

        issue_nums = [issue["number"] for issue in issues]
        print(f"Verifying {len(issue_nums)} stale issues...", file=sys.stderr)

        # Pre-cache all titles for consistency
        print(f"Pre-caching issue titles for consistency...", file=sys.stderr)
        verifier.validate_title_consistency(issue_nums)

        report = verifier.verify_batch(issue_nums)

        with open(args.output, "w") as f:
            json.dump(report, f, indent=2)

        print(f"✅ Report saved to {args.output}", file=sys.stderr)
        print(json.dumps(report["summary"], indent=2), file=sys.stderr)

    elif args.list:
        # List stale issues
        try:
            result = subprocess.run(
                [
                    "gh",
                    "issue",
                    "list",
                    "--state",
                    "all",
                    "--limit",
                    "500",
                    "--json",
                    "number,title,state,createdAt",
                    "--jq",
                    r'.[] | select(.createdAt < "2024-03-17") | select(.state == "OPEN") | "\(.number): \(.title)"',
                ],
                capture_output=True,
                text=True,
                check=True,
            )
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"Error fetching issues: {e.stderr}", file=sys.stderr)
            sys.exit(1)

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
