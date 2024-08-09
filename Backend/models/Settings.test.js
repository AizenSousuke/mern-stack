const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Settings = require("./Settings");

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe("Settings Model Test", () => {
	it("should create & save a new settings successfully", async () => {
		const validSettings = new Settings({
			UserId: new mongoose.Types.ObjectId(),
			Settings: {
				GoingHome: [
					{
						BusStopCode: 12345,
						BussesTracked: [23, 45, 67],
					},
				],
				GoingOut: [
					{
						BusStopCode: 54321,
						BussesTracked: [78, 89, 90],
					},
				],
			},
		});
		const savedSettings = await validSettings.save();
		expect(savedSettings._id).toBeDefined();
		expect(savedSettings.Settings.GoingHome[0].BusStopCode).toBe(12345);
		expect(savedSettings.Settings.GoingOut[0].BussesTracked).toEqual([
			78, 89, 90,
		]);
	});

	it("should require UserId field", async () => {
		const settingsWithoutUserId = new Settings({
			Settings: {
				GoingHome: [
					{
						BusStopCode: 12345,
						BussesTracked: [23, 45, 67],
					},
				],
				GoingOut: [
					{
						BusStopCode: 54321,
						BussesTracked: [78, 89, 90],
					},
				],
			},
		});
		let err;
		try {
			await settingsWithoutUserId.save();
		} catch (error) {
			err = error;
		}

		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.UserId).toBeDefined();
	});

	it("should default DateCreated and DateUpdated to now", async () => {
		const validSettings = new Settings({
			UserId: new mongoose.Types.ObjectId(),
			Settings: {
				GoingHome: [
					{
						BusStopCode: 12345,
						BussesTracked: [23, 45, 67],
					},
				],
				GoingOut: [
					{
						BusStopCode: 54321,
						BussesTracked: [78, 89, 90],
					},
				],
			},
		});
		const savedSettings = await validSettings.save();
		expect(savedSettings.DateCreated).toBeDefined();
		expect(savedSettings.DateUpdated).toBeDefined();
		expect(savedSettings.DateCreated).toEqual(savedSettings.DateUpdated);
	});

	it("should update DateUpdated field on save", async () => {
		const validSettings = new Settings({
			UserId: new mongoose.Types.ObjectId(),
			Settings: {
				GoingHome: [
					{
						BusStopCode: 12345,
						BussesTracked: [23, 45, 67],
					},
				],
				GoingOut: [
					{
						BusStopCode: 54321,
						BussesTracked: [78, 89, 90],
					},
				],
			},
		});

		const savedSettings = await validSettings.save();
		const initialUpdatedTime = savedSettings.DateUpdated;

		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Update settings
		savedSettings.Settings.GoingHome.push({
			BusStopCode: 67890,
			BussesTracked: [12, 34, 56],
		});
		savedSettings.DateUpdated = Date.now();
		const updatedSettings = await savedSettings.save();

		expect(updatedSettings.DateUpdated.getTime()).toBeGreaterThan(
			initialUpdatedTime.getTime()
		);
	});

	it("should remove all tracked busses when an empty array is passed to the bus stop", async () => {
		const validSettings = new Settings({
			UserId: new mongoose.Types.ObjectId(),
			Settings: {
				GoingHome: [
					{
						BusStopCode: 12345,
						BussesTracked: [23, 45, 67],
					},
				],
				GoingOut: [
					{
						BusStopCode: 54321,
						BussesTracked: [78, 89, 90],
					},
				],
			},
		});

		var busStopWithCode = validSettings.Settings.GoingHome.filter(src => src.BusStopCode === 12345)[0];
		console.log(busStopWithCode);
		busStopWithCode.BussesTracked = [];
		await validSettings.save();

		expect(validSettings.Settings.GoingHome.filter(src => src.BusStopCode === 12345)[0].BussesTracked).toEqual([]);
	});
});
