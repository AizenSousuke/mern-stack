import { PrismaClient } from "@prisma/client";

export default class PrismaSingleton {
    private static prisma: PrismaClient;

    static getPrisma() {
        if (PrismaSingleton.prisma == null) {
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