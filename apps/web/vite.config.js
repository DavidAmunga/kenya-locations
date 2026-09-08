import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { createAreaPage } from "./server/create-area-page.mjs";
import { verifyRecaptcha } from "./server/verify-recaptcha.mjs";

function notionEnv(mode) {
  const env = loadEnv(mode, resolve(__dirname), "");
  return {
    apiKey: env.NOTION_API_KEY || env.VITE_NOTION_API_KEY,
    databaseId: env.NOTION_FEEDBACK_DB || env.VITE_NOTION_FEEDBACK_DB,
    recaptchaSecret: env.RECAPTCHA_SECRET_KEY,
  };
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function notionSubmitPlugin() {
  function middleware(env) {
    return async (req, res, next) => {
      const path = req.url?.split("?")[0];
      if (path !== "/api/submit-area") {
        next();
        return;
      }
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      try {
        const body = await readJsonBody(req);
        await verifyRecaptcha(env.recaptchaSecret, body.captchaToken);
        await createAreaPage(env, body);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Submit failed";
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: message }));
      }
    };
  }

  return {
    name: "notion-submit",
    configureServer(server) {
      server.middlewares.use(middleware(notionEnv(server.config.mode)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(notionEnv(server.config.mode)));
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    notionSubmitPlugin(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "kenya-locations": resolve(__dirname, "../../packages/js/lib/index.ts"),
    },
  },
  base: "/",
});
