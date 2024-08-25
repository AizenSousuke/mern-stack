import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../../util/TestUtility"
import adminRouter from "../api/admin";
import request from "supertest";
import { Express } from "express";
import Auth from "../../middleware/auth";
import User from "../../models/User";

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

jest.mock('../../middleware/auth');
jest.mock("../../models/User.ts");

describe("Admin", () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks();
    })

    it("should get admin / method", async () => {
        (Auth as jest.Mock).mockImplementation((req, res, next) => {
            next();
        });

        const response = await request(app)
            .get("/api/admin");

        expect(response.status).toBe(200);
    })

    it("should not be able to set admin because user is not admin", async () => {
        // Mocking req.user to not be an admin
        (Auth as jest.Mock).mockImplementation((req, res, next) => {
            req.user = { Id: '1', Email: 'test@test.com', IsAdmin: false };
            next();
        });

        const response = await request(app)
            .patch("/api/admin/setAdmin")
            .send({
                Email: "test@test.com",
                IsAdmin: true
            });

        expect(response.status).toBe(403);
        expect(response.body.msg).toBe("You must be an admin to do this");
    })

    it("should be able to set admin because user is admin", async () => {
        // Mocking req.user to be an admin
        (Auth as jest.Mock).mockImplementation((req, res, next) => {
            req.user = { Id: '1', Email: 'test@test.com', IsAdmin: true };
            next();
        });
        User.findOneAndUpdate.mockImplementation((query) => {
            return {
                select: jest.fn().mockReturnValue({
                    _id: '1',
                    Email: "default@test.com",
                    IsAdmin: false,
                }),
            };
        });

        const response = await request(app)
            .patch("/api/admin/setAdmin")
            .send({
                Email: "test@test.com",
                IsAdmin: true
            });

        expect(response.status).toBe(200);
    })
})