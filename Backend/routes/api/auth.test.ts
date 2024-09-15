import request from "supertest";
import express from "express"; 
import authRouter from "./auth";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Initialize express app
const app = express();
app.use(express.json()); // For parsing application/json
app.use("/api/auth", authRouter); // Mount the auth router

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Auth API", () => {
    let testUser;

    beforeEach(async () => {
        // Seed a user for testing
        testUser = new UserModel({
            Email: "testuser@example.com",
            Password: await bcrypt.hash("password123", 10),
            UserId: new mongoose.Types.ObjectId(),
            IsAdmin: false,
        });
        await testUser.save();
    });

    afterEach(async () => {
        await UserModel.deleteMany();
    });

    it("POST /signin - should return 400 if invalid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/signin")
            .send({ Email: "testuser@example.com", Password: "wrongpassword" });

        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual("Invalid Password");
    });

    it("POST /signin - should return a token on successful login", async () => {
        const res = await request(app)
            .post("/api/auth/signin")
            .send({ Email: "testuser@example.com", Password: "password123" });

        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
    });

    it("GET / - should return the user if authenticated", async () => {
        const response = await request(app)
            .post("/api/auth/signin")
            .send({ Email: "testuser@example.com", Password: "password123" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.token).toBeDefined();

        const token = response.body.token;

        const res = await request(app)
            .get("/api/auth/")
            .set("x-auth-token", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.msg.Email).toEqual(testUser.Email);
    });

    it("GET /checkTokenExpiry - should return expired status", async () => {
        const response = await request(app)
            .post("/api/auth/signin")
            .send({ Email: "testuser@example.com", Password: "password123" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.token).toBeDefined();

        const token = response.body.token;

        await UserModel.updateOne(
            { Email: testUser.Email },
            { Token: token, TokenExpiryDate: new Date(Date.now() - 3600000) }
        );

        const res = await request(app)
            .get("/api/auth/checkTokenExpiry")
            .set("x-auth-token", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.expired).toBe(true);
    });
});
