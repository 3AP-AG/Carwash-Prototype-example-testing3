package ch.aaap.prototype.platform.migrate;

// `<image> migrate`: runs Flyway against the prototype's database and exits 0, without starting the
// web server. The pipeline calls it as its own step before the candidate deploy; the app itself
// never migrates at startup.
// TODO(b): profile `migrate` (application-migrate.yml): web-application-type none, Flyway enabled.
public class MigrateRunner {}
