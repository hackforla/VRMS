---
name: 'Address warnings for rule:'
about: Describe this issue template's purpose here.
title: 'Address warnings for rule:'
labels: ''
assignees: ''

---

# v0.4 Setup Infrastructure

This ticket addresses eslint warnings for rules copied from the v0.3 branch.

# Instructions
- [ ] Review the rule documentation for the rule (see reference pages below)
- [ ] Navigate the cli to the `client` folder
- [ ] Run the lint script (e.g. `npm run lint`)
- [ ] Review the results, noting all instances where the rule is referenced.
- [ ] Address each warning using one of the following options, according to your best judgement:
  - use the `npx eslint --fix --rule {rule to fix}` command (not available for all rules)
  - correct the code according to the recommendations listed in the rule documentation
  - disable the rule for the reported line (NOTE: only use the disable instruction for a single line.  Do NOT use the more global options).  Include a comment for why this decision was made.
  - raise the rule as a topic to discuss with the group in the next meeting.  We can then decide whether to edit or drop the rule, add more global disable flags, etc.

# Acceptance Criteria
Running the lint script should result in an output that does not mention this rule (meaning all instances either corrected or marked for ignore).

# Reference
- [eslint rules](https://eslint.org/docs/rules/)
- [eslint cli reference](https://eslint.org/docs/user-guide/command-line-interface)
- [jest plugin](https://github.com/jest-community/eslint-plugin-jest#readme)
- [prettier plugin](https://github.com/prettier/eslint-config-prettier)
- [Air Bnb plugin](https://github.com/airbnb/javascript)
