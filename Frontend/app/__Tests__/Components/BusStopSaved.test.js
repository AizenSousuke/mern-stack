import { act, create } from "react-test-renderer";
import BusStopSaved from "../../components/BusStopSaved";

jest.mock("../../api/api");

describe("BusStopSaved", () => {
	it("renders properly", async () => {
		await act(async () => {
			await create(<BusStopSaved />);
		});
	});

	it("renders properly according to snapshot", async () => {
		await act(async () => {
			const snapshot = (await create(<BusStopSaved />)).toJSON();
			expect(snapshot).toMatchSnapshot();
		});
	});

	it("renders with the correct data", async () => {
		await act(async () => {
			const snapshot = (
				await create(<BusStopSaved GoingOut={true} code={44221} />)
			).toJSON();

			expect(snapshot).toMatchSnapshot();
		});
	});
});
