# Single entry point for humans, the agent and CI. Quiet by default: failures only, so the agent
# reads short output. VERBOSE=1 prints full output. Locked (config/gates/locked-paths.txt).
# Every gate calls its locked config in config/gates/ directly, never a package.json script.
# TODO(b): implement each target.

GATES := config/gates
# google-java-format, run as a CLI so backend/pom.xml can't change it. TODO(b): pin the version.
GJF_VERSION := <pinned>

.PHONY: generate format lint typecheck test check e2e dev

generate:   ## spec (backend test) → client (orval) → tokens (Style Dictionary)
	@echo "TODO(b): make generate" && exit 1

format:     ## google-java-format $(GJF_VERSION) --replace · prettier --write --config $(GATES)/prettier.config.js
	@echo "TODO(b): make format" && exit 1

lint:       ## eslint -c $(GATES)/eslint.config.js --no-inline-config · prettier --check --config $(GATES)/prettier.config.js · google-java-format $(GJF_VERSION) --dry-run --set-exit-if-changed · checkstyle with $(GATES)/checkstyle.xml by explicit plugin coordinates
	@echo "TODO(b): make lint" && exit 1

typecheck:  ## tsc -p $(GATES)/tsconfig.gate.json · ./mvnw -q compile
	@echo "TODO(b): make typecheck" && exit 1

test:       ## vitest run -c $(GATES)/vitest.gate.config.ts · ./mvnw -q test -DskipTests=false -Dmaven.test.skip=false
	@echo "TODO(b): make test" && exit 1

check:      ## lint → typecheck → test → staleness diff, cheapest first, stop on first failure
	@echo "TODO(b): make check" && exit 1

e2e:        ## playwright test -c e2e/playwright.config.ts against BASE_URL (failures-only reporter)
	@echo "TODO(b): make e2e" && exit 1

dev:        ## docker compose Postgres + Spring (local profile) + Vite dev server
	@echo "TODO(b): make dev" && exit 1
