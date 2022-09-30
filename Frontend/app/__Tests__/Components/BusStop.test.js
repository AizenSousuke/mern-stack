import React from "react";
import { render } from "@testing-library/react-native";
import BusStop from "../../components/BusStop";

// Mock the module as it is rendering a native element
// See: https://github.com/react-native-maps/react-native-maps/issues/2918
jest.mock("react-native-maps", () => {
	const { View } = require("react-native");
	const MockMapView = (props) => {
		return <View>{props.children}</View>;
	};
	const MockMarker = (props) => {
		return <View>{props.children}</View>;
	};
	return {
		__esModule: true,
		default: MockMapView,
		Marker: MockMarker,
	};
});

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

	it("renders bus details properly as per the snapshot", () => {
		const busStop = render(<BusStop busStopData={data} />).toJSON();
		expect(busStop).toMatchSnapshot();
	});

	it("renders no bus stops", async () => {
		const { container, getByText } = render(<BusStop busStopData={null} />);
		expect(getByText("No bus stop data found from LTA's API")).toBeTruthy();
	});
});
