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

