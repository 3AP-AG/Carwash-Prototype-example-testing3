# Repo ruleset for prototype repos

"Use this template" copies files, not repository settings. IT imports `main.json` while setting
up each prototype repo (runbook step, `docs/platform-contract.md` §7): repo Settings → Rules →
Rulesets → Import a ruleset.

What it enforces on `main` (CAAS-1382):
- A PR is required, and `gates` and `path-check` must pass: a failing test cannot be merged
- Only org admins can bypass, which is the "explicit admin override"
- `path-check` fails any PR touching `config/gates/locked-paths.txt`, so a locked-path change never auto-merges
- No force push, no branch deletion

TODO(b): check the required check names against the real job names once CI runs.
