// import { Linking } from "react-native";
import axios from "axios";
const api = process.env.API ?? "http://10.0.2.2:5000/api";

// const originalURL = await Linking.getInitialURL();

/**
 * Headers to be set for the requests
 */
const header = {
	Accept: "application/json",
};

// Set default headers
// axios.defaults.headers.common["X-Auth-Token"] =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7IklkIjoiNjE5YTBjMDhlMzE1ZGJkOGEzMDJjMDVlIiwiSXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE2Mzc1ODc1MzYsImV4cCI6MTY3MzU4NzUzNn0.uclLp8k7_18f1nrVH9LFwsfETT1ZRv6yJ55NALIM1O0";
// axios.defaults.headers.common["Referer"] = "exp://192.168.68.117:19000";

export const GetBusStopList = async () => {
	const response = await axios.get(`${api}/busstops`, header);
	return response.data;
};

export const GetBusStop = async (code) => {
	const response = await axios.get(`${api}/busstops/${code}`, header);
	return response.data;
};

export const GetBusStopByCode = async (code) => {
	const response = await axios.get(`${api}/busstops?code=${code}`, header);
	return response.data;
};

export const SearchBusStop = async (term) => {
	const response = await axios.get(
		`${api}/busstops/search?term=${term}`,
		header
	);
	return response.data;
};

export const GetBus = async (number) => {
	const response = await axios.get(`${api}/bus?number=${number}`);
	return response.data;
};

export const GetSettings = async () => {
	const settings = await axios.get(`${api}/settings`, header);
	if (settings) {
		// console.log("Settings: " + JSON.stringify(settings));
		return settings.data.settings.Settings;
	}
	return null;
}

export const SaveSettings = async (code, GoingOut = true) => {
	const prevSettings = await axios
		.get(`${api}/settings`, header)
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
	const result = await axios.get(`${api}/auth/facebook`, header);
	return result.data;
};

export const LogOut = async () => {
	const result = await axios.get(`${api}/auth/logout`, header);
	// bool
	return result.data;
}

export const CheckToken = async () => {
	const result = await axios.get(`${api}/auth/facebook/checkToken`, header);
	return result.data;
}