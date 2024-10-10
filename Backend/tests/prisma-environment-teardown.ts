
module.exports = async ({ mongod }) => {
    // const { PrismaClient } = require('@prisma/client');
    // const prisma = new PrismaClient();
    // console.log("Typeof prisma:", typeof prisma);
    await prisma.$disconnect();
    if (mongod) await mongod.stop();
};
