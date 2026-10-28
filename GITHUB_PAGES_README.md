# English Success 11 — GitHub Pages deployment

This archive includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. Upload **all files and directories** to the `main` branch of `minee382/ENGLISH-11--SEMESTER-1-` (not just the workflow). Keep `src/`, `package.json`, `package-lock.json`, `build.mjs`, `dist/index.html` and `.github/`.
2. In the GitHub repository, choose Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Push to `main` or manually run the workflow from the Actions tab.
4. Check the workflow result, then open https://minee382.github.io/ENGLISH-11--SEMESTER-1-/ . That is an anticipated URL, **not a verified live site**.

Important: the included `dist/app.js` and `dist/style.css` are stale and must be rebuilt by `npm ci && npm run build` or GitHub Actions. The Phase A source contains the pastel UI. UI/browser verification was not performed here.

Locally, the phase3 test that checks `git show phase2-working-20261028:src/App.jsx` requires the original Git tag and cannot pass from a standalone ZIP. Other 28 tests passed when run on 2026-10-28.
