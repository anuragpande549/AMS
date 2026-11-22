import { baseApi } from '../../app/baseApi.js';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyReport: builder.query({
      query: (params) => ({
        url: '/reports/daily',
        params
      }),
      providesTags: ['Report']
    }),
    getExportData: builder.query({
      query: (params) => ({
        url: '/reports/export',
        params
      }),
      providesTags: ['Report']
    })
  })
});

export const { useGetDailyReportQuery, useLazyGetExportDataQuery } = reportsApi;
