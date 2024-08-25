import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRouter from '../../routes/api/auth';
import settingsRouter from "../../routes/api/settings";
import UserModel from '../../models/User';
import SettingsModel from '../../models/Settings';
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Settings API', () => {
    let token: string;
    let userId: mongoose.Types.ObjectId;

    beforeEach(async () => {
        // Create a sample user
        const user = new UserModel({ Email: 'test@example.com', Password: await bcrypt.hash("password", 10) });
        await user.save();
        userId = user.UserId;

        jest.mock('../../middleware/auth', () => jest.fn((req, res, next) => {
            req.user = { UserId: userId };
            next();
        }));

        // Sign in
        const response = await request(app)
            .post("/api/auth/signin")
            .send({ Email: "test@example.com", Password: "password" });

        token = response.body.token;
        console.log("Token: ", token);
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await SettingsModel.deleteMany({});
    });

    it('should get user settings', async () => {
        const settings = new SettingsModel({ UserId: userId, Settings: { GoingHome: [], GoingOut: [] } });
        await settings.save();

        const res = await request(app)
            .get('/api/settings')
            .set("x-auth-token", token)
            .expect(200);

        console.log("Res body:", res.body);

        expect(res.body.settings).toBeTruthy();
    });

    it('should update all user settings', async () => {
        const oldSettings = new SettingsModel({ UserId: userId, Settings: { GoingHome: [], GoingOut: [] } });
        oldSettings.save();

        const oldSettingsResponse = await request(app)
            .get("/api/settings")
            .set("x-auth-token", token);

        expect(oldSettingsResponse.body.settings.Settings.GoingOut).toEqual(
            []);

        const settings = { GoingHome: [], GoingOut: [{ BusStopCode: 12345, BusesTracked: [12, 34] }] };
        const updateNewSettingsResponse = await request(app)
            .put('/api/settings')
            .set("x-auth-token", token)
            .send({ settings })
            .expect(200);

        expect(updateNewSettingsResponse.body.msg).toMatch(/updated/);

        const updatedSettings = await request(app)
            .get("/api/settings")
            .set("x-auth-token", token);

        expect(updatedSettings.body.settings.Settings.GoingOut[0].BusesTracked).toEqual(
            [12, 34]);
    });

    it('should delete bus stop settings', async () => {
        const settings = new SettingsModel({
            UserId: userId, Settings: {
                GoingHome: [], GoingOut: [
                    {
                        BusStopCode: 44229,
                        BusesTracked: [],
                    }]
            }
        });
        await settings.save();

        const res = await request(app)
            .delete('/api/settings/delete')
            .set("x-auth-token", token)
            .send({ code: 44229, GoingOut: true })
            .expect(200);

        expect(res.body.msg).toMatch(/deleted/);
    });

    it('should update bus stop settings with 1 bus tracked', async () => {
        const settings = new SettingsModel({
            UserId: userId, Settings: {
                GoingHome: [], GoingOut: [
                    {
                        BusStopCode: 44229,
                        BusesTracked: [],
                    }]
            }
        });
        await settings.save();

        const res = await request(app)
            .put('/api/settings/update')
            .set("x-auth-token", token)
            .send({ code: 44229, GoingOut: true, busesTracked: [123] })
            .expect(200);

        expect(res.body.msg).toMatch(/updated/);

        const updatedResponse = await request(app)
            .get("/api/settings")
            .set("x-auth-token", token);

        expect(updatedResponse.body.settings.Settings.GoingOut[0].BusesTracked).toEqual(
            [123]);
    })

    it('should delete user settings', async () => {
        const settings = new SettingsModel({ UserId: userId, Settings: { GoingHome: [], GoingOut: [] } });
        await settings.save();

        const res = await request(app)
            .delete('/api/settings')
            .set("x-auth-token", token)
            .expect(200);

        expect(res.body.msg).toMatch(/deleted/);
    });

    it('should return 404 if no settings are found', async () => {
        const res = await request(app)
            .get('/api/settings')
            .set("x-auth-token", token)
            .expect(404);

        expect(res.body.msg).toMatch(/no settings/);
    });

    it('should return 422 if settings data is invalid', async () => {
        const res = await request(app)
            .put('/api/settings')
            .set("x-auth-token", token)
            .send({ settings: null })
            .expect(422);

        expect(res.body.errors).toBeTruthy();
    });
});
