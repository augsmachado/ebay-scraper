import axios from "axios";
import cheerio from "cheerio";

export default class DealsController {
	static async getFeaturedDeals(req, res) {
		const link = `https://www.ebay.com/globaldeals`;

		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const deal = $("div.col");

				let deals = [];

				deal.each((index, element) => {
					const name = $(element)
						.find("h3.dne-itemtile-title.ellipse-2")
						.attr("title");

					let aux = $(element).find("span.first").text().trim();
					aux = aux.split("$");
					const price = aux.length >= 2 ? aux[1] : aux[0];

					aux = $(element)
						.find("span.itemtile-price-strikethrough")
						.text()
						.trim();
					aux = aux.split("$");
					const original_price = aux.length >= 2 ? aux[1] : aux[0];

					// if possible, calculate the discount
					let discount = 0;
					if (original_price !== "" && price !== "") {
						discount = (
							(parseFloat(price) * 100) /
								parseFloat(original_price) -
							100
						).toFixed(2);
						aux = "";
						discount = aux.concat(discount, "%");
					}

					const currency = $(element)
						.find("div.dne-itemtile-price > meta")
						.attr("content");

					const product_condition = $(element)
						.find("span.dne-itemcard-badge-text")
						.text()
						.trim();

					const sale_status = $(element)
						.find("span.dne-itemcard-hotness.itemcard-hotness-red ")
						.text()
						.trim();

					const link = $(element)
						.find("div.dne-itemtile-detail > a")
						.attr("href");

					const image = $(element)
						.find("div.slashui-image-cntr > img")
						.attr("src");

					deals.push({
						product_name: name,
						price:
							price.length > 0
								? price.replaceAll(" ", "")
								: "uninformed",
						original_price:
							original_price.length > 0
								? original_price.replaceAll(" ", "")
								: "uninformed",
						currency: currency,
						discount: discount,
						product_condition:
							product_condition.length > 0
								? product_condition
								: null,
						sale_status:
							sale_status.length > 0 ? sale_status : "uninformed",
						link: link,
						image: image,
					});
				});
				res.json(deals);
			})
			.catch((err) => {
				res.json({
					error: `Unable to get featured deals on server`,
					details: `${err}`,
				});
			});
	}

	static async getTechDeals(req, res) {
		const link = `https://www.ebay.com/globaldeals/tech`;

		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const deal = $("div.col");

				let deals = [];

				deal.each((index, element) => {
					const name = $(element)
						.find("h3.dne-itemtile-title.ellipse-2")
						.attr("title");

					let aux = $(element).find("span.first").text().trim();
					aux = aux.split("$");
					const price = aux.length >= 2 ? aux[1] : aux[0];

					aux = $(element)
						.find("span.itemtile-price-strikethrough")
						.text()
						.trim();
					aux = aux.split("$");
					const original_price = aux.length >= 2 ? aux[1] : aux[0];

					// if possible, calculate the discount
					let discount = 0;
					if (original_price !== "" && price !== "") {
						discount = (
							(parseFloat(price) * 100) /
								parseFloat(original_price) -
							100
						).toFixed(2);
						aux = "";
						discount = aux.concat(discount, "%");
					}

					const currency = $(element)
						.find("div.dne-itemtile-price > meta")
						.attr("content");

					const product_condition = $(element)
						.find("span.dne-itemcard-badge-text")
						.text()
						.trim();

					const sale_status = $(element)
						.find("span.dne-itemcard-hotness.itemcard-hotness-red ")
						.text()
						.trim();

					const link = $(element)
						.find("div.dne-itemtile-detail > a")
						.attr("href");

					const image = $(element)
						.find("div.slashui-image-cntr > img")
						.attr("src");

					deals.push({
						product_name: name,
						price:
							price.length > 0
								? price.replaceAll(" ", "")
								: "uninformed",
						original_price:
							original_price.length > 0
								? original_price.replaceAll(" ", "")
								: "uninformed",
						currency: currency,
						discount: discount,
						product_condition:
							product_condition.length > 0
								? product_condition
								: null,
						sale_status:
							sale_status.length > 0 ? sale_status : "uninformed",
						link: link,
						image: image,
					});
				});
				res.json(deals);
			})
			.catch((err) => {
				res.json({
					error: `Unable to get tech deals on server`,
					details: `${err}`,
				});
			});
	}

	static async getFashionDeals(req, res) {
		const link = `https://www.ebay.com/globaldeals/fashion`;

		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const deal = $("div.col");

				let deals = [];

				deal.each((index, element) => {
					const name = $(element)
						.find("h3.dne-itemtile-title.ellipse-2")
						.attr("title");

					let aux = $(element).find("span.first").text().trim();
					aux = aux.split("$");
					const price = aux.length >= 2 ? aux[1] : aux[0];

					aux = $(element)
						.find("span.itemtile-price-strikethrough")
						.text()
						.trim();
					aux = aux.split("$");
					const original_price = aux.length >= 2 ? aux[1] : aux[0];

					// if possible, calculate the discount
					let discount = 0;
					if (original_price !== "" && price !== "") {
						discount = (
							(parseFloat(price) * 100) /
								parseFloat(original_price) -
							100
						).toFixed(2);
						aux = "";
						discount = aux.concat(discount, "%");
					}

					const currency = $(element)
						.find("div.dne-itemtile-price > meta")
						.attr("content");

					const product_condition = $(element)
						.find("span.dne-itemcard-badge-text")
						.text()
						.trim();

					const sale_status = $(element)
						.find("span.dne-itemcard-hotness.itemcard-hotness-red ")
						.text()
						.trim();

					const link = $(element)
						.find("div.dne-itemtile-detail > a")
						.attr("href");

					const image = $(element)
						.find("div.slashui-image-cntr > img")
						.attr("src");

					deals.push({
						product_name: name,
						price:
							price.length > 0
								? price.replaceAll(" ", "")
								: "uninformed",
						original_price:
							original_price.length > 0
								? original_price.replaceAll(" ", "")
								: "uninformed",
						currency: currency,
						discount: discount,
						product_condition:
							product_condition.length > 0
								? product_condition
								: null,
						sale_status:
							sale_status.length > 0 ? sale_status : "uninformed",
						link: link,
						image: image,
					});
				});
				res.json(deals);
			})
			.catch((err) => {
				res.json({
					error: `Unable to get fashion deals on server`,
					details: `${err}`,
				});
			});
	}

	static async getHomeDeals(req, res) {
		const link = `https://www.ebay.com/globaldeals/home`;

		axios
			.get(link)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const deal = $("div.col");

				let deals = [];

				deal.each((index, element) => {
					const name = $(element)
						.find("h3.dne-itemtile-title.ellipse-2")
						.attr("title");

					let aux = $(element).find("span.first").text().trim();
					aux = aux.split("$");
					const price = aux.length >= 2 ? aux[1] : aux[0];

					aux = $(element)
						.find("span.itemtile-price-strikethrough")
						.text()
						.trim();
					aux = aux.split("$");
					const original_price = aux.length >= 2 ? aux[1] : aux[0];

					// if possible, calculate the discount
					let discount = 0;
					if (original_price !== "" && price !== "") {
						discount = (
							(parseFloat(price) * 100) /
								parseFloat(original_price) -
							100
						).toFixed(2);
						aux = "";
						discount = aux.concat(discount, "%");
					}

					const currency = $(element)
						.find("div.dne-itemtile-price > meta")
						.attr("content");

					const product_condition = $(element)
						.find("span.dne-itemcard-badge-text")
						.text()
						.trim();

					const sale_status = $(element)
						.find("span.dne-itemcard-hotness.itemcard-hotness-red ")
						.text()
						.trim();

					const link = $(element)
						.find("div.dne-itemtile-detail > a")
						.attr("href");

					const image = $(element)
						.find("div.slashui-image-cntr > img")
						.attr("src");

					deals.push({
						product_name: name,
						price:
							price.length > 0
								? price.replaceAll(" ", "")
								: "uninformed",
						original_price:
							original_price.length > 0
								? original_price.replaceAll(" ", "")
								: "uninformed",
						currency: currency,
						discount: discount,
						product_condition:
							product_condition.length > 0
								? product_condition
								: null,
						sale_status:
							sale_status.length > 0 ? sale_status : "uninformed",
						link: link,
						image: image,
					});
				});
				res.json(deals);
			})
			.catch((err) => {
				res.json({
					error: `Unable to get home deals on server`,
					details: `${err}`,
				});
			});
	}
}
