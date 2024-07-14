import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/rootReducer";
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunkMiddleware from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    let store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(thunkMiddleware.thunk)
    });

    let persistedStore = persistStore(store);

    return { store, persistedStore }
}