import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../../util/TestUtility"
import adminRouter from "../api/admin";
import request from "supertest";

var routers: RouteConfig[] = [{ path: "/api/admin", router: adminRouter }]

let app;
let mongoMemoryServer: MongoMemoryServer;

jest.mock("../../middleware/auth", () => jest.fn((req, res, next) => {
    next();
}));

beforeAll(async () => {
    app = createTestAppWithRoutes(routers);
    mongoMemoryServer = await setupMongoTestDB();
})

afterAll(async () => {
    await teardownMongoTestDB(mongoMemoryServer);
})

describe("Admin", () => {
    it("should get admin /", async () => {
        const response = await request(app)
            .get("/api/admin");

        expect(response.status).toBe(200);
    })
})