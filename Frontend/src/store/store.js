import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice" ;   
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";   

const persistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  // Use the persisted auth reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
