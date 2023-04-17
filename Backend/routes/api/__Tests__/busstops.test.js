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

	it("should search for the correct bus stops given the correct term", (done) => {
		api.get("/api/BusStops/search")
			.query({ term: "pending" })
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.body.details).toBeTruthy();
				done();
			});
	});

	it("should give a 422 error when no term is given to a search", (done) => {
		api.get("/api/BusStops/search").end((err, res) => {
			if (err) {
				return done(err);
			}
			expect(res.status).toBe(422);
			done();
		});
	});

	it("should give an empty list when the bus stop is not found", (done) => {
		api.get("/api/BusStops/search")
			.query({ term: "not existing bus stops" })
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.status).toBe(200);
				expect(res.body.details.length).toBe(0);
				done();
			});
	});

	it("should return a bus stop with the code provided", (done) => {
		api.get("/api/BusStops/44229").end((err, res) => {
			if (err) {
				return done(err);
			}
			expect(res.status).toBe(200);
			expect(res.body.data).toBeTruthy();
			done();
		});
	});

	it("should return no bus stop with the wrong code provided", (done) => {
		api.get("/api/BusStops/12345").end((err, res) => {
			if (err) {
				return done(err);
			}
			expect(res.status).toBe(200);
			expect(res.body.data).toBeTruthy();
			done();
		});
	});

	it("should return a 422 with no code provided", (done) => {
		api.get("/api/BusStops/").end((err, res) => {
			if (err) {
				return done(err);
			}
			expect(res.status).toBe(422);
			done();
		});
	});
});
