/**
 * Prisma seed file
 * 
 * TODO: Use axios to get data from LTA Data Mall and populate the database accordingly
 */

import PrismaSingleton from "../classes/PrismaSingleton";
import { getPromisesForAllBusStopsFromLTADataMallAPI } from "../routes/api/admin";

(async () => {
    // Using prisma.$transaction to do all db operations in 1 call
    console.log("Seeding data in MongoDB");
    const prisma = PrismaSingleton.getPrisma();

    await prisma.$transaction(async transaction => {
        let { arrayOfPromises, allBusStops } = await getPromisesForAllBusStopsFromLTADataMallAPI(null);
        Promise.all(arrayOfPromises)
            .then(async response => {
                await transaction.busStops.deleteMany({});

                // Prepare the data for `createMany`
                const busStopsData = allBusStops.map(busStop => ({
                    busStopCode: busStop.BusStopCode,
                    location: JSON.stringify([busStop.Latitude, busStop.Longitude]),
                    description: busStop.Description,
                    roadName: busStop.RoadName
                }));

                // Use createMany to insert the bus stops in bulk
                await transaction.busStops.createMany({
                    data: busStopsData
                });

                console.log("Seeding completed");
            });
    });
})();