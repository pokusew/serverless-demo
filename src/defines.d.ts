//
// The global identifiers (defines) in the code that are substituted with a value during build.
// This allows dead-code-elimination and tree-shaking.
// They can be set in wrangler.toml ([define] or [env.<name>.define])
// and also directly when using `wrangler deploy --define NAME:VALUE`
// or `wrangler dev --define NAME:VALUE`.
//
// The VALUE is a raw TypeScript code so the strings must be explicitly quoted.
// This allows passing complex statements.
//
// The NAME can also be more complex identifier.
//
// Note: Wrangler uses esbuild under the hood for building the sources.
//

// Although we expect only 'development' | 'production', we cannot enforce it
// during build-time (the programmer might supply any value),
// so we should not add such a misleading type.
// Actually, if we wanted to be really safe, we would use `unknown` (for all defines)
// since the programmer might substitute any value, not just string.
declare const MODE: string;
