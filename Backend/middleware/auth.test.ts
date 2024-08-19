import { MongoMemoryServer } from "mongodb-memory-server";
import authRouter from "../routes/api/auth";
import { createTestAppWithRoutes, RouteConfig, setupMongoTestDB, teardownMongoTestDB } from "../util/TestUtility";
import Auth from "./auth";

const routers: RouteConfig[] = [{ path: "api/auth", router: authRouter }];

let app;
let mongoMemoryServer: MongoMemoryServer;

beforeAll(async () => {
    app = createTestAppWithRoutes(routers);
    mongoMemoryServer = await setupMongoTestDB();
})

afterAll(async () => {
    await teardownMongoTestDB(mongoMemoryServer);
})

describe("Auth Middleware", () => {
    it("should return 401 when no token is provided", async () => {
        const response = await Auth({
            header: {
                "X-Auth-Token": null
            }
        }, null, null);

        console.log(response);

        expect(response.msg).toBe(401);
    })
})