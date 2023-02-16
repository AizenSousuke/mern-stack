import { reloadApp } from "detox-expo-helpers";

describe("App", () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	// beforeEach(async () => {
	// 	await reloadApp();
	// });

	it("Works", async () => {
		await expect(element(by.text("Yet"))).toBeVisible();
	});
});
