const chatsByUsername = new Map<string, number>();
const chatsByUserId = new Map<number, number>();

export function rememberChat(chatId: number, username?: string, userId?: number) {
  if (!Number.isFinite(chatId) || chatId === 0) {
    return;
  }

  if (userId && userId > 0) {
    chatsByUserId.set(userId, chatId);
  }

  if (username) {
    chatsByUsername.set(username.replace(/^@/, "").toLowerCase(), chatId);
  }
}

export function chatIdByUsername(username: string): number | undefined {
  return chatsByUsername.get(username.replace(/^@/, "").toLowerCase());
}

export function chatIdByUserId(userId: number): number | undefined {
  return chatsByUserId.get(userId) ?? (userId > 0 ? userId : undefined);
}
