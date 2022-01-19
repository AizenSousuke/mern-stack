const request = require("supertest");
const app = require("../../../server");
const api = request(app);
// jest.setTimeout(10000);
// Note: Remember to use {} in test.json in config folder

describe("/BusStops Test", () => {
	it("should return a Bus Stop data with provided with a code query string", (done) => {
		api.get("/api/BusStops")
			.query({ code: 44229 })
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.body).toHaveProperty("busStop");
				return done();
			});
	});

	it("should return 422 when there is no code query string provided", (done) => {
		api.get("/api/BusStops")
			.expect(422)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				return done();
			});
	});

	it("should return 404 when the bus stop doesn't exists", (done) => {
		api.get("/api/BusStops")
			.query({ code: 12345 })
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.status).toBe(404);
				done();
			});
	});

	it("should get the list of nearest bus stop based on lat and long provided", (done) => {
		api.get("/api/BusStops/nearest")
			.query({ latitude: 1.377725, longitude: 103.7699767 })
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.body.busStopsNearby.length).toBeGreaterThan(0);
				done();
			});
	});

	it("should get an empty list of nearest bus stop based on lat and long provided outside Singapore", (done) => {
		api.get("/api/BusStops/nearest")
			.query({ latitude: 10.377725, longitude: 103.7699767 })
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.body.busStopsNearby.length).toBe(0);
				done();
			});
	});
});
