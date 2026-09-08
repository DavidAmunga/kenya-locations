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
