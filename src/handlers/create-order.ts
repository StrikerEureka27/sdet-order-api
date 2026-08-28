import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { createOrder } from "../services/create-order.js";
import { publishEvent } from "../events/eventbridge.js";

export async function handler(
	event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> {
	let body;

	try {
		body = event.body ? JSON.parse(event.body) : {};
	} catch {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid JSON body",
			}),
		};
	}

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

	await publishEvent("order.created", order);

	return {
		statusCode: 202,
		body: JSON.stringify(order),
	};
}
