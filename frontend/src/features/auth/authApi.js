import { baseApi } from '../../app/baseApi.js';
import { setCredentials } from './authSlice.js';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setCredentials(data.data));
          }
        } catch {
          // Handled by component toast
        }
      },
      invalidatesTags: ['Attendance', 'Overtime', 'User']
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setCredentials(data.data));
          }
        } catch {
          // Handled by component toast
        }
      },
      invalidatesTags: ['User']
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth']
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
