# 3ap prototype template

GitHub template repository for the Non-Dev Prototyping Path (epic CAAS-1360, story CAAS-1361,
sub-task CAAS-1374). IT creates each prototype repo from it with "Use this template".

**Status: skeleton (step a).** Directories and stub files only; every stub says what fills it
in step (b), the walking skeleton. Nothing builds yet.

## Reference implementation

`Example` is a placeholder entity, not a domain any prototype must use. It is a lean, complete
example of how 3ap writes a Spring Boot MVC API and a React frontend, so coding agents copy its
shape (layers, DTOs, errors, pagination, forms, tests) when they add a real entity. It stays in
every prototype, because the plugin's skills point at it; nothing is built on it, and it is not linked
in the app's navigation.

- Backend: packaged by layer (`controller`, `service`, `repository`, `domain`, `dto`, `mapper`,
  `config`), Lombok for boilerplate, google-java-format, JUnit 5 + Mockito + AssertJ
- Frontend: packaged by feature (`features/examples`), shared components only from `ui/`, API only
  through the generated client in `api/generated/`
- Template components (`platform/` on both sides) and the gate configs are locked
  (`config/gates/locked-paths.txt`); prototypes use them, never change them. `ui/` is the only UI
  a feature may use, but it isn't locked

| Read | For |
|---|---|
| `CLAUDE.md` | What every agent session in a prototype repo is told (rules and limits, codebase map) |
| `docs/platform-contract.md` | What the platform and the template rely on from each other |
| `docs/open-points.md` | What is still undecided |

Seam with CAAS-1375 (plugin skills) and CAAS-1377 (protection suite): the paths in the
`CLAUDE.md` codebase map, the component names `platform/login` and `platform/passcode`,
`api/openapi.yaml`, `frontend/src/api/generated/` and the `make` targets.
