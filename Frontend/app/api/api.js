import * as secrets from "../../config/default.json";
import axios from "axios";
import * as SQLite from "expo-sqlite";
const api = process.env.API ?? "http://10.0.2.2:5000/api";

/**
 * Headers to be set for the requests
 */
const header = {
	Accept: "application/json",
};

export const GetBusStopList = async () => {
	const response = await axios.get(`${api}/busstops`, header);
	return response.data;
};

export const GetBusStop = async (code) => {
	const response = await axios.get(`${api}/busstops?code=${code}`, header);
	return response.data;
};

export const GetBus = async (number) => {
	const response = await axios.get(`${api}/bus?number=${number}`);
	return response.data;
}