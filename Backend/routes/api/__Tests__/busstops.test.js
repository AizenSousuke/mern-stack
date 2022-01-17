const request = require("supertest");
const app = require("../../../server");

// Note: Remember to use {} in test.json in config folder

describe("/BusStops Test", () => {
	it("should return a Bus Stop data with provided with a code query string", (done) => {
		request(app)
			.get("/api/BusStops")
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
		request(app)
			.get("/api/BusStops")
			.expect(422)
			.end((err, res) => {
                if (err) {
                    return done(err);
                }
				return done();
			});
	});
});