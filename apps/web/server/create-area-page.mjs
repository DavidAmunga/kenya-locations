import { Client } from "@notionhq/client";

/**
 * Shared Notion page create. Used by the Vite dev server and the Cloud Function.
 * Do not import this from browser code.
 */
export async function createAreaPage(env, data) {
  const apiKey = env.apiKey;
  const databaseId = env.databaseId;
  if (!apiKey || !databaseId) {
    throw new Error("Notion is not configured on the server.");
  }

  const area = String(data?.area ?? "").trim();
  const locality = String(data?.locality ?? "").trim();
  const county = String(data?.county ?? "").trim();
  if (!area || !locality || !county) {
    throw new Error("Fill in county, locality, and area.");
  }

  const notion = new Client({ auth: apiKey });
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Area: { title: [{ text: { content: area } }] },
      Locality: { rich_text: [{ text: { content: locality } }] },
      County: { rich_text: [{ text: { content: county } }] },
    },
  });
}
