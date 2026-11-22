import { baseApi } from '../../app/baseApi.js';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOfficeSettings: builder.query({
      query: () => '/settings/office',
      providesTags: ['Settings']
    }),
    updateOfficeSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/office',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Settings', 'Attendance']
    })
  })
});

export const {
  useGetOfficeSettingsQuery,
  useUpdateOfficeSettingsMutation
} = settingsApi;
