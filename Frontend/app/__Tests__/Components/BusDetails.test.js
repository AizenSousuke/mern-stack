import BusDetails from "../../components/BusDetails";
import { render } from "@testing-library/react-native";

describe("Bus Details", () => {
	const details = {
		ServiceNo: 911,
	};
	it("renders correctly", () => {
		render(
			<BusDetails
				busNumber={"911"}
				busStopData={null}
				busStopLocation={null}
				details={details}
			/>
		);
	});

	it("renders BusDetails according to snapshot", () => {
		const snapshot = render(
			<BusDetails
				busNumber={"911"}
				busStopData={null}
				busStopLocation={null}
				details={details}
			/>
		).toJSON();

		expect(snapshot).toMatchSnapshot();
	});

	it("renders 3 no data items when there is no nextBus data", () => {
		const element = render(<BusDetails />);
		const data = element.getAllByText("No Data");
		expect(data.length).toBe(3);
	});
});
