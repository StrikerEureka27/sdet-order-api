import { beforeEach, describe, expect, it, vi } from "vitest";

import { handler } from "../src/handlers/get-order.js";
import { getOrder } from "../src/repositories/order-repository.js";

vi.mock("../src/repositories/order-repository.js", () => ({
	getOrder: vi.fn(),
}));

describe("getOrder Lambda", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return an existing order", async () => {
		vi.mocked(getOrder).mockResolvedValue({
			id: "order-123",
			productId: "product-123",
			quantity: 2,
			status: "PROCESSED",
			processedAt: "2026-08-31T10:00:00Z",
		});

		const event = {
			pathParameters: {
				id: "order-123",
			},
		} as any;

		const response = await handler(event);

		expect(response.statusCode).toBe(200);

		const body = JSON.parse(response.body!);

		expect(body).toMatchObject({
			id: "order-123",
			status: "PROCESSED",
		});

		expect(getOrder).toHaveBeenCalledWith("order-123");
	});

	it("should return 404 when the order does not exist", async () => {
		vi.mocked(getOrder).mockResolvedValue(undefined);

		const event = {
			pathParameters: {
				id: "unknown-order",
			},
		} as any;

		const response = await handler(event);

		expect(response.statusCode).toBe(404);
	});
});
