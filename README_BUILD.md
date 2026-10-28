# English Success 11 — fixed build

Fixed `build.mjs` to generate `dist/index.html` as well as JS and CSS.

Run with Node.js 22+:

```bash
npm ci
npm run build
npm test
```

Publish generated `dist/` using GitHub Actions (workflow in `.github/workflows/deploy-pages.yml`). In GitHub Settings > Pages, set Source to GitHub Actions.

**Important:** Build could not be executed in the current environment because network DNS to `registry.npmjs.org` is unavailable and dependencies are not installed. The generated HTML template and build script have been checked syntactically, but the final bundle is not yet verified. 28/29 tests pass; one depends on a missing Git history reference.
