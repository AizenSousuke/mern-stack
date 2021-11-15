import * as secrets from "../../config/default.json";
import axios from "axios";
import * as SQLite from "expo-sqlite";

/**
 * Strings for use in SQL
 */
const dataKey = {
	BusStopList: "BusStopList",
	Settings: "Settings",
	GoingOut: "GoingOut",
	GoingBack: "GoingBack",
};
/**
 * Store the bus stops here
 */
const databaseName = "sgbus.db";
/**
 * Store user settings here
 *
 * Should store the Going Out List and the Going Home List in 2 entries
 * For future use, the going out list can be a list of list (with the bus services saved)
 * I.e,
 * Going Out
 * [{
 * 		"busStop": ["service_966", "service_911"]
 * }]
 */
const settingsDatabaseName = "settings.db";
/**
 * Api key to be provided from a secrets.json file
 */
const apiKey = secrets.apiKey;
/**
 * Headers to be set for the requests
 */
const header = {
	AccountKey: apiKey,
	Accept: "application/json",
};
var BusArrivalURL =
	"http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2";
var BusStopsURL = "http://datamall2.mytransport.sg/ltaodataservice/BusStops";

var db = SQLite.openDatabase(databaseName);

export const getBusArrival = async (code, serviceNumber = null) => {
	var data = await axios
		.get(BusArrivalURL, {
			headers: header,
			params: {
				BusStopCode: code,
				ServiceNo: serviceNumber,
			},
		})
		.then((res) => {
			// console.log(res.data);
			return res.data;
		});

	return data;
};

export const getBusStops = async (skip = null) => {
	var data = await axios
		.get(BusStopsURL, {
			headers: header,
			params: {
				$skip: skip * 500,
			},
		})
		.then((res) => {
			// console.log(res.data);
			return res.data;
		});

	return data;
};

export const getAllBusStops = async () => {
	// var data = await Promise.all[]
};

/**
 * Create Bus Stop Table if it doesn't exists
 */
export const BusStopTableCheck = () => {
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
					CREATE TABLE IF NOT EXISTS ${dataKey.BusStopList} (
						Id INTEGER PRIMARY KEY AUTOINCREMENT,
						Data nvarchar NULL,
						LastUpdated datetime2 DEFAULT CURRENT_TIMESTAMP
					);
				`,
				[],
				(res, result) => {
					tx.executeSql(
						`
						SELECT * FROM ${dataKey.BusStopList};
					`,
						[],
						(res, result) => {
							resolve(
								JSON.stringify(result.rows._array, null, "\t")
							);
						},
						(err) => {
							console.log("Error: %s", err);
							reject(null);
						}
					);
				},
				(err) => {
					console.log("Error: %s", err);
					reject(null);
				}
			);
		});
	});
};

export const settingsTableCheck = () => {
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				CREATE TABLE IF NOT EXISTS ${dataKey.Settings} (
					Id INTEGER PRIMARY KEY,
					Data nvarchar NULL,
					LastUpdated datetime2 DEFAULT CURRENT_TIMESTAMP
				);
			`,
				[],
				(res, result) => {},
				(err) => {
					console.error("Error: %s", err);
					reject(null);
				}
			);
		});
	});
};

export const DeleteTable = (value) => {
	try {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					`
					DROP TABLE IF EXISTS ${value ?? dataKey.BusStopList}
					`,
					[],
					(res, result) => {
						console.log("Deleted table: %s", value);
						resolve(true);
					},
					(err, result) => {
						console.error(result.message);
						reject(false);
					}
				);
			});
		});
	} catch (error) {
		console.log(error);
	}
};

/**
 * Stores a data into Bus Stop List Table
 * @param {any} value Data to store
 * @returns true if data is successfully saved
 */
export const storeData = (value) => {
	try {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					// tx.executeSql(`
					// DROP TABLE BusStopList
					// `);

					BusStopTableCheck(tx);

					tx.executeSql(
						`
						INSERT INTO ${dataKey.BusStopList} (
							Data
						) VALUES (
							?
						)
					`,
						[JSON.stringify(value)],
						(tx, res) => {
							// console.log("Value: " + JSON.stringify(value));
							// console.log("Res: " + JSON.stringify(res));
							resolve(true);
						}
					);
				},
				(err) => {
					console.error("Error in storing to SQLite " + err.message);
					reject(false);
				},
				() => {
					console.log("Successfully stored data in SQLite");
				}
			);
		});
	} catch (error) {
		console.log("Saving Error: " + error);
	}
};

/**
 * Get data from the Database
 * @param {string} value If value is provided, it will search the SQL table for that value
 */
export const getData = (value = null) => {
	try {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					if (value == null) {
						console.log("Value provided is null");
						tx.executeSql(
							`
							SELECT Data FROM ${dataKey.BusStopList};
						`,
							[],
							(tx, res) => {
								resolve(res.rows._array);
							},
							(err) => {
								console.log("Error getting data ", err);
								reject(null);
							}
						);
					} else {
						tx.executeSql(
							`
							SELECT Data FROM ${dataKey.BusStopList}
							WHERE 
								Data LIKE '%' + ? + '%';
						`,
							[value],
							(tx, res) => {
								// res.rows._array.forEach((item) => {
								// 	console.log("Items: %s", item);
								// });
								// console.log("Value: " + JSON.stringify(value));
								// console.log("Res: " + JSON.stringify(res));
								resolve(res.rows._array);
							},
							(err) => {
								console.log(
									"Error getting filtered data ",
									err
								);
								reject(null);
							}
						);
					}
				},
				(err) => {
					console.error(
						"Error in getting data from SQLite " + err.message
					);
					reject(null);
				},
				() => {
					console.log("Successfully read data from SQLite");
				}
			);
		});
	} catch (error) {
		console.log("Get Data Error: " + error);
	}
};

/**
 * Gets the last updated date of the bus stops in order to update
 * it if required
 */
export const getLastUpdatedDate = () => {
	try {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) =>
					tx.executeSql(
						`
							SELECT LastUpdated 
							FROM ${dataKey.BusStopList}
							ORDER BY LastUpdated DESC
						`,
						[],
						(tx, res) => {
							if (res.rows._array.length > 0) {
								// console.log(
								// 	"Last updated date: ",
								// 	res.rows.item(0).LastUpdated
								// );
								resolve(res.rows.item(0).LastUpdated);
							} else {
								resolve(null);
							}
						},
						(err) => {
							console.log("Error executing sql {0}", err);
							reject(null);
						}
					),
				(err) => {
					console.log("Error reading transaction {0}", err);
					reject(null);
				},
				() => {
					console.log("Successfully read transaction");
					resolve(null);
				},
				(err) => {
					console.log("Error %s", err);
					reject(null);
				}
			);
		});
	} catch (error) {
		console.log("Error getting last updated date from db {0}", error);
	}
};

export const DeleteBusStopList = () => {
	try {
		return new Promise((resolve, reject) => {
			db.transaction((tx) =>
				tx.executeSql(
					`
					DELETE FROM ${dataKey.BusStopList} WHERE Data NOT NULL
					`,
					[],
					(res) => {
						console.log("Deleted items from table");
						resolve(true);
					},
					(err) => {
						console.log("Error deleting items from table ", err);
						reject(false);
					}
				)
			);
		});
	} catch (error) {}
};

// Sample function
export const SampleFunctionThatReturnsSomething = (param) => {
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`SQL STATEMENT`,
				[parameters],
				(transaction, resultSet) => {
					resolve(resultSet);
				},
				(transaction, error) => {
					reject(error);
				}
			);
		});
	});
};

// Get bus stop list
export const GetBusStopList = async () => {
	console.log("Getting bus stop list");
	const response = await axios.get(`http://10.0.2.2:5000/api/busstops`, {
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.data;
};
