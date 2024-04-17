import React from "react";
import { render } from "@testing-library/react-native";
import BusStop from "../../components/BusStop";

// Mock the module as it is rendering a native element
// See: https://github.com/react-native-maps/react-native-maps/issues/2918
jest.mock("react-native-maps", () => {
	const { View } = require("react-native");
	const importedReact = require("react");
	// const MockMapView = (props) => {
	// 	return <View>{props.children}</View>;
	// };

	var mockReact = importedReact;

	const MockMapView = mockReact.forwardRef(
		({ testID, children, ...props }, ref) => {
			if (ref?.current) {
				ref.current = {
					getMapBoundaries: async () => ({
						northEast: {
							latitude: 2,
							longitude: 2,
						},
						southWest: {
							latitude: 1,
							longitude: 1,
						},
					}),
					getCamera: async () => ({
						center: {
							latitude: 2,
							longitude: 2,
						},
						heading: 1,
						pitch: 1,
						zoom: 1,
						altitude: 1,
					}),
					animateCamera: () => {},
				};
			}

			return (
				<View testID={testID} {...props}>
					{children}
				</View>
			);
		}
	);

	// const MockMarker = (props) => {
	// 	return <View>{props.children}</View>;
	// };

	const MockMarker = mockReact.forwardRef(
		({ testID, children, ...props }, ref) => {
			if (ref?.current) {
				ref.current = {
					redraw: () => {},
				};
			}

			return (
				<View testID={testID} {...props}>
					{children}
				</View>
			);
		}
	);

	return {
		__esModule: true,
		default: MockMapView,
		Marker: MockMarker,
	};
});

describe("BusStop", () => {
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
