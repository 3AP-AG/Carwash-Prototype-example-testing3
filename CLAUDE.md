# Prototype · built from the 3ap prototype template (version: see `.template-version`)

This file is locked (path check). It holds the facts and limits of this template
version. How to do the work lives in the 3ap App Dev plugin.

`Example` is a style exemplar, not part of the domain: it shows the shape every real entity takes.
Copy that shape; don't build on it, change it or delete it (the plugin's skills point at it), and don't
link it in the app's navigation. Its tests, `e2e/exemplars/examples/` included, run on every candidate and
must stay green: if a change of yours breaks one, fix your change, not the test.

## Never

- Edit any path in `config/gates/locked-paths.txt` (the gates, the workflows, this file and `platform/`) — CI rejects it
- Weaken a gate another way: `eslint-disable`, `@ts-ignore`, `.skip`/`.only`, `@Disabled` — the gates reject these too
- Change or delete `e2e/backlog/<ID>.spec.ts` of any backlog item other than the one in flight
- Use real data, real integrations or real credentials; synthetic data only
- Put client-identifying strings in service, database or image names, labels or token labels
- Run migrations at app startup; Flyway runs as its own pipeline step
- Add an endpoint or a page outside the security chain in `platform/security`
- Hand-write API calls or edit `frontend/src/api/generated/`; run `make generate`
- Transcribe colours, spacing or type values; they come from `design-tokens/`
- Build UI outside `@/ui`, or build your own login or passcode screen
- Pool size and `max-instances` are set by the platform on deploy, not in this repo; the database caps connections anyway. Traffic shift is the platform's. Don't try to change either

## Stack

- Backend: Java 25 · Spring Boot 4 · Spring MVC on virtual threads (no WebFlux) · Postgres · Flyway · Maven wrapper
- Frontend: React 19 · Vite · TypeScript strict · TanStack Query · React Router 7 · React Hook Form + Zod · pnpm
- One deployable: Spring Boot serves the built frontend; `/api/**` on the same origin

## Codebase map

Backend base package: `ch.aaap.prototype` (under `backend/src/main/java/`), packaged by layer.
Frontend: `frontend/src/`, packaged by feature. Paths below are relative to those roots.

| Path | What it is | Extend it when |
|---|---|---|
| `controller/` | HTTP only: maps requests to a service, returns DTOs and `PageResponse` | You add an endpoint |
| `service/` | Logic and transactions; throws the `platform/error` exceptions | You add logic |
| `repository/` | Spring Data JPA repositories | You add a query |
| `domain/` | JPA entities and their enums | You add a table |
| `dto/` | Request and response records | You add an endpoint |
| `mapper/` | Entity ↔ DTO mapping, one mapper per entity | You add a DTO |
| `config/` | The prototype's own `@Configuration`, one class per concern | You add a bean the prototype needs |
| `features/<feature>/` (frontend) | One folder per feature: pages, routes, colocated tests | You add a screen |
| `platform/login/` | Login component (both sides) | Never; use it |
| `platform/passcode/` | Passcode gate component (both sides) | Never; use it |
| `platform/security/` | Security chain, `PROTECTION_MODE` | Never; every route is already covered |
| `platform/error/` | ProblemDetail errors, `NotFoundException`, `ConflictException` | Never; throw these |
| `platform/web/PageResponse` | The one list/pagination shape | Never; return it |
| `platform/migrate/` | `<image> migrate`: Flyway as its own pipeline step | Never |
| `ui/` (`@/ui`) | The only UI components features may use | Never from a feature |
| `api/generated/` | Typed client, Zod schemas, MSW mocks from `api/openapi.yaml` | Never by hand |
| `backend/src/main/resources/db/migration/` | Flyway; next free `V<n>__<feature>.sql` | You add or change a table |
| `api/openapi.yaml` (repo root) | The FE/BE contract, generated from the backend | Never by hand |
| `e2e/backlog/<ID>.spec.ts` | One file per backlog item, tagged `@<ID>` | Only for the item in flight |

To add an entity: one class per layer on the backend and one folder under `features/` on the frontend,
then `make generate`. A frontend feature imports only `@/ui`, `@/api` and `@/platform`, never another feature.

## The `Example` exemplar

When you add an entity, copy the nearest exemplar exactly; don't invent a variant:

| Shape | Exemplar |
|---|---|
| Backend layers | `ExampleController` · `ExampleService` · `ExampleRepository` · `domain/Example` · `dto/Example*` · `ExampleMapper` |
| List, detail, form pages | `features/examples/ExampleListPage.tsx` · `ExampleDetailPage.tsx` · `ExampleFormPage.tsx` |
| Tests | `ExampleControllerTest` · `ExampleServiceTest` · `ExampleRepositoryTest` · `mock/ExampleMock` · `e2e/exemplars/examples/` |

## Code style

- Backend: google-java-format (2 spaces); `make format` fixes it, `make lint` fails on it
- Lombok, only these: `@RequiredArgsConstructor` and `@Slf4j` on services, controllers and components;
  `@Getter` and `@NoArgsConstructor(access = PROTECTED)` on entities; `@Builder` in test fixtures.
  Never `@Data`, `@Setter`, `@EqualsAndHashCode`, `@Value` or `@SneakyThrows`; DTOs are records
- Errors: `platform/error` · lists: `PageResponse` · forms: `useApiForm` in `frontend/src/platform/forms`

## Commands

`make generate` · `make format` · `make lint` · `make typecheck` · `make test` · `make check` · `make e2e` · `make dev`

Output is quiet: failures only. Add `VERBOSE=1` for full output. `make check` is what CI's gates run.
Run `make check` before every push; never push a known failure.
Run gates only through `make`: they use the locked configs in `config/gates/`, not `package.json` scripts.

## Tests

- Backend: `backend/src/test/java/`, same package as the class under test; JUnit 5, Mockito
  (`@ExtendWith(MockitoExtension.class)`), AssertJ, `// given / when / then`, `@Nested` for scenario groups
- Test data: fixtures in `mock/`, one class per entity, not built inline in each test
- Postgres for tests: one shared Testcontainers container per run, already configured in `support/`; never start your own
- Frontend: colocated `*.test.tsx`, API mocked with the generated MSW handlers
- Acceptance: `e2e/`, Chromium only, logs in once per run via `auth.setup.ts`

## This repo

- Template version: `.template-version`
- Per-prototype facts (protection mode, slug, tier, expiry): `prototype.yaml`
- Backlog: `docs/backlog.md`