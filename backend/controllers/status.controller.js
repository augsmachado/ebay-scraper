import pkg from "uuid";
import axios from "axios";

const { v4: uuidv4 } = pkg;
export default class StatusController {
	static async getStatusApi(req, res) {
		try {
			let response = {
				msg: "Current API status",
				name: "ebay-scraper-api",
				environment: "production",
				version: "1.0.0",
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
		axios
			.get(`https://www.ebay.com/`)
			.then(function (response) {
				let resp = {
					msg: "Current Server status",
					name: "ebay-scraper-server",
					environment: "production",
					version: "1.0.0",
					uptime: new Date().getTime(),
					connection: response.connection,
					hash: uuidv4(),
					status: `${response.status}`,
					status_text: `${response.statusText}`,
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
