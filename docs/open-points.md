# Open points

Raised while agreeing the skeleton for CAAS-1374 (2026-09-30). Each needs an owner and a decision.

| # | Open point | Why it matters | Blocks |
|---|---|---|---|
| 1 | **Login mode: who creates the demo users?** The pipeline only inserts the short-lived CI user. Nothing creates accounts for real people. Candidate: a `create-user` job like the passcode job | A login-mode prototype deploys with nobody able to log in. Until this is resolved the template defaults to `protection: passcode` | Login mode in real use |
| 2 | **CAAS-1373 contradicts itself** (single-writer path check, CAAS-1400). The state block in `docs/backlog.md` is "written only by the method skill", but "a PR that changes the state block fails the build". The method skill's own writes also go through a PR plus auto-merge | The path check can't be built as written | CAAS-1400, CAAS-1382 |
| 3 | **Real design-token export.** `design-tokens/tokens.json` is a placeholder. The source (Figma library? code package?) and the export method are unknown | "Tokens come from an export" can't be met with a placeholder | CAAS-1374 acceptance |
| 4 | **UI styling approach**. Waiting for the designer's work | Everything behind `@/ui` | Step (b) of `ui/` |
| 5 | **Platform repo name.** Workflows call `3AP-AG/<platform-repo>` | Callers can't run until it exists | `.github/workflows/*` |
| 6 | **Base package `ch.aaap.prototype` may be renamed.** Written in two places (`CLAUDE.md` map, `config/gates/locked-paths.txt`); every other path is relative | A rename after prototypes exist is a MAJOR template bump | — |
| 7 | **What the forked test skills keep is not written down yet** (`vitest-react` and `writing-junit-tests` forks, CAAS-1386) | The exemplar tests should match what the forked skills expect | CAAS-1386 |
| 8 | **Failure summary: file name and publish location** (see `platform-contract.md` §4) | The gates job and the platform must write the same file | CAAS-1381, gates job |
| 9 | **pnpm in Claude Code on the web.** Confirm it bootstraps cleanly in a cloud session; fall back to npm if not | Local checks before pushing depend on it | Step (b) |
| 10 | **IT runbook is missing the repo-settings steps** (`platform-contract.md` §7): ruleset import and auto-merge. "Use this template" copies no settings | Without them the required checks don't apply, and the lock doesn't hold | CAAS-1382, CAAS-1384 |
| 11 | **Verify on GitHub Team** (no Enterprise is planned): rulesets on private repos and `pull_request_target` as a required check. Org-level rulesets with required workflows likely need Enterprise, so the design doesn't depend on them | The lock design rests on it | CAAS-1382 |
| 12 | **Seam with CAAS-1375 changed.** The seam agreed up front named `features/<slice>` on both sides. The backend is now packaged by layer (`controller/`, `service/`, …) after PR review; the frontend keeps `features/<feature>/` | The plugin's backend skill points at these paths | CAAS-1375 |

