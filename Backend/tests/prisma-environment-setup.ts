const { MongoMemoryServer, MongoMemoryReplSet } = require('mongodb-memory-server');
const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

let mongod;
let userId: string;

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('Connected to in-memory MongoDB.');
    } catch (error) {
        console.error('Error connecting to in-memory MongoDB:', error);
    }
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`);
                console.error(stderr);
                return reject(error);
            }
            console.log(`Command executed: ${command}`);
            console.log(stdout);
            resolve(null);
        });
    });
}

// Start in-memory MongoDB server
module.exports = async () => {
    const databaseName = "yasgbadevelopment";
    mongod = await MongoMemoryReplSet.create({
        replSet: { count: 2 },
    });
    await mongod.waitUntilRunning();
    const uri = await mongod.getUri();
    console.log("MongoDB Memory Server Default URI:", uri);

    // Manually set the desired database name (e.g., "testDatabase")
    const modifiedUri = `${uri.split('?')[0]}${databaseName}?${uri.split('?')[1]}`;

    // Log the modified URI for debugging
    console.log("MongoDB Memory Server Modified URI:", modifiedUri);

    // Override DATABASE_URL environment variable to use in-memory MongoDB
    process.env.DATABASE_URL = modifiedUri;

    // Test the connection
    await testConnection();
    console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

    // Ensure Prisma Client is generated
    console.log("Running mongo memory server");

    // Create the tmp directory and run Prisma commands
    try {
        await runCommand('rm -rf tmp && mkdir tmp');
        await runCommand('cat prisma/*.prisma > tmp/schemaCombined.prisma');
        await runCommand('npx prisma db push --schema=tmp/schemaCombined.prisma');
    } catch (error) {
        console.error('Failed to execute command:', error);
    }

    console.log("Running npx prisma generate --schema=tmp/schemaCombined.prisma");
    exec('npx prisma generate --schema=tmp/schemaCombined.prisma');
    await runCommand('rm tmp/schemaCombined.prisma && rm -rf tmp');

    await prisma.$runCommandRaw({ dropDatabase: 1 });

    // Seed the test database
    console.log("Creating user");

    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            password: await bcrypt.hash("hashedpassword123", 10)
        }
    });
    userId = user.id;

    console.log("Users:", await prisma.user.findMany({}));

    console.log(`User ID: ${userId}`);

    return { prisma, mongod };
};

// Export prisma for use in tests
module.exports.prisma = prisma;