// src/features/api/supplier.api.js
import { apiSlice } from './apiSlice';

export const supplierApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Supplier Dashboard data
    getSupplierDashboard: builder.query({
      query: () => '/supplier/dashboard',
      providesTags: ['SupplierDashboard'],
    }),

    getSupplierById: builder.query({
      query: (supplierId) => `/supplier/${supplierId}`,
      providesTags: (result, error, supplierId) => [
        { type: "Supplier", id: supplierId }
      ]
    }),

    // Fetch all documents for supplier
    getDocuments: builder.query({
      query: () => '/supplier/documents',
      providesTags: (result = []) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Document', id: _id })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    // Upload a new document (FormData expected)
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: '/supplier/documents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),

    // Delete a document by ID
    deleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `/supplier/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Document', id }, { type: 'Document', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSupplierDashboardQuery,
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useGetSupplierByIdQuery
} = supplierApi;
