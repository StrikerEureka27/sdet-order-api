import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export interface Order {
	id: string;
	productId: string;
	quantity: number;
	status: "PROCESSED";
	processedAt: string;
}

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export async function getOrder(id: string): Promise<Order | undefined> {
	const tableName = process.env.ORDERS_TABLE;

	if (!tableName) {
		throw new Error("ORDERS_TABLE environment variable is missing");
	}

	const response = await documentClient.send(
		new GetCommand({
			TableName: tableName,
			Key: {
				id,
			},
		}),
	);

	return response.Item as Order | undefined;
}
