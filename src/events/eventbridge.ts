import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({});

export async function publishEvent(detailType: string, detail: unknown) {
	const command = new PutEventsCommand({
		Entries: [
			{
				Source: "order-api",
				DetailType: detailType,
				Detail: JSON.stringify(detail),
				EventBusName: process.env.EVENT_BUS_NAME ?? "default",
			},
		],
	});

	const response = await client.send(command);

	if (response.FailedEntryCount && response.FailedEntryCount > 0) {
		throw new Error("Failed to publish EventBridge event");
	}

	return response;
}
