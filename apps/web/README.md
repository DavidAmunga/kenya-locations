# kenya-locations-web

Interactive demo for [kenya-locations](https://www.npmjs.com/package/kenya-locations), deployed at [kenya-locations.web.app](https://kenya-locations.web.app). UI is [coss ui](https://coss.com/ui).

## Run locally

From the monorepo root:

```bash
pnpm install
pnpm start
```

The app is served at http://localhost:3000 and uses the local `kenya-locations` workspace package.

Area submissions need Notion credentials on the **server** (Notion blocks browser calls). Copy `env.example` to `.env` and fill in the values:

```bash
cp apps/web/env.example apps/web/.env
```

Restart `pnpm start` after changing `.env`. The form posts to `/api/submit-area`; Vite forwards that to Notion.

Submissions also require **reCAPTCHA v2**. Create keys at [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) (checkbox, “I’m not a robot”). Add `localhost` and `kenya-locations.web.app` as domains. Put the **site key** in `VITE_RECAPTCHA_SITE_KEY` and the **secret** in `RECAPTCHA_SECRET_KEY`. The secret stays on the server.

## Deploy

Production deploys automatically when `main` changes `apps/web`, `packages/js`, or `data`. That workflow builds the site, deploys the `submitArea` Cloud Function, then deploys Hosting. Pull request previews deploy Hosting only and reuse the already-deployed function.

Manual deploy (requires [Firebase CLI](https://firebase.google.com/docs/cli), the Blaze plan, and access to the `kenya-locations` Firebase project). Put Notion and reCAPTCHA secrets in `apps/web/functions/.env` first (same keys as `env.example`, no `VITE_` prefix required for the function):

```bash
pnpm web:deploy
```

GitHub Actions needs these repository secrets:

| Secret | Purpose |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_KENYA_LOCATIONS` | Firebase Admin service account JSON |
| `VITE_NOTION_API_KEY` | Notion integration token (area submissions) |
| `VITE_NOTION_FEEDBACK_DB` | Notion database ID for submissions |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 site key (public, baked into the client) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v2 secret (server / Cloud Function only) |

Production submissions go through the `submitArea` Cloud Function (`apps/web/functions`). That requires the Blaze plan. The merge workflow writes function env from `VITE_NOTION_API_KEY`, `VITE_NOTION_FEEDBACK_DB`, and `RECAPTCHA_SECRET_KEY`.
