describe("Home screen", () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

    it("should work", async () => {
        await expect(element(by.text('Hello world'))).toBeVisible();
    })
});
