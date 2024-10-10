const { MongoMemoryServer } = require('mongodb-memory-server');
const { PrismaClient } = require('@prisma/client');
const { execSync, exec } = require('child_process');
const prisma = new PrismaClient();

let mongod;

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
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Manually set the desired database name (e.g., "testDatabase")
    const databaseName = "database01development";
    const modifiedUri = `${uri}${databaseName}`;

    // Log the modified URI for debugging
    console.log("MongoDB Memory Server URI:", modifiedUri);

    // Override DATABASE_URL environment variable to use in-memory MongoDB
    process.env.DATABASE_URL = modifiedUri;

    // Test the connection
    await testConnection();
    console.log("Using DATABASE_URL:", process.env.DATABASE_URL);


    // Ensure Prisma Client is generated
    console.log("Running mongo memory server");
    // execSync('rm -rf tmp && mkdir tmp && cat prisma/*.prisma > tmp/schemaCombined.prisma && npx prisma db push --schema=tmp/schemaCombined.prisma && rm tmp/schemaCombined.prisma && rm -rf tmp');


    // Create the tmp directory and run Prisma commands
    try {
        await runCommand('rm -rf tmp && mkdir tmp');
        await runCommand('cat prisma/*.prisma > tmp/schemaCombined.prisma');
        await runCommand('npx prisma db push --schema=tmp/schemaCombined.prisma');
    } catch (error) {
        console.error('Failed to execute command:', error);
    }

    console.log("Running npx prisma generate --schema=tmp/schemaCombined.prisma");
    execSync('npx prisma generate --schema=tmp/schemaCombined.prisma');
    await runCommand('rm tmp/schemaCombined.prisma && rm -rf tmp');

    return { prisma, mongod };
};
