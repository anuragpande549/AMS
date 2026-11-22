import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice.js';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem('ams_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // IMPORTANT: DO NOT set default Content-Type header here.
    // Fetch automatically sets application/json for standard objects
    // and preserves multipart/form-data boundary for FormData selfie uploads.
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Session expired or invalid token
    api.dispatch(logout());
    api.dispatch(baseApi.util.resetApiState());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Attendance', 'Overtime', 'User', 'Auth', 'Report', 'Settings'],
  endpoints: () => ({})
});
