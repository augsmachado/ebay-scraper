import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";

// Define .env config
dotenv.config();
const SERVER = process.env.SERVER_BASE_URL;
const API_KEY = process.env.API_KEY;
const MINIMUM_OF_LETTERS = 2;

export default class SellersController {
	static async getSellerProducts(req, res) {
		const page_number = 1 || req.query.page;
		const seller_name = req.query.seller_name.toLowerCase();

		let domain = SERVER;

		const headers = req.headers["x-api-key"];
		const api_key = Buffer.from(headers, "base64").toString();

		if (api_key === API_KEY) {
			const link = `https://www.ebay.com/sch/i.html?_dkr=1&iconV2Request=true&_blrs=recall_filtering&_ssn=${seller_name}&store_name=${seller_name}&_oac=1&_pgn=${page_number}&rt=nc&_ipg=240`;
			if (seller_name.length >= MINIMUM_OF_LETTERS) {
				axios(link)
					.then((response) => {
						const html = response.data;
						const $ = cheerio.load(html);
						const products = $("li.s-item.s-item__pl-on-bottom");

						let ebay_products = [];
						products.each((index, element) => {
							const products_name = $(element)
								.find("div.s-item__title")
								.text()
								.trim();

							const condition = $(element)
								.find(
									"div.s-item__subtitle > span.SECONDARY_INFO"
								)
								.text()
								.trim();

							const price = $(element)
								.find("span.s-item__price")
								.text()
								.trim();

							const location = $(element)
								.find(
									"span.s-item__location.s-item__itemLocation"
								)
								.text()
								.trim();

							const logistics_cost = $(element)
								.find(
									"span.s-item__shipping.s-item__logisticsCost"
								)
								.text()
								.trim();

							const url = $(element)
								.find("a.s-item__link")
								.attr("href");

							const thumbnail = $(element)
								.find("div.s-item__image-wrapper > img")
								.attr("src");

							const sub = url.split("/");
							const id = sub[sub.indexOf("itm") + 1].substring(
								0,
								sub[sub.indexOf("itm") + 1].indexOf("?")
							);

							ebay_products.push({
								product_id: id,
								name:
									products_name.length > 0
										? products_name.toUpperCase()
										: product_name.toUpperCase(),
								condition: condition.toUpperCase(),
								price: price,
								product_location:
									location.length > 0
										? location.toUpperCase()
										: "uninformed",
								logistics_cost: logistics_cost.toUpperCase(),
								link: url,
								thumbnail: thumbnail,
							});
						});

						ebay_products.shift();
						ebay_products.shift();

						res.json(ebay_products);
					})
					.catch((err) => {
						res.json({
							error: `Unable to search ${product_name} on server`,
							details: `${err}`,
						});
					});
			} else {
				res.status(412).json({
					error: "[412] Precondition failed",
					details: "Provide a product name",
				});
			}
		} else {
			res.status(412).json({
				error: "[412] Precondition failed",
				details: "Provide Ebay Scraper API_KEY",
			});
		}
	}
}
