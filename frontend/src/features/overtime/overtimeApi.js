import { baseApi } from '../../app/baseApi.js';

export const overtimeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOvertimeRequests: builder.query({
      query: (params) => ({
        url: '/overtime',
        params
      }),
      providesTags: (result) =>
        result?.data?.requests
          ? [
              ...result.data.requests.map(({ _id }) => ({ type: 'Overtime', id: _id })),
              { type: 'Overtime', id: 'LIST' }
            ]
          : [{ type: 'Overtime', id: 'LIST' }]
    }),
    requestOvertime: builder.mutation({
      query: (data) => ({
        url: '/overtime/request',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [
        { type: 'Overtime', id: 'LIST' },
        { type: 'Attendance', id: 'LIST' },
        { type: 'Attendance', id: 'TODAY' }
      ]
    }),
    reviewOvertime: builder.mutation({
      query: ({ id, status, reviewRemarks }) => ({
        url: `/overtime/${id}/review`,
        method: 'PATCH',
        body: { status, reviewRemarks }
      }),
      invalidatesTags: [
        { type: 'Overtime', id: 'LIST' },
        { type: 'Attendance', id: 'LIST' },
        { type: 'Attendance', id: 'KPIS' },
        'Report'
      ]
    })
  })
});

export const {
  useGetOvertimeRequestsQuery,
  useRequestOvertimeMutation,
  useReviewOvertimeMutation
} = overtimeApi;
