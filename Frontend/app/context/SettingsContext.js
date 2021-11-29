import { useContext } from "react";

const { Provider, Consumer } = useContext(null);

const SettingsContext = (props) => {
	return (
		<Provider value={{ settings: props.value }}>{props.children}</Provider>
	);
};

export { SettingsContext };

export default Consumer;