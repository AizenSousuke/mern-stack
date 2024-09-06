/**
 * Prisma seed file
 * 
 * TODO: Use axios to get data from LTA Data Mall and populate the database accordingly
 */

import PrismaSingleton from "../classes/PrismaSingleton";
import { getPromisesForAllBusStopsFromLTADataMallAPI } from "../routes/api/admin";

(async () => {
    let { arrayOfPromises, allBusStops } = await getPromisesForAllBusStopsFromLTADataMallAPI(null);
    Promise.all(arrayOfPromises)
        .then(async response => {
            console.log("Seeding data in MongoDB");
            const prisma = PrismaSingleton.getPrisma();
            const data = allBusStops.map(busStop => {
                return prisma.busStops.upsert({
                    where: {
                        busStopCode: busStop.BusStopCode
                    },
                    update: {
                        location: JSON.stringify([busStop.Latitude, busStop.Longitude]),
                        description: busStop.Description,
                        roadName: busStop.RoadName
                    },
                    create: {
                        busStopCode: busStop.BusStopCode,
                        location: JSON.stringify([busStop.Latitude, busStop.Longitude]),
                        description: busStop.Description,
                        roadName: busStop.RoadName
                    }
                });
            });

            await prisma.$transaction(data);

            console.log("Seeding completed");
        });
})();