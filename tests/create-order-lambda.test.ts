import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../src/handlers/create-order.js";
import { publishEvent } from "../src/events/eventbridge.js";

vi.mock("../src/events/eventbridge.js", () => ({
	publishEvent: vi.fn(),
}));

describe("createOrder Lambda", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create an order and publish order.created", async () => {
		vi.mocked(publishEvent).mockResolvedValue();

		const event = {
			body: JSON.stringify({
				productId: "product-123",
				quantity: 2,
			}),
		} as any;

		const response = await handler(event);

		expect(response.statusCode).toBe(202);

		const body = JSON.parse(response.body as string);

		expect(body).toMatchObject({
			productId: "product-123",
			quantity: 2,
			status: "RECEIVED",
		});

		expect(body.id).toBeDefined();

		expect(publishEvent).toHaveBeenCalledTimes(1);

		expect(publishEvent).toHaveBeenCalledWith(
			"order.created",
			expect.objectContaining({
				id: expect.any(String),
				productId: "product-123",
				quantity: 2,
				status: "RECEIVED",
			}),
		);
	});

	it("should return 400 and not publish an event when input is invalid", async () => {
		const event = {
			body: JSON.stringify({
				quantity: 2,
			}),
		} as any;

		const response = await handler(event);

		expect(response.statusCode).toBe(400);

		expect(publishEvent).not.toHaveBeenCalled();
	});

	it("should fail when publishing the event fails", async () => {
		vi.mocked(publishEvent).mockRejectedValue(new Error("EventBridge unavailable"));

		const event = {
			body: JSON.stringify({
				productId: "product-123",
				quantity: 2,
			}),
		} as any;

		await expect(handler(event)).rejects.toThrow("EventBridge unavailable");
	});

	it("should return 400 for invalid JSON", async () => {
		// This kind of test is exactly the kind of improvement I'd expect an SDET to identify during a migration.
		const event = {
			body: "{ invalid json",
		} as any;

		const response = await handler(event);

		expect(response.statusCode).toBe(400);

		expect(publishEvent).not.toHaveBeenCalled();
	});
});
