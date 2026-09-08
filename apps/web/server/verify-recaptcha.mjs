/**
 * Verify a reCAPTCHA v2 token with Google. Server-only.
 */
export async function verifyRecaptcha(secret, token) {
  if (!secret) {
    throw new Error("Captcha is not configured on the server.");
  }
  if (!token) {
    throw new Error("Complete the captcha.");
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error("Captcha failed. Try again.");
  }
}
