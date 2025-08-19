import { apiSlice } from './apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard']
    }),
    getSupplierDashboard: builder.query({
      query: () => '/dashboard/supplier',
      providesTags: ['SupplierDashboard']
    }),
  })
});

export const {
  useGetAdminStatsQuery,
  useGetSupplierDashboardQuery
} = dashboardApi;
