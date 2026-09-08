import { onRequest } from "firebase-functions/v2/https";
import { Client } from "@notionhq/client";

export const submitArea = onRequest(
  { cors: true, invoker: "public", region: "us-central1" },
  async (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.NOTION_API_KEY || process.env.VITE_NOTION_API_KEY;
  const databaseId =
    process.env.NOTION_FEEDBACK_DB || process.env.VITE_NOTION_FEEDBACK_DB;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const area = String(req.body?.area ?? "").trim();
  const locality = String(req.body?.locality ?? "").trim();
  const county = String(req.body?.county ?? "").trim();
  const captchaToken = String(req.body?.captchaToken ?? "").trim();

  if (!apiKey || !databaseId) {
    res.status(500).json({ error: "Notion is not configured on the server." });
    return;
  }
  if (!recaptchaSecret) {
    res.status(500).json({ error: "Captcha is not configured on the server." });
    return;
  }
  if (!area || !locality || !county) {
    res.status(400).json({ error: "Fill in county, locality, and area." });
    return;
  }

  try {
    const captchaBody = new URLSearchParams({
      secret: recaptchaSecret,
      response: captchaToken,
    });
    const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: captchaBody,
    });
    const captcha = await captchaRes.json();
    if (!captcha.success) {
      res.status(400).json({ error: "Captcha failed. Try again." });
      return;
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
    res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submit failed";
    res.status(500).json({ error: message });
  }
});
