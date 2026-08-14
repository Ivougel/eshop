export function runtimeEnv(name: string): string {
  return String(process.env[name] ?? "").trim();
}
