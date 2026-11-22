import { baseApi } from '../../app/baseApi.js';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params
      }),
      providesTags: [{ type: 'User', id: 'LIST' }]
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'User', id: 'MANAGERS' }]
    }),
    approveUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/approve`,
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'User', id: 'MANAGERS' }]
    }),
    rejectUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/reject`,
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'User', id: 'MANAGERS' }]
    }),
    getManagers: builder.query({
      query: () => '/users/managers',
      providesTags: [{ type: 'User', id: 'MANAGERS' }]
    }),
    getTeamMembers: builder.query({
      query: () => '/users/team',
      providesTags: [{ type: 'User', id: 'TEAM' }]
    }),
    updateRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'User', id: 'MANAGERS' }]
    }),
    assignManager: builder.mutation({
      query: ({ id, managerId }) => ({
        url: `/users/${id}/assign-manager`,
        method: 'PATCH',
        body: { managerId }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    })
  })
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useApproveUserMutation,
  useRejectUserMutation,
  useGetManagersQuery,
  useGetTeamMembersQuery,
  useUpdateRoleMutation,
  useAssignManagerMutation
} = usersApi;
