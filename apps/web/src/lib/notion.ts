export async function submitAreaToNotion(data: {
  area: string;
  locality: string;
  county: string;
  captchaToken: string;
}) {
  const response = await fetch("/api/submit-area", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = `Submit failed (${response.status})`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
}
