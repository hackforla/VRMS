#!/bin/bash

##############################################################################
# VRMS Stale Issue Verification Skill
#
# Purpose: Automatically verify open stale issues (>1 year old) and determine
#          if they should be closed, kept open, or flagged for PM triage
#
# Usage: ./verify-stale-issue.sh <issue_number>
#        ./verify-stale-issue.sh 1163
#
# Output: JSON object with verdict, reasoning, and action steps
##############################################################################

set -e

ISSUE_NUM="${1:-}"

if [ -z "$ISSUE_NUM" ]; then
  echo "Usage: $0 <issue_number>"
  echo "Example: $0 1163"
  exit 1
fi

# Helper function to calculate days since date
days_since() {
  local date_str="$1"
  local date_epoch=$(date -j -f "%Y-%m-%d" "$date_str" "+%s" 2>/dev/null || date -d "$date_str" "+%s" 2>/dev/null || echo 0)
  local now_epoch=$(date "+%s")
  if [ "$date_epoch" -eq 0 ]; then
    echo "unknown"
  else
    echo $(( (now_epoch - date_epoch) / 86400 ))
  fi
}

# Fetch issue data
ISSUE_DATA=$(gh issue view "$ISSUE_NUM" --json number,title,state,labels,createdAt,updatedAt,assignees,body,milestone 2>/dev/null)

if [ -z "$ISSUE_DATA" ]; then
  echo "{\"error\": \"Issue #$ISSUE_NUM not found\"}"
  exit 1
fi

# Extract fields
TITLE=$(echo "$ISSUE_DATA" | jq -r '.title')
STATE=$(echo "$ISSUE_DATA" | jq -r '.state')
CREATED=$(echo "$ISSUE_DATA" | jq -r '.createdAt' | cut -d'T' -f1)
UPDATED=$(echo "$ISSUE_DATA" | jq -r '.updatedAt' | cut -d'T' -f1)
ASSIGNEES=$(echo "$ISSUE_DATA" | jq -r '.assignees[].login' | tr '\n' ',' | sed 's/,$//')
LABELS=$(echo "$ISSUE_DATA" | jq -r '.labels[].name' | tr '\n' '|')
BODY=$(echo "$ISSUE_DATA" | jq -r '.body // ""')

# Categorize by labels/metadata
HAS_DRAFT=$(echo "$LABELS" | grep -q "draft" && echo "true" || echo "false")
HAS_EPIC=$(echo "$LABELS" | grep -q "Epic\|epic" && echo "true" || echo "false")
HAS_PM_READY=$(echo "$LABELS" | grep -q "ready for product manager" && echo "true" || echo "false")
HAS_STAKEHOLDER=$(echo "$TITLE" | grep -q "Stakeholder\|stakeholder" && echo "true" || echo "false")
HAS_MEETING=$(echo "$LABELS" | grep -q "Agenda\|agenda\|meeting" && echo "true" || echo "false")
HAS_SECURITY=$(echo "$LABELS" | grep -q "security\|Security" && echo "true" || echo "false")
HAS_BLOCKED=$(echo "$LABELS" | grep -q "blocked\|Blocked" && echo "true" || echo "false")

DAYS_CREATED=$(days_since "$CREATED")
DAYS_UPDATED=$(days_since "$UPDATED")

# Decision tree logic
VERDICT=""
CATEGORY=""
REASONING=""
ACTION=""
BLOCKER=""
CONFIDENCE=""

# 1. Check if recurring meeting
if [ "$HAS_MEETING" = "true" ]; then
  VERDICT="KEEP_OPEN"
  CATEGORY="recurring_process"
  REASONING="This is a recurring meeting agenda or status item"
  ACTION="Keep open - this is a legitimate ongoing process"
  CONFIDENCE="high"

# 2. Check draft status
elif [ "$HAS_DRAFT" = "true" ] && [ "$HAS_PM_READY" = "false" ]; then
  VERDICT="FLAG_PM"
  CATEGORY="draft_status"
  BLOCKER="DRAFT - not ready for work"
  REASONING="Issue is in draft status and not ready for prioritization"
  ACTION="FLAG FOR PM: Review and decide if draft should be completed or closed"
  CONFIDENCE="high"

# 3. Check if PM decision needed
elif [ "$HAS_PM_READY" = "true" ]; then
  VERDICT="FLAG_PM"
  CATEGORY="stakeholder_decision"
  BLOCKER="STAKEHOLDER - needs PM approval"
  REASONING="Issue requires PM/product manager review for prioritization or approval"
  ACTION="FLAG FOR PM: Prioritize this issue or decide if it should be closed"
  CONFIDENCE="high"

# 4. Check if stakeholder feedback
elif [ "$HAS_STAKEHOLDER" = "true" ]; then
  VERDICT="FLAG_PM"
  CATEGORY="stakeholder_decision"
  BLOCKER="STAKEHOLDER - awaiting feedback incorporation"
  REASONING="Issue involves stakeholder input/feedback that needs PM triage"
  ACTION="FLAG FOR PM: Incorporate stakeholder feedback or decide on closure"
  CONFIDENCE="high"

# 5. Check if Epic
elif [ "$HAS_EPIC" = "true" ]; then
  VERDICT="FLAG_PM"
  CATEGORY="epic_scope"
  BLOCKER="EPIC - needs scope clarification"
  REASONING="Epic issue requires scope review and active management"
  ACTION="FLAG FOR PM: Clarify epic scope, status, and current priority"
  CONFIDENCE="high"

# 6. Check for security issues
elif [ "$HAS_SECURITY" = "true" ]; then
  VERDICT="VERIFY_CODE"
  CATEGORY="security"
  REASONING="Security issue needs verification of current status/fix"
  ACTION="VERIFY: Check if security concern has been addressed in code"
  CONFIDENCE="medium"

# 7. Check if blocked
elif [ "$HAS_BLOCKED" = "true" ]; then
  VERDICT="FLAG_PM"
  CATEGORY="blocked"
  BLOCKER="BLOCKED - awaiting dependencies"
  REASONING="Issue is blocked on other work"
  ACTION="FLAG FOR PM: Review blocking issues and unblock if ready"
  CONFIDENCE="high"

# 8. Check if unassigned and very old
elif [ -z "$ASSIGNEES" ] && [ "$DAYS_CREATED" -gt 900 ] && [ "$DAYS_UPDATED" -gt 180 ]; then
  VERDICT="CLOSE"
  CATEGORY="abandoned"
  REASONING="Unassigned, created ${DAYS_CREATED}+ days ago, no updates in ${DAYS_UPDATED}+ days"
  ACTION="CLOSE: Issue appears abandoned with no recent activity"
  CONFIDENCE="high"

# 9. Default: needs classification
else
  VERDICT="VERIFY_CODE"
  CATEGORY="needs_classification"
  REASONING="Insufficient data in labels/metadata - requires code verification or PM input"
  ACTION="INVESTIGATE: Check code state and/or flag for PM if still relevant"
  CONFIDENCE="medium"
fi

# Generate JSON output
cat <<EOJSON
{
  "issue": $ISSUE_NUM,
  "title": $(echo "$TITLE" | jq -R .),
  "state": "$STATE",
  "verdict": "$VERDICT",
  "category": "$CATEGORY",
  "confidence": "$CONFIDENCE",
  "reasoning": $(echo "$REASONING" | jq -R .),
  "action": $(echo "$ACTION" | jq -R .),
  "blocker": $([ -n "$BLOCKER" ] && echo "$BLOCKER" | jq -R . || echo "null"),
  "dates": {
    "created": "$CREATED",
    "updated": "$UPDATED",
    "days_since_created": $DAYS_CREATED,
    "days_since_updated": $DAYS_UPDATED
  },
  "metadata": {
    "assigned_to": $([ -n "$ASSIGNEES" ] && echo "\"$ASSIGNEES\"" || echo "null"),
    "has_draft": $HAS_DRAFT,
    "has_epic": $HAS_EPIC,
    "has_pm_ready": $HAS_PM_READY,
    "has_stakeholder": $HAS_STAKEHOLDER,
    "has_meeting": $HAS_MEETING,
    "has_security": $HAS_SECURITY,
    "has_blocked": $HAS_BLOCKED
  }
}
EOJSON
