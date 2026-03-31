#!/bin/bash

##############################################################################
# VRMS Stale Issues Batch Verification
#
# Purpose: Run verification on multiple stale issues and generate report
#
# Usage: ./verify-stale-issues-batch.sh [output_file]
#        ./verify-stale-issues-batch.sh report.json
#
# Output: JSON report with categorized verdicts and summary statistics
##############################################################################

OUTPUT_FILE="${1:-stale_issues_report.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load or create issues.json if it doesn't exist
if [ ! -f "issues.json" ]; then
  echo "Generating issues.json..." >&2
  gh issue list --state all --limit 500 --json number,title,state,createdAt,updatedAt,labels | \
    jq '[.[] | select(.createdAt < "2024-03-17") | select(.state == "OPEN")]' > issues.json
fi

TOTAL_ISSUES=$(jq 'length' issues.json)
echo "Processing $TOTAL_ISSUES stale open issues..." >&2

# Initialize report structure
REPORT_JSON='{
  "metadata": {
    "generated_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "total_issues": '$TOTAL_ISSUES'
  },
  "verdicts": {
    "CLOSE": [],
    "KEEP_OPEN": [],
    "FLAG_PM": [],
    "VERIFY_CODE": []
  },
  "by_category": {},
  "summary": {}
}'

# Track counts
declare -A verdict_counts category_counts
verdict_counts[CLOSE]=0
verdict_counts[KEEP_OPEN]=0
verdict_counts[FLAG_PM]=0
verdict_counts[VERIFY_CODE]=0

count=0
# Process each issue
jq -r '.[] | .number' issues.json | while read issue_num; do
  count=$((count + 1))

  # Run verification
  result=$(bash "$SCRIPT_DIR/verify-stale-issue.sh" "$issue_num" 2>/dev/null)

  verdict=$(echo "$result" | jq -r '.verdict')
  category=$(echo "$result" | jq -r '.category')

  # Add to report by verdict
  REPORT_JSON=$(echo "$REPORT_JSON" | jq --argjson result "$result" \
    ".verdicts[$verdict] += [\$result]")

  # Track by category
  REPORT_JSON=$(echo "$REPORT_JSON" | jq --arg cat "$category" --argjson result "$result" \
    ".by_category[\$cat] //= [] | .by_category[\$cat] += [\$result]")

  if [ $((count % 10)) -eq 0 ]; then
    echo "  Processed $count/$TOTAL_ISSUES..." >&2
  fi
done

# Generate summary counts
REPORT_JSON=$(echo "$REPORT_JSON" | jq \
  '.summary = {
    "close_count": (.verdicts.CLOSE | length),
    "keep_open_count": (.verdicts.KEEP_OPEN | length),
    "flag_pm_count": (.verdicts.FLAG_PM | length),
    "verify_code_count": (.verdicts.VERIFY_CODE | length)
  }')

# Add action items
REPORT_JSON=$(echo "$REPORT_JSON" | jq \
  '.action_items = {
    "immediate_closes": (.verdicts.CLOSE | map({issue: .issue, title: .title, action: .action})),
    "pm_flags": (.verdicts.FLAG_PM | map({issue: .issue, title: .title, blocker: .blocker, action: .action}) | sort_by(.issue)),
    "code_verifications": (.verdicts.VERIFY_CODE | map({issue: .issue, title: .title, action: .action}))
  }')

# Write output
echo "$REPORT_JSON" | jq '.' > "$OUTPUT_FILE"

echo "" >&2
echo "✅ Report generated: $OUTPUT_FILE" >&2
echo "" >&2
jq '.summary' "$OUTPUT_FILE" >&2
