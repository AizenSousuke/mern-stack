import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../../util/TestUtility"
import adminRouter from "../api/admin";
import request from "supertest";
import { Express } from "express";
import Auth from "../../middleware/auth";

var routers: RouteConfig[] = [{ path: "/api/admin", router: adminRouter }]

let app: Express;
let mongoMemoryServer: MongoMemoryServer;

beforeAll(async () => {
    app = createTestAppWithRoutes(routers);
    mongoMemoryServer = await setupMongoTestDB();
})

afterAll(async () => {
    await teardownMongoTestDB(mongoMemoryServer);
})

jest.mock("../../middleware/auth", () => jest.fn((req, res, next) => {
    req.user = { id: '1', email: 'test@test.com', isAdmin: false };
    next();
}));

describe("Admin", () => {
    it("should get admin / method", async () => {
        const response = await request(app)
            .get("/api/admin");

        expect(response.status).toBe(200);
    })

    it("should not be able to set admin because user is not admin", async () => {
        const response = await request(app)
            .patch("/api/admin/setAdmin")
            .send({
                Email: "test@test.com",
                IsAdmin: true
            });

        expect(response.status).toBe(403);
        expect(response.body.msg).toBe("You must be an admin to do this");
    })
})