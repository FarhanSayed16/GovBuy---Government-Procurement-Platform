// services/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { store } from '../../store/store';
import { logout } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || `http://localhost:8000/api/v1`,
  credentials: 'include', // This sends cookies automatically
  prepareHeaders: (headers) => {
    // Remove manual Authorization header
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/users/refresh-access-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // retry original
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      // <-- no window.location here
    }
  }
  return result;
};


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Bid', 'Dashboard', 'Notification','SupplierDashboard','Document','User','Tender'],
  endpoints: () => ({})
});