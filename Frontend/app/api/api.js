// import { Linking } from "react-native";
import axios from "axios";
import * as config from "../../config/default.json";
const api = process.env.API ?? config.BACKEND_API;

/**
 * Data to be set for the requests
 */
const data = {
	withCredentials: true,
	crossdomain: true,
	headers: {
		Accept: "application/json",
		'Content-Type': 'application/json',
		"X-Auth-Token": null,
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*',
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
			console.log("Res in api: " + JSON.stringify(res));
			return res.data;
		})
		.catch((err) => {
			console.error("Error in API: " + err);
			return null;
		});
};

export const SaveSettings = async (code, GoingOut = true) => {
	const prevSettings = await axios
		.get(`${api}/settings`, data)
		.then((response) => {
			return response.data.settings.Settings;
		})
		.catch((err) => {
			return { GoingOut: [], GoingHome: [] };
		});

	if (GoingOut) {
		const newSettings = Object.assign({}, prevSettings, {
			GoingOut: [
				...prevSettings.GoingOut.filter((c) => c !== code),
				code,
			],
		});
		const response = await axios.put(`${api}/settings`, {
			settings: newSettings,
		});
		return response.data;
	} else {
		const newSettings = Object.assign({}, prevSettings, {
			GoingHome: [
				...prevSettings.GoingHome.filter((c) => c !== code),
				code,
			],
		});
		const response = await axios.put(`${api}/settings`, {
			settings: newSettings,
		});
		return response.data;
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
