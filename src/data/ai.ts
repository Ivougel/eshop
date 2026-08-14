export type AiService = "chatgpt" | "claude";

export type AiPlan = {
  id: string;
  service: AiService;
  title: string;
  description: string;
  priceRub: number;
};

export const aiPlans: AiPlan[] = [
  {
    id: "gpt-plus",
    service: "chatgpt",
    title: "ChatGPT Plus",
    description:
      "Полный доступ к продвинутым моделям, генерация картинок и голосовой режим, увеличенные лимиты",
    priceRub: 2450,
  },
  {
    id: "gpt-go",
    service: "chatgpt",
    title: "ChatGPT Go",
    description: "Больше сообщений и доступ к продвинутым моделям сверх бесплатной версии",
    priceRub: 760,
  },
  {
    id: "claude-pro",
    service: "claude",
    title: "Claude Pro",
    description: "Увеличенные лимиты, проекты и загрузка больших файлов",
    priceRub: 2450,
  },
];

export function getAiPlans(service: AiService): AiPlan[] {
  return aiPlans.filter((item) => item.service === service);
}
