import axios, { AxiosResponse } from "axios";
import Constants from "expo-constants";
const api = process.env.BACKEND_API ?? Constants.manifest?.extra?.BACKEND_API;

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

export const GetBusData = async (busNumber: string, busStopCode: string) => {
	const response = await axios.get(
		`${api}/busroutes/${busNumber}/${busStopCode}`
	);
	return response.data;
};

export const GetBusRouteData = async (busNumber: string) => {
	const response = await axios.get(
		`${api}/busroutes/${busNumber}`
	);
	return response.data;
};

export const GetBusStopList = async () => {
	const response = await axios.get(`${api}/busstops`, data);
	return response.data;
};

export const GetBusStop = async (code: string) => {
	const response = await axios.get(`${api}/busstops/${code}`, data);
	return response.data;
};

export const GetBusStopByCode = async (code: string) => {
	const response = await axios.get(`${api}/busstops?code=${code}`, data);
	return response.data;
};

export const GetNearbyBusStop = async (
	longitude: number,
	latitude: number,
	maxDistance = process.env.MAX_DISTANCE_IN_METRES ?? Constants.manifest?.extra?.MAX_DISTANCE_IN_METRES ?? 100
) => {
	if (!longitude || !latitude) {
		console.error("Latitude or longitude not provided");
		return {
			msg: "Please provide a longitude and latitude in the JSON body",
		};
	}
	const response = await axios
		.get(
			`${api}/busstops/nearest?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`
		)
		.catch((error) => {
			console.error("Error in API: " + error);
			return { msg: error };
		});
	// console.log("Nearest bus stop: " + JSON.stringify(response.data));
	return response.data;
};

export const SearchBusStop = async (term: string) => {
	const response = await axios
		.get(`${api}/busstops/search?term=${term}`, data)
		.catch((error) => {
			console.error("Error in API: " + error);
			return null;
		});
	return response.data;
};

export const GetBus = async (number: string) => {
	const response = await axios.get(`${api}/bus?number=${number}`);
	return response.data;
};

export const GetSettings = async (token: null) => {
	console.log("Token is: " + token);
	data.headers["X-Auth-Token"] = token;
	console.log("Api is: " + api);
	return await axios
		.get(`${api}/settings`, data)
		.then((res) => {
			console.log(JSON.stringify(res));
			return res.data;
		})
		.catch((error) => {
			console.error("Error in API: " + error);
			return { msg: error.message };
		});
};

export const SaveSettings = async (token: null, code: string, GoingOut = true) => {
	try {
		if (!token) {
			console.error("No token provided");
			return null;
		}

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
			.catch((error) => {
				console.warn("Error in API. Defaulting value: " + error);
				return { GoingOut: [], GoingHome: [] };
			});

		console.log("prevSettings: " + JSON.stringify(prevSettings));
		console.log("Token is still: " + data.headers["X-Auth-Token"]);

		if (GoingOut) {
			const newSettings = Object.assign({}, prevSettings, {
				GoingOut: [
					...prevSettings.GoingOut.filter((c: string) => c !== code),
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

export const RemoveCodeFromSettings = async (token: null, code: string, GoingOut = true) => {
	try {
		if (!token) {
			console.error("No token provided");
			return null;
		}

		console.log("Token in RemoveCodeFromSettings is: " + token);
		data.headers["X-Auth-Token"] = token;
		return await axios
			.put(
				`${api}/settings/update`,
				{ code: code, GoingOut: GoingOut },
				data
			)
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

export const CheckTokenExpiry = async (token: null) => {
	console.log("Checking token expiry:" + token);
	data.headers["X-Auth-Token"] = token;
	if (!token) {
		console.log("Default token has expired");
		return { msg: "Token was not provided.", expired: true };
	}
	const result = await axios.get(`${api}/auth/checkTokenExpiry`, data);
	return result.data;
};
