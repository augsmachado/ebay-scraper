import express from "express";
import dotenv from "dotenv";

import NodeCache from "node-cache";

import status from "./routes/status.routes.js";
import products from "./routes/products.routes.js";
import deals from "./routes/deals.routes.js";

// Define .env config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Define node caching settings > default 15 seconds
const cache = new NodeCache({ stdTTL: 15 });
const verifyCache = (req, res, next) => {
	try {
		const { id } = req.params;
		if (cache.has(id)) {
			return res.status(200).json(cache.get(id));
		}
		return next();
	} catch (err) {
		throw new Error(err);
	}
};

app.use(express.json());

app.use("/", status);
app.use("/status", status);
app.use("/products", verifyCache, products);
app.use("/deals", verifyCache, deals);

app.use("*", (req, res) => {
	res.status(400).json({ error: "Not route found" });
});

app.listen(PORT, () => {
	try {
		console.log(`Server running on port ${PORT}`);
	} catch (err) {
		console.log(err);
		process.exit();
	}
});

export default app;
