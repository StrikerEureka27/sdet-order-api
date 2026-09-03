import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { getOrder } from "../repositories/order-repository.js";

export async function handler(
	event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> {
	const id = event.pathParameters?.id;

	if (!id) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Order id is required",
			}),
		};
	}

	const order = await getOrder(id);

	if (!order) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "Order not found",
			}),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify(order),
	};
}
