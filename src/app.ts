import express from "express";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).json({
		status: "ok",
	});
});

app.post("/orders", (req, res) => {
	const { productId, quantity } = req.body;

	if (!productId || !quantity) {
		return res.status(400).json({
			message: "productId and quantity are required",
		});
	}

	const order = {
		id: crypto.randomUUID(),
		productId,
		quantity,
		status: "RECEIVED",
	};

	return res.status(202).json(order);
});
