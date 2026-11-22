import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi.js';
import authReducer from '../features/auth/authSlice.js';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
});
