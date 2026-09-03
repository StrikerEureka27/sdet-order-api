import { describe, expect, it } from "vitest";

const API_BASE_URL = process.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error("VITE_API_BASE_URL environment variable is required");
}

interface Order {
	id: string;
	productId: string;
	quantity: number;
	status: "RECEIVED" | "PROCESSED";
	processedAt?: string;
}

describe("Order E2E flow", () => {
	it("should eventually process a created order", async () => {
		const createResponse = await fetch(`${API_BASE_URL}/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				productId: "e2e-product",
				quantity: 2,
			}),
		});

		expect(createResponse.status).toBe(202);

		const createdOrder = (await createResponse.json()) as Order;

		expect(createdOrder.status).toBe("RECEIVED");
		expect(createdOrder.id).toBeDefined();

		const processedOrder = await waitForProcessedOrder(createdOrder.id);

		expect(processedOrder).toMatchObject({
			id: createdOrder.id,
			productId: "e2e-product",
			quantity: 2,
			status: "PROCESSED",
		});

		expect(processedOrder.processedAt).toBeDefined();
	}, 20_000);
});

async function waitForProcessedOrder(
	orderId: string,
	timeoutMs = 15_000,
	intervalMs = 500,
): Promise<Order> {
	const deadline = Date.now() + timeoutMs;

	while (Date.now() < deadline) {
		const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

		if (response.status === 200) {
			const order = (await response.json()) as Order;

			if (order.status === "PROCESSED") {
				return order;
			}
		}

		if (response.status !== 404 && response.status !== 200) {
			throw new Error(`Unexpected GET /orders response: ${response.status}`);
		}

		await sleep(intervalMs);
	}

	throw new Error(`Order ${orderId} was not processed within ${timeoutMs}ms`);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
