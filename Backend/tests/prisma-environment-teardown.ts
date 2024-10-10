// import { PrismaClient } from "@prisma/client";

module.exports = async ({ prisma, mongod }) => {
    // const { PrismaClient } = require('@prisma/client');
    // const prisma: PrismaClient = new PrismaClient();
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    console.log("Typeof prisma:", typeof prisma);
    await prisma.$disconnect();
    if (mongod) await mongod.stop();
};
