import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";

// Define .env config
dotenv.config();
const SERVER = process.env.SERVER_BASE_URL;
const API_KEY = process.env.API_KEY;
const MINIMUM_OF_LETTERS = 2;

// Define ebay_subdomains
const subdomains = [
	{
		ebay_domain: "https://www.ebay.com.au",
		country: "australia",
	},
	{
		ebay_domain: "https://www.ebay.at",
		country: "austria",
	},
	{
		ebay_domain: "https://www.ebay.ca",
		country: "canada",
	},
	{
		ebay_domain: "https://www.ebay.fr",
		country: "france",
	},
	{
		ebay_domain: "https://www.ebay.de",
		country: "germany",
	},
	{
		ebay_domain: "https://www.ebay.com.hk",
		country: "hong kong",
	},
	{
		ebay_domain: "https://www.ebay.ie",
		country: "ireland",
	},
	{
		ebay_domain: "https://www.ebay.it",
		country: "italy",
	},
	{
		ebay_domain: "https://www.ebay.com.my",
		country: "malaysia",
	},
	{
		ebay_domain: "https://www.ebay.nl",
		country: "netherlands",
	},
	{
		ebay_domain: "https://www.ebay.ph",
		country: "philippines",
	},
	{
		ebay_domain: "https://www.ebay.pl",
		country: "poland",
	},
	{
		ebay_domain: "https://www.ebay.com.sg",
		country: "singapore",
	},
	{
		ebay_domain: "https://www.ebay.es",
		country: "spain",
	},
	{
		ebay_domain: "https://www.ebay.ch",
		country: "switzerland",
	},
	{
		ebay_domain: "https://www.ebay.co.uk",
		country: "united kingdom",
	},
];

export default class ProductsController {
	static async getProducts(req, res) {
		const page_number = 1 || req.query.page;
		const country = req.query.country || "https://www.ebay.com";
		const buy_now = false || req.query.buy_now;

		let product_name = req.query.product_name;
		if (typeof product_name !== 'string') {
			return res.status(400).json({
				error: "Invalid product name",
				details: "Product name must be a string",
			});

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

		const headers = req.headers["x-api-key"];
		const api_key = Buffer.from(headers, "base64").toString();

		if (api_key === API_KEY) {
			let link = `${domain}/sch/i.html?_fromR40&_nkw=${product_name}&_sacat=0&_pgn=${page_number}`;

			// Add filter buy now
			if (buy_now == true) {
				link.concat("&rt=nc&LH_BIN=1");
			}

			if (typeof product_name === 'string' && product_name.length >= MINIMUM_OF_LETTERS) {
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

							const discount = $(element)
								.find(
									"span.s-item__discount.s-item__discount > span.BOLD"
								)
								.text()
								.trim();

							const location_global = $(element)
								.find(
									"span.s-item__location.s-item__itemLocation"
								)
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
								.find(
									"span.s-item__shipping.s-item__logisticsCost"
								)
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

							const url = $(element)
								.find("a.s-item__link")
								.attr("href");

							const thumbnail = $(element)
								.find("div.s-item__image-wrapper > img")
								.attr("src");

							const reviews = $(element)
								.find("div.s-item__reviews > a")
								.attr("href");

							// TODO: simplify this extraction of the product_id of the product link
							// COMMON ERROR: Uncaught TypeError: Cannot read property 'split' of undefined
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
								price: price.toUpperCase(),
								discount:
									discount.length > 0
										? discount.toUpperCase()
										: "uninformed",
								product_location:
									location_global.length > 0
										? location_global.toUpperCase()
										: location_local.length > 0
										? location_local.toUpperCase()
										: "uninformed",
								logistics_cost: logistics_cost.toUpperCase(),
								description: description.toUpperCase(),
								sales_potential:
									sales_potential.length > 0
										? sales_potential
										: "uninformed",
								link: url,
								reviews: reviews,
								thumbnail: thumbnail,
							});
						});

						// Remove products without essential attributes
						/*for (var i = 0; i < ebay_products.length; i++) {
							if (
								ebay_products[i].name.length <= 0 ||
								ebay_products[i].product_location.length <= 0
							) {
								ebay_products.splice(i, 1);
								i--;
							}
						}*/

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

	static async getProductById(req, res) {
		// Validate and sanitize the id parameter
		const id = req.params.id;
		const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, '');
		
		const country = req.query.country || "https://www.ebay.com";

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

		const headers = req.headers["x-api-key"];
		const api_key = Buffer.from(headers, "base64").toString();

		if (api_key === API_KEY) {
			const link = `${domain}/itm/${sanitizedId}`;
			axios
				.get(link)
				.then((response) => {
					const html = response.data;
					const $ = cheerio.load(html);

					const product = $("div.main-container");
					const seller = $("div#STORE_INFORMATION");
					const images = $("div.ux-image-grid.no-scrollbar");

					// Get seller and product reviews
					let seller_infos = [];
					seller.each((index, element) => {
						const logotype = $(element)
							.find("img.x-store-information__logo")
							.attr("src");

						const seller_name = $(element)
							.find(
								"div.x-store-information__store-name-wrapper > h2"
							)
							.attr("title");

						const positive_feedback = $(element)
							.find(
								"div.x-store-information__store-name-wrapper > h4.x-store-information__highlights > span.ux-textspans"
							)
							.text()
							.trim()
							.split("%");

						const sold_items = $(element)
							.find(
								"div.x-store-information__store-name-wrapper > h4.x-store-information__highlights > span.ux-textspans.ux-textspans--SECONDARY"
							)
							.text()
							.trim();

						const contact = $(element)
							.find(
								"div.x-store-information__cta-container > a.ux-call-to-action.fake-btn.fake-btn--secondary"
							)
							.attr("href");

						const number_feedbacks = $(element)
							.find("h2.fdbk-detail-list__title > span.SECONDARY")
							.text()
							.trim();

						const store_link = $(element)
							.find("div.x-store-information__header > a")
							.attr("href");

						/*
							const rating = $(element)
							.find("div.fdbk-seller-rating__details")
							.text()
							.trim();
						*/

						seller_infos.push({
							seller: seller_name
								.replace(/_/g, " ")
								.replace(/-/g, " ")
								.toUpperCase(),
							logotype: logotype,
							contact: contact,
							positive_feedback: positive_feedback[0] + "%",
							sold_items: sold_items,
							number_feedbacks: number_feedbacks
								.replace("(", "")
								.replace(")", ""),
							//rating: rating,
							store_link: store_link,
						});
					});

					// Get product product_images
					let product_images = [];
					images.each((index, element) => {
						$(element)
							.find("button > img")
							.each((imgIndex, imgElement) => {
								const url = $(imgElement).attr("src");

								if (url) {
									product_images.push(url);
								}
							});
					});

					// Get product informations
					let product_info = [];

					product.each((index, element) => {
						const product_name = $(element)
							.find(
								"div.vim.x-item-title > h1.x-item-title__mainTitle > span.ux-textspans.ux-textspans--BOLD"
							)
							.text()
							.trim();

						const qtd = $(element)
							.find(
								"div.x-quantity__availability.evo > span.ux-textspans.ux-textspans--SECONDARY"
							)
							.text()
							.split(/(available)+/g);

						const quantity_available =
							qtd[0].trim().length > 0
								? qtd[0].trim().concat(" available")
								: "undefined";

						const price = $(element)
							.find("div.x-price-primary")
							.text()
							.trim();

						const discounted_price = $(element)
							.find(
								"div.x-bin-price__content > div.x-additional-info "
							)
							.text()
							.trim();

						const logistics_cost = $(element)
							.find(
								"div.ux-labels-values.col-12.ux-labels-values--shipping"
							)
							.text()
							.trim();

						const last_24_hours = $(element)
							.find("div.vi-notify-new-bg-dBtm > span")
							.text()
							.trim();

						const delivery_global = $(element)
							.find(
								"div.ux-labels-values.col-12.ux-labels-values__column-last-row.ux-labels-values--deliverto"
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
							.find(
								"div.ux-labels-values.col-12.ux-labels-values__column-last-row.ux-labels-values--returns > div.ux-labels-values__values.col-9"
							)
							.text()
							.trim();

						const description = $(element)
							.find("h1.x-item-title__mainTitle > span")
							.text()
							.trim();

						const upc = $(
							"div#viTabs_0_is > div.ux-layout-section-module-evo > div.ux-layout-section-evo.ux-layout-section--features > div.ux-layout-section-evo__item.ux-layout-section-evo__item--table-view > div.ux-layout-section-evo__row > div.ux-layout-section-evo__col > dl.ux-labels-values.ux-labels-values--inline.col-6.ux-labels-values__column-last-row.ux-labels-values--upc > dd.ux-labels-values__values > div.ux-labels-values__values-content"
						)
							.text()
							.trim();

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
									: discounted_price.replace(
											/[\r\n\t]/gm,
											""
									  ),
							discounted_price: discounted_price,
							logistics_cost: logistics_cost,
							last_24_hours: last_24_hours,
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

							upc: upc,
							shipping: shipping,
							product_images: product_images,
							seller_infos: seller_infos,
						});
					});

					//product_info["reviews"] = seller_infos;

					if (product_info.length == 0) {
						res.status(404).json({
							error: "[404] Not found",
							details: `The product is not available in this domain: ${domain}`,
						});
						return;
					} else {
						res.json(product_info);
					}
				})
				.catch((err) => {
					res.json({
						error: `Unable to get product by id ${id} on server`,
						details: `${err}`,
					});
				});
		} else {
			res.status(412).json({
				error: "[412] Precondition failed",
				details: "Provide Ebay Scraper API_KEY",
			});
		}
	}

	static async getReviewsByProductId(req, res) {
		const id = req.params.id;
		const country = req.query.country || "https://www.ebay.com";

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

		const headers = req.headers["x-api-key"];
		const api_key = Buffer.from(headers, "base64").toString();

		if (api_key === API_KEY) {
			const link = `${domain}/itm/${id}`;
			axios
				.get(link)
				.then((response) => {
					const html = response.data;
					const $ = cheerio.load(html);
					const seller = $("div#LISTING_FRAME_MODULE");
					const review = $("div.fdbk-detail-list");

					let seller_infos = [];

					seller.each((index, element) => {
						const logotype = $(element)
							.find(
								"img.d-stores-info-categories__container__info__image--img"
							)
							.attr("src");

						const seller_name = $(element)
							.find(
								"div.d-stores-info-categories__container__info__section > h2"
							)
							.attr("title");

						const positive_feedback_and_sold_items = $(element)
							.find(
								"div.d-stores-info-categories__container__info__section__item > span.ux-textspans.ux-textspans--BOLD"
							)
							.text()
							.trim()
							.split("%");
						const positive_feedback =
							positive_feedback_and_sold_items[0] + "%";
						const sold_items = positive_feedback_and_sold_items[1];

						const contact = $(element)
							.find(
								"a.d-stores-info-categories__container__action__contact.fake-btn.fake-btn--secondary"
							)
							.attr("href");

						const number_feedbacks = $(element)
							.find("h2.fdbk-detail-list__title > span.SECONDARY")
							.text()
							.trim();

						const read_more = $(element)
							.find(
								"div.fdbk-detail-list__btn-container > a.fdbk-detail-list__btn-container__btn.black-btn.fake-btn.fake-btn--large.fake-btn--secondary"
							)
							.attr("href");

						/*
							const rating = $(element)
							.find("div.fdbk-seller-rating__details")
							.text()
							.trim();
						*/

						seller_infos.push({
							seller: seller_name
								.replace(/_/g, " ")
								.replace(/-/g, " ")
								.toUpperCase(),
							logotype: logotype,
							contact: contact,
							positive_feedback: positive_feedback,
							sold_items: sold_items,
							number_feedbacks: number_feedbacks
								.replace("(", "")
								.replace(")", ""),
							//rating: rating,
							read_more: read_more,
						});
					});

					/*
					let reviews = [];
					review.each((index, element) => {
						const all_feedbacks = $(element).find(
							"div.fdbk-container__details__comment"
						);

						reviews.push({
							test: all_feedbacks,
						});
					});

					seller_infos["reviews"] = reviews;
					*/

					res.json(seller_infos);
				})
				.catch((err) => {
					res.json({
						error: `Unable to get product by id ${id} on server`,
						details: `${err}`,
					});
				});
		} else {
			res.status(412).json({
				error: "[412] Precondition failed",
				details: "Provide Ebay Scraper API_KEY",
			});
		}
	}
}
