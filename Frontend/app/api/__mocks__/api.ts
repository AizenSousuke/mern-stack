export const GetBusStopByCode = jest.fn().mockResolvedValue({
    busStop: {
        Description: "Sample Description",
        RoadName: "Sample Road Name",
        BusStopCode: "44221",
        Location: [
            103.771459794786,
            1.37656055754166
        ],
    }
});
export const GetBusStop = jest.fn().mockResolvedValue({
    data: {
        BusStopCode: "44221",
        Services: [
            {
                ServiceNo: "171",
                Operator: "TTS",
                NextBus: {
                    OriginCode: "59009",
                    DestinationCode: "59009",
                    EstimatedArrival: "2023-02-15T09:12:27+08:00",
                    Latitude: "1.3766951666666667",
                    Longitude: "103.77152733333334",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus2: {
                    OriginCode: "59009",
                    DestinationCode: "59009",
                    EstimatedArrival: "2023-02-15T09:21:10+08:00",
                    Latitude: "1.402927",
                    Longitude: "103.7734205",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus3: {
                    OriginCode: "59009",
                    DestinationCode: "59009",
                    EstimatedArrival: "2023-02-15T09:30:16+08:00",
                    Latitude: "1.412433",
                    Longitude: "103.78906516666666",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                }
            },
            {
                ServiceNo: "184",
                Operator: "SMRT",
                NextBus: {
                    OriginCode: "44989",
                    DestinationCode: "44989",
                    EstimatedArrival: "2023-02-15T09:20:42+08:00",
                    Latitude: "1.3856701666666666",
                    Longitude: "103.757206",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus2: {
                    OriginCode: "44989",
                    DestinationCode: "44989",
                    EstimatedArrival: "2023-02-15T09:25:37+08:00",
                    Latitude: "1.390941",
                    Longitude: "103.75635666666666",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "BD"
                },
                NextBus3: {
                    OriginCode: "44989",
                    DestinationCode: "44989",
                    EstimatedArrival: "2023-02-15T09:36:41+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                }
            },
            {
                ServiceNo: "960",
                Operator: "SMRT",
                NextBus: {
                    OriginCode: "02099",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:21:53+08:00",
                    Latitude: "1.3340475",
                    Longitude: "103.81220866666666",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus2: {
                    OriginCode: "02099",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:24:38+08:00",
                    Latitude: "1.3239830000000001",
                    Longitude: "103.82665183333333",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus3: {
                    OriginCode: "02099",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:38:26+08:00",
                    Latitude: "1.3045368333333334",
                    Longitude: "103.85095",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                }
            },
            {
                ServiceNo: "963",
                Operator: "TTS",
                NextBus: {
                    OriginCode: "46009",
                    DestinationCode: "14009",
                    EstimatedArrival: "2023-02-15T09:14:57+08:00",
                    Latitude: "1.3743405",
                    Longitude: "103.77832283333333",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus2: {
                    OriginCode: "46009",
                    DestinationCode: "14009",
                    EstimatedArrival: "2023-02-15T09:28:01+08:00",
                    Latitude: "1.4321488333333334",
                    Longitude: "103.77419216666667",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus3: {
                    OriginCode: "46009",
                    DestinationCode: "14009",
                    EstimatedArrival: "2023-02-15T09:29:58+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                }
            },
            {
                ServiceNo: "966",
                Operator: "TTS",
                NextBus: {
                    OriginCode: "46009",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:15:05+08:00",
                    Latitude: "1.3777718333333333",
                    Longitude: "103.7766495",
                    VisitNumber: "1",
                    Load: "SDA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus2: {
                    OriginCode: "46009",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:25:25+08:00",
                    Latitude: "1.4253149999999999",
                    Longitude: "103.77101633333334",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus3: {
                    OriginCode: "46009",
                    DestinationCode: "46009",
                    EstimatedArrival: "2023-02-15T09:30:01+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                }
            },
            {
                ServiceNo: "972M",
                Operator: "SMRT",
                NextBus: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:29:05+08:00",
                    Latitude: "1.3868446666666667",
                    Longitude: "103.7649695",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus2: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:38:47+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                },
                NextBus3: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:56:47+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "DD"
                }
            },
            {
                ServiceNo: "973",
                Operator: "SMRT",
                NextBus: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:14:16+08:00",
                    Latitude: "1.3789708333333333",
                    Longitude: "103.7694475",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus2: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:25:57+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus3: {
                    OriginCode: "45009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:39:57+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                }
            },
            {
                ServiceNo: "976",
                Operator: "SMRT",
                NextBus: {
                    OriginCode: "44009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:21:31+08:00",
                    Latitude: "1.3882765",
                    Longitude: "103.7642615",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus2: {
                    OriginCode: "44009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:40:18+08:00",
                    Latitude: "1.3828756666666666",
                    Longitude: "103.74281433333333",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                },
                NextBus3: {
                    OriginCode: "44009",
                    DestinationCode: "45009",
                    EstimatedArrival: "2023-02-15T09:53:41+08:00",
                    Latitude: "0",
                    Longitude: "0",
                    VisitNumber: "1",
                    Load: "SEA",
                    Feature: "WAB",
                    Type: "SD"
                }
            }
        ]
    }
});


export default {};