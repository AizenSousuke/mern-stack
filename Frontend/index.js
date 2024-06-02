import { registerRootComponent } from "expo";
import { Provider } from "react-redux";
import createStore from "./app/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";

const rootApp = () => {
	return (
		<Provider store={createStore().store}>
			<PersistGate
				loading={null}
				persistor={createStore().persistedStore}
			>
				<App />
			</PersistGate>
		</Provider>
	);
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(rootApp);
