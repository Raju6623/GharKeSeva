import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import bookingReducer from './slices/bookingSlice';
import serviceReducer from './slices/serviceSlice';
import marketingReducer from './slices/marketingSlice';
import locationReducer from './slices/locationSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    bookings: bookingReducer,
    services: serviceReducer,
    marketing: marketingReducer,
    location: locationReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['marketing', 'location'], // Don't persist dynamic marketing data or location
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false, // Disabling this removes the middleware slowdown warnings
        }),
});

export const persistor = persistStore(store);
export default store;
