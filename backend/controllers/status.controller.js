import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";

// Define .env config
dotenv.config();

export default class StatusController {
	static async getStatusApi(req, res) {
		try {
			let response = {
				msg: "Current API status",
				name: process.env.API_NAME,
				environment: process.env.API_ENVIROMENT,
				version: process.env.API_VERSION,
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
		const domain = process.env.SERVER_BASE_URL;

		axios
			.get(`${domain}`)
			.then(function (response) {
				let resp = {
					msg: "Current Server status",
					name: process.env.SERVER_NAME,
					environment: process.env.SERVER_ENVIROMENT,
					version: process.env.SERVER_VERSION,
					status: `${response.status}`,
					status_text: `${response.statusText}`,
					uptime: new Date().getTime(),
					hash: uuidv4(),
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
