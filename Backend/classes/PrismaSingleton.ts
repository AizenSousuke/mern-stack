import { PrismaClient } from "@prisma/client";

export default class PrismaSingleton {
    private static prisma: PrismaClient;

    static getPrisma(): PrismaClient {
        console.log("Getting prisma variable");
        if (PrismaSingleton.prisma == null) {
            console.log("Resetting prisma variable");
            PrismaSingleton.prisma = new PrismaClient();
        }

        return PrismaSingleton.prisma;
    }

    static async disconnectPrisma() {
        if (PrismaSingleton.prisma != null) {
            await PrismaSingleton.prisma.$disconnect();
            PrismaSingleton.prisma = null;
        }
    }
}