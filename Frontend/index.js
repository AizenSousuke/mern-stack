import { registerRootComponent } from 'expo';
import { Provider } from "react-redux";
import { store } from "./app/redux/store";

import App from './App';

const rootApp = () => {
    return <Provider store={store}>
        <App />
    </Provider>
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(rootApp);
