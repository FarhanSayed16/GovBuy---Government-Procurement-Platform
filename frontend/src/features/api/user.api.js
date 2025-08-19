// src/features/api/user.api.js
import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      // Typically you might not need cache invalidation here
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags:['User']
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),

    refreshAccessToken: builder.mutation({
        query: () => ({
          url: '/users/refresh-access-token',
          method: 'POST',
          credentials: 'include'
        }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: '/users/change-password',
        method: 'PATCH',
        body: data,
      }),
    }),

    updateAccountDetails: builder.mutation({
      query: (data) => ({
        url: '/users/update-account-details',
        method: 'PATCH',
        body: data,
      }),
    }),

    getCurrentUser: builder.query({
        query: () => '/users/me',
        providesTags: ['User'],
        // Auto re-fetch when network reconnects
        onCacheEntryAdded: async (args, { updateCachedData, cacheEntryRemoved }) => {
          try {
            await cacheEntryRemoved;
            window.addEventListener('online', () => {
              updateCachedData((draft) => {
                draft.isAuthenticated = false;
              });
            });
          } catch {}
        }
      }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/delete-user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: () => '/users/get-all-users',
      providesTags: ['User'],
    }),
    updateUserRoleAndStatus: builder.mutation({
      query: ({ userId, role, status }) => ({
        url: `/users/update-role-status/${userId}`,
        method: 'PATCH',
        body: { role, status },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshAccessTokenMutation,
  useChangePasswordMutation,
  useUpdateAccountDetailsMutation,
  useGetCurrentUserQuery,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleAndStatusMutation,
} = userApi;
