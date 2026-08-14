import { botDescription, botShortDescription } from "@/data/bot-start";

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
  const json = (body: Record<string, unknown>) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await fetch(`${api}/setWebhook`, json({ url: `${appUrl}/api/telegram/webhook` })).catch(
    () => undefined
  );
  await fetch(
    `${api}/setChatMenuButton`,
    json({
      menu_button: {
        type: "web_app",
        text: "Магазин",
        web_app: { url: appUrl },
      },
    })
  ).catch(() => undefined);
  await fetch(
    `${api}/setMyDescription`,
    json({ description: botDescription })
  ).catch(() => undefined);
  await fetch(
    `${api}/setMyShortDescription`,
    json({ short_description: botShortDescription })
  ).catch(() => undefined);
}
