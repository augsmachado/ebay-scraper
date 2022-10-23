import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";

// Define .env config
dotenv.config();
const SERVER = process.env.SERVER_BASE_URL;
const MINIMUM_OF_LETTERS = 2;

// Define ebay_subdomains
const subdomains = [
	{
		ebay_domain: "http://www.ebay.com",
		country: "global",
	},
	{
		ebay_domain: "http://www.ebay.com.au",
		country: "australia",
	},
	{
		ebay_domain: "http://www.ebay.at",
		country: "austria",
	},
	{
		ebay_domain: "http://www.ebay.ca",
		country: "canada",
	},
	{
		ebay_domain: "http://www.ebay.fr",
		country: "france",
	},
	{
		ebay_domain: "http://www.ebay.de",
		country: "germany",
	},
	{
		ebay_domain: "http://www.ebay.com.hk",
		country: "hong kong",
	},
	{
		ebay_domain: "http://www.ebay.ie",
		country: "ireland",
	},
	{
		ebay_domain: "http://www.ebay.it",
		country: "italy",
	},
	{
		ebay_domain: "http://www.ebay.com.my",
		country: "malaysia",
	},
	{
		ebay_domain: "http://www.ebay.nl",
		country: "netherlands",
	},
	{
		ebay_domain: "http://www.ebay.ph",
		country: "philippines",
	},
	{
		ebay_domain: "http://www.ebay.pl",
		country: "poland",
	},
	{
		ebay_domain: "http://www.ebay.com.sg",
		country: "singapore",
	},
	{
		ebay_domain: "http://www.ebay.es",
		country: "spain",
	},
	{
		ebay_domain: "http://www.ebay.ch",
		country: "switzerland",
	},
	{
		ebay_domain: "http://www.ebay.co.uk",
		country: "united kingdom",
	},
];

export default class ProductsController {
	static async getProducts(req, res) {
		const page_number = 1 || req.query.page;
		const product_name = req.query.product_name;
		const country = req.query.country || "global";

		let domain = SERVER;
		try {
			for (let i = 0; i < subdomains.length; i++) {
				if (subdomains[i].country === country.toLowerCase()) {
					domain = subdomains[i].ebay_domain;
				}
			}
		} catch (err) {
			res.status(404).json({
				error: "Domain not found",
				details: `${err}`,
			});
		}

		const link = `${domain}/sch/i.html?_fromR40&_nkw=${product_name}&_sacat=0&_dcat=111422&_pgn=${page_number}&rt=nc`;
		if (product_name.length >= MINIMUM_OF_LETTERS) {
			axios(link)
				.then((response) => {
					const html = response.data;
					const $ = cheerio.load(html);
					const products = $("li.s-item.s-item__pl-on-bottom");

					let ebay_products = [];

					products.each((index, element) => {
						const product_name = $(element)
							.find("div.s-item__title")
							.text()
							.trim();

						const condition = $(element)
							.find("div.s-item__subtitle > span.SECONDARY_INFO")
							.text()
							.trim();

						const price = $(element)
							.find("span.s-item__price")
							.text()
							.trim();

						const discount = $(element)
							.find(
								"span.s-item__discount.s-item__discount > span.BOLD"
							)
							.text()
							.trim();

						const location_global = $(element)
							.find("span.s-item__location.s-item__itemLocation")
							.text()
							.trim();

						// Use this when the domain selected is different then global
						const location_local = $(element)
							.find(
								"span.s-item__location.s-item__itemLocation > span.ITALIC"
							)
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

						const sales_potential = $(element)
							.find(
								"div.s-item__detail.s-item__detail--primary > span.s-item__hotness.s-item__itemHotness > span.BOLD"
							)
							.text()
							.trim();

						const link = $(element)
							.find("div.s-item__info.clearfix > a")
							.attr("href");

						const thumbnail = $(element)
							.find("div.s-item__image-wrapper > img")
							.attr("src");

						const reviews = $(element)
							.find("div.s-item__reviews > a")
							.attr("href");

						// TODO: simplify this extraction of the product_id of the product link
						const sub = link.split("/");
						const id = sub[sub.indexOf("itm") + 1].substring(
							0,
							sub[sub.indexOf("itm") + 1].indexOf("?")
						);

						ebay_products.push({
							product_id: id,
							name: product_name,
							condition: condition,
							price: price,
							discount:
								discount.length > 0 ? discount : "uninformed",
							product_location:
								location_global.length > 0
									? location_global
									: location_local,
							logistics_cost: logistics_cost,
							description: description,
							sales_potential:
								sales_potential.length > 0
									? sales_potential
									: "uninformed",
							link: link,
							reviews: reviews,
							thumbnail: thumbnail,
						});
					});

					// Remove products without essential attributes
					for (var i = 0; i < ebay_products.length; i++) {
						if (ebay_products[i].product_location === "") {
							ebay_products.splice(i, 1);
							i--;
						}
					}

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
	}

	static async getProductById(req, res) {
		const id = req.params.id;
		const country = req.query.country || "global";

		let domain = SERVER;
		try {
			for (let i = 0; i < subdomains.length; i++) {
				if (subdomains[i].country === country.toLowerCase()) {
					domain = subdomains[i].ebay_domain;
				}
			}
		} catch (err) {
			res.status(404).json({
				error: "Domain not found",
				details: `${err}`,
			});
		}

		const link = `${domain}/itm/${id}`;
		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const product = $("div#Body");

				let product_info = [];

				product.each((index, element) => {
					const product_name = $(element)
						.find(
							"div.vim.x-item-title > h1.x-item-title__mainTitle > span.ux-textspans.ux-textspans--BOLD"
						)
						.text()
						.trim();

					const quantity_available = $(element)
						.find("span#qtySubTxt")
						.text()
						.trim();

					const price = $(element).find("span#prcIsum").text().trim();

					const discounted_price = $(element)
						.find("span#mm-saleDscPrc")
						.text()
						.trim();

					const logistics_cost = $(element)
						.find("div#prcIsumConv")
						.text()
						.trim();

					const last_24_hours = $(element)
						.find("div.vi-notify-new-bg-dBtm > span")
						.text()
						.trim();

					const sold = $(element)
						.find("div.w2b.w2bsls > div")
						.text()
						.trim();

					const delivery_global = $(element)
						.find(
							"span.ux-textspans.ux-textspans--BOLD.ux-textspans--NEGATIVE"
						)
						.text()
						.trim();

					// Use this when the domain selected is different then global
					const delivery_local = $(element)
						.find(
							"td.ux-table-section__cell > span.ux-textspans > span.ux-textspans.ux-textspans--BOLD"
						)
						.text()
						.trim();

					const return_period = $(element)
						.find("div.w2b-cnt.w2b-3.w2b-brdr > span")
						.text()
						.trim();

					const description = $(element)
						.find("h1.x-item-title__mainTitle > span")
						.text()
						.trim();

					const seller = $(element)
						.find(
							"div.d-stores-info-categories__container__info__section__title"
						)
						.attr("title");

					const feedback_profile = $(element)
						.find("div.ux-seller-section__item--seller > a")
						.attr("href");

					const store = $(element)
						.find(
							"div.d-stores-info-categories__container__action > a"
						)
						.attr("href");

					const shipping = $(element)
						.find(
							"div.ux-labels-values__values-content > div > span.ux-textspans.ux-textspans--SECONDARY"
						)
						.text()
						.trim();

					product_info.push({
						product_id: id,
						product_name: product_name
							.replace(/_/g, " ")
							.replace(/-/g, " "),
						link: link,
						quantity_available: quantity_available,
						price:
							price.length > 0
								? price.replace(/[\r\n\t]/gm, "")
								: discounted_price.replace(/[\r\n\t]/gm, ""),
						logistics_cost: logistics_cost,
						last_24_hours: last_24_hours,
						sold: sold.substring(0, sold.indexOf(" ")),
						delivery:
							delivery_global.length > 0
								? delivery_global
								: delivery_local.length > 0
								? delivery_local
								: "uninformed",
						return_period: return_period.substring(
							0,
							return_period.indexOf(" ")
						),
						description: description
							.replace(/_/g, " ")
							.replace(/-/g, " "),

						shipping: shipping,
						more_infos: {
							seller: seller,
							feedback_profile: feedback_profile,
							store: store,
						},
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
