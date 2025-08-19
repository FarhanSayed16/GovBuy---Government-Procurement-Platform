// src/features/api/tender.api.js
import { apiSlice } from "./apiSlice";

export const tenderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTender: builder.mutation({
      query: (formData) => ({
        url: '/tenders',
        method: 'POST',
        body: formData,            // expect FormData instance with fields + attachments
      }),
      invalidatesTags: ['Tender'],
    }),

    getTenders: builder.query({
      query: () => '/tenders',
      providesTags: (result) =>
        result?.data?.docs
          ? [
              ...result.data.docs.map(({ _id }) => ({ type: 'Tender', id: _id })),
              { type: 'Tender', id: 'LIST' },
            ]
          : [{ type: 'Tender', id: 'LIST' }],
    }),
    

    getTenderById: builder.query({
      query: (id) => `/tenders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tender', id }],
    }),

    updateTender: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tenders/${id}`,
        method: 'PUT',
        body: formData,            // FormData with updated fields + optional attachments
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tender', id }],
    }),

    getMyTenders: builder.query({
        query: () => '/tenders/mine',
        providesTags: (result = [], error) =>
          result
            ? [
                // tag each returned tender by its id
                ...result.data.map(({ _id }) => ({ type: 'Tender', id: _id })),
                // and the list itself
                { type: 'Tender', id: 'MINE_LIST' },
              ]
            : [{ type: 'Tender', id: 'MINE_LIST' }],
      }),

    deleteTender: builder.mutation({
      query: (id) => ({
        url: `/tenders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tender'],
    }),
  }),
});

export const {
  useCreateTenderMutation,
  useGetMyTendersQuery,
  useGetTendersQuery,
  useGetTenderByIdQuery,
  useUpdateTenderMutation,
  useDeleteTenderMutation,
} = tenderApi;
