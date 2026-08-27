import { describe, expect, it } from "vitest";
import { createOrder } from "../src/services/create-order.js";

describe("createOrder", () => {
	it("should create an order with RECEIVED status", () => {
		const order = createOrder({
			productId: "product-123",
			quantity: 2,
		});

		expect(order.productId).toBe("product-123");
		expect(order.quantity).toBe(2);
		expect(order.status).toBe("RECEIVED");
		expect(order.id).toBeDefined();
	});
});
