import mongoose from "mongoose";
import express, { Router } from 'express';
import { MongoMemoryServer } from "mongodb-memory-server";
import Auth from "../middleware/auth";

export const setupMongoTestDB = async (): Promise<MongoMemoryServer> => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
    return mongoServer;
}

export const teardownMongoTestDB = async (mongoServer: MongoMemoryServer) => {
    await mongoServer.stop();
}

export type RouteConfig = {
    path: string;
    router: Router;
}

export const createTestAppWithRoutes = (routers: RouteConfig[]) => {
    const app = express();
    app.use(express.json());
    app.use(Auth);
    routers.forEach(({ path, router }) => {
        app.use(path, router);
    });

    return app;
}