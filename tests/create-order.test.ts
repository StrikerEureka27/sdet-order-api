import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("POST /orders", () => {
	it("should create an order", async () => {
		const response = await request(app).post("/orders").send({
			productId: "product-123",
			quantity: 2,
		});

		expect(response.status).toBe(202);

		expect(response.body).toMatchObject({
			productId: "product-123",
			quantity: 2,
			status: "RECEIVED",
		});

		expect(response.body.id).toBeDefined();
	});

	it("should return 400 when productId is missing", async () => {
		const response = await request(app).post("/orders").send({
			quantity: 2,
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("productId and quantity are required");
	});
});
