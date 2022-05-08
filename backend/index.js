const express = require("express");

const axios = require("axios");
const cheerio = require("cheerio");
const { html } = require("cheerio/lib/static");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("Welcome to Amazon Scraper API!");
});

app.get("/products", async (req, res) => {
	const page_number = 1 || req.query.page;
	const brand = req.query.brand;
	const product = req.query.product;

	axios(
		`https://www.ebay.com/sch/i.html?_from=R40&_nkw=${product}&_sacat=0&Brand=${brand}}}&_dcat=10&_pgn=${page_number}&rt=nc`
	).then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);
		const products = $("li.s-item.s-item__pl-on-bottom");

		let ebay_products = [];

		products.each((index, element) => {
			const product_name = $(element)
				.find("h3.s-item__title")
				.text()
				.trim();

			const product_state = $(element)
				.find("span.SECONDARY_INFO")
				.text()
				.trim();

			const price = $(element).find("span.s-item__price").text().trim();

			const discount = $(element)
				.find("span.s-item__discount.s-item__discount")
				.text()
				.trim();

			const product_location = $(element)
				.find("span.s-item__location.s-item__itemLocation")
				.text()
				.trim();

			const logistics_cost = $(element)
				.find("span.s-item__shipping.s-item__logisticsCost")
				.text()
				.trim();

			const description = $(element)
				.find("div.s-item__subtitle")
				.text()
				.trim();

			const link = $(element)
				.find("div.s-item__info.clearfix > a")
				.attr("href");

			const image = $(element)
				.find("div.s-item__image-wrapper > img")
				.attr("src");

			// TODO: simplify this extraction
			const sub = link.split("/");
			const str = sub[sub.indexOf("itm") + 1];
			const id = str.substring(0, str.indexOf("?"));

			ebay_products.push({
				product_id: id,
				name: product_name,
				product_state: product_state,
				price: price,
				discount: discount,
				product_location: product_location,
				logistics_cost: logistics_cost,
				description: description,
				link: link,
				image: image,
			});
		});
		res.json(ebay_products);
	});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
