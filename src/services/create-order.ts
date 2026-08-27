import crypto from "node:crypto";

export interface CreateOrderInput {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: "RECEIVED";
}

export function createOrder(input: CreateOrderInput): Order {
  return {
    id: crypto.randomUUID(),
    productId: input.productId,
    quantity: input.quantity,
    status: "RECEIVED",
  };
}