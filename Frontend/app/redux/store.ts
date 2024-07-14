import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/rootReducer";
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const StoreSetup = () => {
    let store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
    });

    let persistedStore = persistStore(store);

    return { store, persistedStore }
}

module.exports = StoreSetup().store;
module.exports.persistedStore = StoreSetup().persistedStore;