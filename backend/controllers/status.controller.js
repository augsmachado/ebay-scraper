import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";

// Define .env config
dotenv.config();
const SERVER = process.env.SERVER_BASE_URL;

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

export default class StatusController {
	static async getStatusApi(req, res) {
		try {
			let response = {
				msg: "Current API status",
				name: "ebay-scraper-api",
				environment: "production",
				version: "1.1.0",
				uptime: new Date().getTime(),
				hash: uuidv4(),
			};

			res.json(response);
		} catch (err) {
			res.status(500).json({
				error: "Unable to request API status",
				details: `${err}`,
			});
		}
	}

	static async getStatusServer(req, res) {
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

		axios
			.get(`${domain}`)
			.then(function (response) {
				let resp = {
					msg: "Current Server status",
					name: "ebay-scraper-server",
					environment: "production",
					version: "1.1.0",
					uptime: new Date().getTime(),
					connection: response.connection,
					hash: uuidv4(),
					ebay_domain: domain,
					status_text: `${response.statusText}`,
					status: `${response.status}`,
				};

				res.json(resp);
			})
			.catch((err) => {
				res.status(503).json({
					error: "Unable to request server status",
					details: `${err}`,
				});
			});
	}
}
