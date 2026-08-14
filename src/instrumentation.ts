export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const token = String(process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const appUrl = String(process.env.TELEGRAM_WEBAPP_URL ?? "")
    .trim()
    .replace(/\/$/, "");
  if (!token || !appUrl) {
    return;
  }

  const api = `https://api.telegram.org/bot${token}`;
  await fetch(`${api}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: `${appUrl}/api/telegram/webhook` }),
  }).catch(() => undefined);
  await fetch(`${api}/setChatMenuButton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu_button: {
        type: "web_app",
        text: "Магазин",
        web_app: { url: appUrl },
      },
    }),
  }).catch(() => undefined);
}
