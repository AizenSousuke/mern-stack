import React from "react";
import { render } from "@testing-library/react-native";
import BusStop from "../../components/BusStop";
describe("Going out", () => {
	const data = {
		BusStopCode: "83139",
		Services: [
			{
				ServiceNo: "911",
				NextBus: {
					OriginCode: "52009",
					DestinationCode: "84009",
					EstimatedArrival: "2017-06-05T14:55:12+08:00",
					Latitude: "1.3184713333333333",
					Longitude: "103.89202066666667",
					VisitNumber: "1",
					Load: "SEA",
					Feature: "WA",
				},
				NextBus2: {
					OriginCode: "52009",
					DestinationCode: "84009",
					EstimatedArrival: "2017-06-05T14:59:12+08:00",
					Latitude: "1.3184713333333333",
					Longitude: "103.89202066666667",
					VisitNumber: "1",
					Load: "SEA",
					Feature: "WA",
				},
				NextBus3: {},
			},
			{
				ServiceNo: "912",
				NextBus: {
					OriginCode: "52009",
					DestinationCode: "84009",
					EstimatedArrival: "2017-06-05T14:55:12+08:00",
					Latitude: "1.3184713333333333",
					Longitude: "103.89202066666667",
					VisitNumber: "1",
					Load: "SEA",
					Feature: "WA",
				},
				NextBus2: {
					OriginCode: "52009",
					DestinationCode: "84009",
					EstimatedArrival: "2017-06-05T14:59:12+08:00",
					Latitude: "1.3184713333333333",
					Longitude: "103.89202066666667",
					VisitNumber: "1",
					Load: "SEA",
					Feature: "WA",
				},
				NextBus3: {},
			},
		],
	};

	it("renders correctly", () => {
		render(<BusStop busStopData={data} />);
	});

	it("renders 2 bus details", () => {
		const busStop = render(<BusStop busStopData={data} />);
		expect(busStop.toJSON().children.length).toEqual(2);
	});

	it("renders 2 bus details properly as per snapshot", () => {
		const busStop = render(<BusStop busStopData={data} />).toJSON();
		expect(busStop).toMatchSnapshot();
	});

	it("renders no bus stops", async () => {
		const { container, getByText } = render(<BusStop busStopData={null} />);
		expect(getByText("No bus stop data found")).toBeTruthy();
	});
});
