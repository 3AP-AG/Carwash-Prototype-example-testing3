// Gate: lint (frontend + e2e). Locked. Run by the Makefile with `--no-inline-config`.
// Encodes template rules as errors:
// - no fetch/axios outside frontend/src/api/
// - features import UI only from '@/ui'
// - no deep imports into src/api/generated beyond its index files
// - @typescript-eslint/ban-ts-comment: no @ts-ignore / @ts-nocheck
// - no .skip / .only in tests
// - a feature imports only '@/ui', '@/api', '@/platform', never another feature (import/no-restricted-paths)
// TODO(b): write the config.
export default [];
