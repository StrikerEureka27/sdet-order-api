import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { createOrder } from "../services/create-order.js";

export async function handler(
	event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
	const body = event.body ? JSON.parse(event.body) : {};

	const { productId, quantity } = body;

	if (!productId || !quantity) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "productId and quantity are required",
			}),
		};
	}

	const order = createOrder({
		productId,
		quantity,
	});

	return {
		statusCode: 202,
		body: JSON.stringify(order),
	};
}
