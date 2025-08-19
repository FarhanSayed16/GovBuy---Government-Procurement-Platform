// features/api/document.api.js
import { apiSlice } from './apiSlice';

export const documentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentById: builder.query({
      query: (id) => `/documents/${id}`,
    }),
  }),
});

export const { useGetDocumentByIdQuery } = documentApi;
