import { registerRootComponent } from "expo";
import { Provider } from "react-redux";
import store, { persistedStore } from "./app/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";

const rootApp = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistedStore}>
				<App />
			</PersistGate>
		</Provider>
	);
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(rootApp);
