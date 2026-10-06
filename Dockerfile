# One image, one Cloud Run service: Spring Boot serves the built frontend.
# TODO(b): multi-stage build
#   1. node:<lts>      → pnpm install --frozen-lockfile && pnpm build   (frontend/)
#   2. maven/temurin 25 → copy frontend/dist into backend static resources, ./mvnw -q package
#   3. temurin 25 JRE (or distroless java) → run the jar as non-root
# Two modes from the same image: `<image>` serves the app (needs PROTECTION_MODE);
# `<image> migrate` runs Flyway and exits 0 (platform/migrate), called by the pipeline's migrations step.
