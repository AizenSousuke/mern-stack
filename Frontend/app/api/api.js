// import { Linking } from "react-native";
import axios from "axios";
const api = process.env.API ?? "http://10.0.2.2:5000/api";

// const originalURL = await Linking.getInitialURL();

/**
 * Data to be set for the requests
 */
const data = {
	headers: {
		"Accept": "application/json",
		"X-Auth-Token": null,
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
	const settings = await axios.get(`${api}/settings`, data);
	if (settings) {
		// console.log("Settings: " + JSON.stringify(settings));
		return settings.data.settings.Settings;
	}
	return null;
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
