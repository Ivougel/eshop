export type CartItem = {
  id: string;
  title: string;
  priceRub: number;
  cover?: string;
};

export type CheckoutItem = {
  title: string;
  priceRub: number;
  platformTitle: string;
  regionTitle: string;
};
