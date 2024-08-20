import { MongoMemoryServer } from "mongodb-memory-server";
import authRouter from "../routes/api/auth";
import request from "supertest";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../util/TestUtility";
import Auth from "./auth";

const routers: RouteConfig[] = [{ path: "api/auth", router: authRouter }];

let app;
let mongoMemoryServer: MongoMemoryServer;

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
        // const response = await Auth({
        //     header: {
        //         "X-Auth-Token": null
        //     }
        // }, null, null);

        var response = await request(app)
            .get("/api/test");

        expect(response.status).toBe(401);
    })

    it("should return 200 then token is provided", async () => {
        
        
        var response = await request(app)
        .get("/api/test")
        .set("x-auth-token", "Bearer Token");

        expect(response.status).toBe(200);
    })
})