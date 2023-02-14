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
});
