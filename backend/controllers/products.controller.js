import axios from "axios";
import cheerio from "cheerio";

const MINIMUM_OF_LETTERS = 2;

export default class ProductsController {
	static async getProducts(req, res) {
		const page_number = 1 || req.query.page;
		const product_name = req.query.product_name;

		const link = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${product_name}&_sacat=0&_dcat=111422&_pgn=${page_number}&rt=nc`;
		if (product_name.length >= MINIMUM_OF_LETTERS) {
			axios(link)
				.then((response) => {
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

						const price = $(element)
							.find("span.s-item__price")
							.text()
							.trim();

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
						// Extract the product_id of the product link
						const sub = link.split("/");
						const id = sub[sub.indexOf("itm") + 1].substring(
							0,
							sub[sub.indexOf("itm") + 1].indexOf("?")
						);

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
				})
				.catch((err) => {
					res.json({
						error: `Unable to search ${product} on server`,
						details: `${err}`,
					});
				});
		} else {
			res.status(412).json({
				error: "[412] Precondition failed",
				details: "Provide a product name",
			});
		}
	}

	static async getProductById(req, res) {
		const id = req.params.id;

		const link = `https://www.ebay.com/itm/${id}`;
		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const product = $("div#CenterPanelInternal");

				let product_info = [];

				product.each((index, element) => {
					const description = $(element)
						.find("h1.x-item-title__mainTitle > span")
						.text()
						.trim();

					const last_24_hours = $(element)
						.find("div.vi-notify-new-bg-dBtm > span")
						.text()
						.trim();

					const quantity_available = $(element)
						.find("span#qtySubTxt")
						.text()
						.trim();
					const price = $(element).find("span#prcIsum").text().trim();

					const logistics_cost = $(element)
						.find("span#convbidPrice")
						.text()
						.trim();

					const sold = $(element)
						.find("div.w2b.w2bsls > div")
						.text()
						.trim();

					const return_period = $(element)
						.find("div.w2b-cnt.w2b-3.w2b-brdr > span")
						.text()
						.trim();

					const delivery = $(element)
						.find(
							"span.ux-textspans.ux-textspans--BOLD.ux-textspans--NEGATIVE"
						)
						.text()
						.trim();

					const more_infos = $(element)
						.find("div.ux-labels-values__values.col-9")
						.text()
						.trim();

					product_info.push({
						product_id: id,
						link: link,
						quantity_available: quantity_available,
						price: price,
						logistics_cost: logistics_cost,
						last_24_hours: last_24_hours,
						sold: sold.substring(0, sold.indexOf(" ")),
						delivery: delivery,
						return_period: return_period.substring(
							0,
							return_period.indexOf(" ")
						),
						description: description,
						more_infos: more_infos,
					});
				});
				res.json(product_info[0]);
			})
			.catch((err) => {
				res.json({
					error: `Unable to get product by id ${id} on server`,
					details: `${err}`,
				});
			});
	}
}
