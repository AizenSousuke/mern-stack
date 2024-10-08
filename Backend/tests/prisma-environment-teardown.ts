module.exports = async ({ prisma, mongod }) => {
    await prisma.$disconnect();
    if (mongod) await mongod.stop();
};
