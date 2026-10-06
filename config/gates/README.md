# config/gates/: the gate definitions

Locked: listed in `locked-paths.txt` and enforced by the path check. The `Makefile` calls
these files **directly**, never `package.json` scripts or configs the agent can edit, so no edit
elsewhere in the repo can weaken a gate.

| File | Gate | Closes |
|---|---|---|
| `eslint.config.js` | lint (frontend, e2e) | run with `--no-inline-config`: no `eslint-disable` comments; `ban-ts-comment` blocks `@ts-ignore`; no skipped/focused tests |
| `prettier.config.js` | lint (format) | — |
| `tsconfig.gate.json` | typecheck | self-contained strict settings; does not extend the editable `frontend/tsconfig.json` |
| `vitest.gate.config.ts` | test (frontend) | fixes include/exclude, reporter and `passWithNoTests: false` over whatever `frontend/vite.config.ts` says |
| `checkstyle.xml` | lint (backend) | run by explicit plugin coordinates, so the pom can't change it; bans `@Disabled` and Lombok annotations outside the allowed set |
| google-java-format (version pinned in the `Makefile`) | lint (backend format) | run as a CLI from the `Makefile`, so the pom can't change it |
| `reporters/` | all | failures-only output where no built-in reporter does that |
| `locked-paths.txt` | path check | the one list of locked paths |

Residual risk, for the path check (`.github/workflows/path-check.yml`) to cover: `backend/pom.xml` can still set surefire
excludes. The `Makefile` passes `-DskipTests=false -Dmaven.test.skip=false`, and the path check
should reject pom changes to surefire and failsafe sections.
