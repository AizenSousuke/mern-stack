/**
 * Prisma seed file
 * 
 * TODO: Use axios to get data from LTA Data Mall and populate the database accordingly
 */

import PrismaSingleton from "../classes/PrismaSingleton";
import { getPromisesForAllBusStopsFromLTADataMallAPI } from "../routes/api/admin";
import { getPromisesForAllBusRoutesFromLTADataMallAPI } from "../routes/api/busroutes";

(async () => {
    // Using prisma.$transaction to do all db operations in 1 call
    console.log("Seeding data in MongoDB");
    const prisma = PrismaSingleton.getPrisma();

    let { arrayOfBusStopsPromises } = await getPromisesForAllBusStopsFromLTADataMallAPI(null);
    let { arrayOfBusRoutesPromises } = await getPromisesForAllBusRoutesFromLTADataMallAPI(null);

    // Group arrays and their names together
    const promiseGroups = [
        { name: 'Bus Stop Data', promises: arrayOfBusStopsPromises, count: 0 },
        { name: 'Bus Route Data', promises: arrayOfBusRoutesPromises, count: 0 }
    ];
    const mergedArray = [...arrayOfBusStopsPromises, ...arrayOfBusRoutesPromises];

    await prisma.$transaction(async transaction => {
        await Promise.all(mergedArray)
            .then(async response => {
                console.log("All promises has ran");

                await transaction.busStops.deleteMany({});
                await transaction.busRoutes.deleteMany({});

                // Handle logging for each group
                let offset = 0;
                promiseGroups.forEach(group => {
                    group.promises.forEach((_, index) => {
                        console.log(`${group.name} (Promise ${index + 1}) length: `, response[offset].length);
                        group.count += response[offset].length;
                        offset++;
                    });
                });
                const data = response.flat();
                console.log("Data length: ", data.length);
                console.log("allBusStopsCount Length: ", promiseGroups[0].count);
                console.log("allBusRoutesCount Length: ", promiseGroups[1].count);

                const allBusStopsCount = promiseGroups[0].count;
                const allBusRoutesCount = promiseGroups[1].count;

                // Prepare the data for `createMany`
                const busStopsData = data.slice(0, allBusStopsCount).map((busStop, index) => ({
                    busStopCode: busStop.BusStopCode,
                    location: JSON.stringify([busStop.Latitude, busStop.Longitude]),
                    description: busStop.Description,
                    roadName: busStop.RoadName
                }));

                const busRoutesData = response.flat().slice(allBusStopsCount).map((busRoutes, index) => ({
                    serviceNo: busRoutes.ServiceNo,
                    operator: busRoutes.Operator,
                    direction: busRoutes.Direction,
                    stopSequence: busRoutes.StopSequence,
                    busStopCode: busRoutes.BusStopCode,
                    distance: busRoutes.Distance,
                    wd_firstBus: busRoutes.WD_FirstBus,
                    wd_lastBus: busRoutes.WD_LastBus,
                    sat_firstBus: busRoutes.SAT_FirstBus,
                    sat_lastBus: busRoutes.SAT_LastBus,
                    sun_firstBus: busRoutes.SUN_FirstBus,
                    sun_lastBus: busRoutes.SUN_LastBus
                }));

                // Use createMany to insert the bus stops in bulk
                await transaction.busStops.createMany({
                    data: busStopsData
                });

                await transaction.busRoutes.createMany({
                    data: busRoutesData
                });

                console.log("Seeding completed");
            });
    }, {
        // In ms
        timeout: 1000 * 60 * 5
    });
})();