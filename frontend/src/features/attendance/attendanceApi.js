import { baseApi } from '../../app/baseApi.js';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatus: builder.query({
      query: () => '/attendance/today',
      providesTags: [{ type: 'Attendance', id: 'TODAY' }]
    }),
    getMyHistory: builder.query({
      query: (params) => ({
        url: '/attendance/my-history',
        params
      }),
      providesTags: (result) =>
        result?.data?.records
          ? [
              ...result.data.records.map(({ _id }) => ({ type: 'Attendance', id: _id })),
              { type: 'Attendance', id: 'LIST' }
            ]
          : [{ type: 'Attendance', id: 'LIST' }]
    }),
    punchIn: builder.mutation({
      query: (formData) => ({
        url: '/attendance/punch-in',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: [
        { type: 'Attendance', id: 'TODAY' },
        { type: 'Attendance', id: 'LIST' },
        { type: 'Attendance', id: 'KPIS' }
      ]
    }),
    punchOut: builder.mutation({
      query: (formData) => ({
        url: '/attendance/punch-out',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: [
        { type: 'Attendance', id: 'TODAY' },
        { type: 'Attendance', id: 'LIST' },
        { type: 'Attendance', id: 'KPIS' }
      ]
    }),
    getValidationQueue: builder.query({
      query: (params) => ({
        url: '/attendance/validation-queue',
        params
      }),
      providesTags: (result) =>
        result?.data?.records
          ? [
              ...result.data.records.map(({ _id }) => ({ type: 'Attendance', id: _id })),
              { type: 'Attendance', id: 'VALIDATION_LIST' }
            ]
          : [{ type: 'Attendance', id: 'VALIDATION_LIST' }]
    }),
    validateAttendance: builder.mutation({
      query: ({ id, validationStatus, remarks }) => ({
        url: `/attendance/${id}/validate`,
        method: 'PATCH',
        body: { validationStatus, remarks }
      }),
      invalidatesTags: [
        { type: 'Attendance', id: 'VALIDATION_LIST' },
        { type: 'Attendance', id: 'LIST' },
        { type: 'Attendance', id: 'KPIS' },
        'Report'
      ]
    }),
    getKPIs: builder.query({
      query: () => '/attendance/kpis',
      providesTags: [{ type: 'Attendance', id: 'KPIS' }]
    })
  })
});

export const {
  useGetTodayStatusQuery,
  useGetMyHistoryQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useGetValidationQueueQuery,
  useValidateAttendanceMutation,
  useGetKPIsQuery
} = attendanceApi;
