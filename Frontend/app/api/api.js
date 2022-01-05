import axios from "axios";
import * as config from "../../config/default.json";
const api = process.env.API ?? config.BACKEND_API;

/**
 * Data to be set for the requests
 */
var data = {
	withCredentials: true,
	crossdomain: true,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Auth-Token": null,
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "*",
	},
};

export const GetBusStopList = async () => {
	const response = await axios.get(`${api}/busstops`, data);
	return response.data;
};

export const GetBusStop = async (code) => {
	const response = await axios.get(`${api}/busstops/${code}`, data);
	return response.data;
};

export const GetBusStopByCode = async (code) => {
	const response = await axios.get(`${api}/busstops?code=${code}`, data);
	return response.data;
};

export const SearchBusStop = async (term) => {
	const response = await axios.get(
		`${api}/busstops/search?term=${term}`,
		data
	);
	return response.data;
};

export const GetBus = async (number) => {
	const response = await axios.get(`${api}/bus?number=${number}`);
	return response.data;
};

export const GetSettings = async (token) => {
	console.log("Token is: " + token);
	data.headers["X-Auth-Token"] = token;
	console.log("Api is: " + api);
	return await axios
		.get(`${api}/settings`, data)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error("Error in API: " + err);
			return null;
		});
};

export const SaveSettings = async (token, code, GoingOut = true) => {
	try {
		console.log("Token in SaveSettings is: " + token);
		data.headers["X-Auth-Token"] = token;
		console.log("X-Auth-Token in data is: " + JSON.stringify(data));
		const prevSettings = await axios
			.get(`${api}/settings`, data)
			.then((response) => {
				// If there is a setting
				if (response.data?.settings) {
					console.log(
						"Settings found: " +
							JSON.stringify(response.data?.settings)
					);
					return response.data.settings.Settings;
				} else {
					console.log("No settings. Creating new ones.");
					return { GoingOut: [], GoingHome: [] };
				}
			})
			.catch((err) => {
				console.warn("Error in API. Defaulting value: " + err);
				return { GoingOut: [], GoingHome: [] };
			});

		console.log("prevSettings: " + JSON.stringify(prevSettings));
		console.log("Token is still: " + data.headers["X-Auth-Token"]);

		if (GoingOut) {
			const newSettings = Object.assign({}, prevSettings, {
				GoingOut: [
					...prevSettings.GoingOut.filter((c) => c !== code),
					code,
				],
			});

			data.body = {
				settings: newSettings,
			};
			console.log("New data: " + JSON.stringify(data));
			return await axios
				.put(`${api}/settings`, data.body, data)
				.then((res) => {
					return res.data;
				})
				.catch((error) => console.error("Error in API: " + error));
		} else {
			const newSettings = Object.assign({}, prevSettings, {
				GoingHome: [
					...prevSettings.GoingHome.filter((c) => c !== code),
					code,
				],
			});

			data.body = {
				settings: newSettings,
			};
			console.log("New data: " + JSON.stringify(data));
			return await axios
				.put(`${api}/settings`, data.body, data)
				.then((res) => {
					return res.data;
				})
				.catch((error) => console.error("Error in API: " + error));
		}
	} catch (error) {
		console.error(error);
	}
};

export const RemoveCodeFromSettings = async (token, code, GoingOut = true) => {
	try {
		console.log("Token in SaveSettings is: " + token);
		data.headers["X-Auth-Token"] = token;
		return await axios
			.put(`${api}/settings/update`, { code: code, GoingOut: GoingOut }, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				console.error("Error in API: " + error);
			});
	} catch (error) {
		console.error(error);
	}
};

export const SignIn = async () => {
	const result = await axios.get(`${api}/auth/facebook`, data);
	return result.data;
};

export const LogOut = async () => {
	const result = await axios.get(`${api}/auth/logout`, data);
	// bool
	return result.data;
};

export const CheckToken = async () => {
	const result = await axios.get(`${api}/auth/facebook/checkToken`, data);
	return result.data;
};
