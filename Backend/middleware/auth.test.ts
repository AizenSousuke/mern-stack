import { MongoMemoryServer } from "mongodb-memory-server";
import authRouter from "../routes/api/auth";
import userRouter from "../routes/api/users";
import request from "supertest";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../util/TestUtility";
import Auth from "./auth";
import User from "../models/User";

const routers: RouteConfig[] = [{ path: "/api/auth", router: authRouter }, { path: "/api/user", router: userRouter }];

let app;
let mongoMemoryServer: MongoMemoryServer;

jest.mock('../models/User');

beforeAll(async () => {
    app = createTestAppWithRoutes(routers);
    app.use(Auth);
    mongoMemoryServer = await setupMongoTestDB();
})

afterAll(async () => {
    await teardownMongoTestDB(mongoMemoryServer);
})

describe("Auth Middleware", () => {
    it("should return 401 when no token is provided", async () => {
        var response = await request(app)
            .get("/api/test");

        expect(response.status).toBe(401);
    })

    it('should return 200 when a valid token is provided', async () => {
        // Mock User.findOne to return a user object
        User.findOne.mockImplementation((query) => {
            console.log('Mocked User.findOne called with query:', query);
            return {
                select: jest.fn().mockReturnValue({
                    _id: '123',
                    Token: 'valid-token',
                    TokenExpiryDate: Date.now() + 3600000,  // Token expiry in the future
                }),
            };
        });

        const response = await request(app)
            .get('/api/user/test')
            .set('X-Auth-Token', 'valid-token');  // Set the token in the header

        expect(response.status).toBe(200);
        expect(response.body.msg).not.toBeNull();
    });
})