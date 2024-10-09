module.exports = async ({ prisma, mongod }) => {
    console.log(typeof(prisma));
    await prisma.$disconnect();
    if (mongod) await mongod.stop();
};
