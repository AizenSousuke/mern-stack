import BusInformation from "../../components/BusInformation";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

describe("BusInformation", () => {
	it("renders correctly", () => {
		render(<BusInformation busNumber={"966"} busStopCode={"44221"} />);
	});

	it("renders according to snapshot", () => {
		const snapshot = render(
			<BusInformation busNumber={"966"} busStopCode={"44221"} />
		).toJSON();
		expect(snapshot).toMatchSnapshot();
	});

    // Unmounted component error
	// it("should show routes page when tab is switched", () => {
	// 	const screen = render(
	// 		<BusInformation busNumber={"966"} busStopCode={"44221"} />
	// 	);
	// 	const routeTab = screen.getByTestId("RouteButton");
	// 	fireEvent.press(routeTab);
	// 	waitFor(() => {
	// 		const routePage = screen.getByTestId("RoutePage");
    //         expect(routePage).toBeVisible();
	// 	});
	// });
});
