// Gate: frontend tests. Locked. Merges frontend/vite.config.ts for plugins and aliases, then
// overrides everything that decides WHAT runs and HOW results are reported:
//   include: src/**/*.test.{ts,tsx} · exclude: node_modules only · passWithNoTests: false
//   reporter: failures only + one summary line, see reporters/
// TODO(b): mergeConfig(viteConfig, defineConfig({ test: { … } })).
export default {};
