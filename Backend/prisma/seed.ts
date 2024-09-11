/**
 * Prisma seed file
 * 
 * TODO: Use axios to get data from LTA Data Mall and populate the database accordingly
 */

import PrismaSingleton from "../classes/PrismaSingleton";
import { getPromisesForAllBusStopsFromLTADataMallAPI } from "../routes/api/admin";
import { getPromisesForAllBusRoutesFromLTADataMallAPI } from "../routes/api/busroutes";

function delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processInBatches(promises, batchSize) {
    console.log("Processing in batches: promises length:", promises.length, "batch size:", batchSize);
    const results = [];

    for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);

        console.log("batch length:", batch.length);
        console.log("Delay started");
        await delay(500);
        console.log("Delay ended");

        const batchPromises = batch.map(fn => fn());

        try {
            const batchResults = await Promise.all(batchPromises);
            console.log("Got results:", batchResults.length);
            results.push(...batchResults);
        } catch (error) {
            console.error("Error in batch processing:", error.message);
            // Handle or rethrow the error depending on your logic
            throw error;  // Re-throwing ensures the transaction fails
        }
    }

    return results;
}

(async () => {
    // Using prisma.$transaction to do all db operations in 1 call
    console.log("Seeding data in MongoDB");
    const prisma = PrismaSingleton.getPrisma();

    console.log("Starting transaction");

    await prisma.$transaction(async transaction => {
        let { arrayOfBusStopsPromises } = await getPromisesForAllBusStopsFromLTADataMallAPI(null);
        // let { arrayOfBusRoutesPromises } = await getPromisesForAllBusRoutesFromLTADataMallAPI(null);

        // Group arrays and their names together
        const promiseGroups = [
            { name: 'Bus Stop Data', promises: arrayOfBusStopsPromises, count: 0 },
            // { name: 'Bus Route Data', promises: arrayOfBusRoutesPromises, count: 0 }
        ];
        const mergedArray = [...arrayOfBusStopsPromises];

        console.log("Transaction started");
        const response = await processInBatches(mergedArray, 1);

        console.log("All promises has ran");

        await transaction.busStops.deleteMany({});
        // await transaction.busRoutes.deleteMany({});

        // Handle logging for each group
        let offset = 0;
        promiseGroups.forEach(group => {
            group.promises.forEach((_, index) => {
                console.log(`${group.name} (Promise ${index + 1}) length: `, response[offset].length);
                group.count += response[offset].length;
                offset++;
            });
        });

        const data = response.flat(Infinity);
        // Should return 1 bus stop
        // console.log("Data:", data[0]);
        console.log("Data length: ", data.length);
        console.log("allBusStopsCount Length: ", promiseGroups[0].count);
        // console.log("allBusRoutesCount Length: ", promiseGroups[1].count);

        const allBusStopsCount = promiseGroups[0].count;
        // const allBusRoutesCount = promiseGroups[1].count;

        // Prepare the data for `createMany`
        const busStopsData = data.slice(0, allBusStopsCount).map((busStop, index) => ({
            busStopCode: busStop.BusStopCode,
            location: JSON.stringify([busStop.Latitude, busStop.Longitude]),
            description: busStop.Description,
            roadName: busStop.RoadName
        }));

        // const busRoutesData = response.flat().slice(allBusStopsCount).map((busRoutes, index) => ({
        //     serviceNo: busRoutes.ServiceNo,
        //     operator: busRoutes.Operator,
        //     direction: busRoutes.Direction,
        //     stopSequence: busRoutes.StopSequence,
        //     busStopCode: busRoutes.BusStopCode,
        //     distance: busRoutes.Distance,
        //     wd_firstBus: busRoutes.WD_FirstBus,
        //     wd_lastBus: busRoutes.WD_LastBus,
        //     sat_firstBus: busRoutes.SAT_FirstBus,
        //     sat_lastBus: busRoutes.SAT_LastBus,
        //     sun_firstBus: busRoutes.SUN_FirstBus,
        //     sun_lastBus: busRoutes.SUN_LastBus
        // }));

        // Use createMany to insert the bus stops in bulk
        await transaction.busStops.createMany({
            data: busStopsData
        });

        // await transaction.busRoutes.createMany({
        //     data: busRoutesData
        // });

        console.log("Seeding completed");
    }, {
        // In ms
        timeout: 1000 * 60 * 5
    });
})();