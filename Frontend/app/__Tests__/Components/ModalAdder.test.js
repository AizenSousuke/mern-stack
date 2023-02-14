import ModalAdder from "../../components/common/ModalAdder";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import "@testing-library/jest-dom";
import { Text } from "react-native-elements";

jest.useFakeTimers();

describe("ModalAdder", () => {
	it("renders correctly", () => {
		render(<ModalAdder />);
	});

	it("renders according to snapshot", () => {
		const snapshot = render(<ModalAdder />).toJSON();
		expect(snapshot).toMatchSnapshot();
	});

	it("renders with no modalElement and children by default", () => {
		const screen = render(<ModalAdder children={<Text>Children</Text>} modalElement={<Text>Modal Element</Text>} />);
		const children = screen.getByText("Children");
		const modalElement = screen.queryByText("Modal Element");
		waitFor(() => expect(children).toBeVisible());
		waitFor(() => expect(modalElement).toBeNull());
	});

	it("renders with modalElement and children on press", () => {
		const screen = render(<ModalAdder children={<Text>Children</Text>} modalElement={<Text>Modal Element</Text>} />);
		fireEvent.press(screen.getByTestId("Pressable"));
		const children = screen.getByText("Children");
		const modalElement = screen.getByText("Modal Element");
		waitFor(() => expect(children).toBeVisible());
		waitFor(() => expect(modalElement).toBeVisible());
	});
});
