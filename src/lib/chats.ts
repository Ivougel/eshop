const chatsByUsername = new Map<string, number>();

export function rememberChat(chatId: number, username?: string) {
  if (!Number.isFinite(chatId) || chatId === 0) {
    return;
  }

  if (username) {
    chatsByUsername.set(username.replace(/^@/, "").toLowerCase(), chatId);
  }
}

export function chatIdByUsername(username: string): number | undefined {
  return chatsByUsername.get(username.replace(/^@/, "").toLowerCase());
}
