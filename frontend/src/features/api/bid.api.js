import { apiSlice } from './apiSlice';

export const bidApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitBid: builder.mutation({
      query: (formData) => ({
        url: '/bids',
        method: 'POST',
        body: formData  // FormData with tenderId, amount, proposal, proposalDoc
      }),
      invalidatesTags: ['Bid'],
    }),

    getBidDetails: builder.query({
      query: (bidId) => `/bids/${bidId}`,
      providesTags: (result, error, bidId) => [{ type: 'Bid', id: bidId }],
    }),

    getMyBids: builder.query({
      query: () => '/bids/my',
      providesTags: (result = []) =>
        result
          ? [
              ...result.data.docs?.map(({ _id }) => ({ type: 'Bid', id: _id })),
              { type: 'Bid', id: 'MY_LIST' }
            ]
          : [{ type: 'Bid', id: 'MY_LIST' }],
    }),
    deleteBid: builder.mutation({
      query: (bidId) => ({
        url: `/bids/${bidId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Bid']
    }),
    getTenderBids: builder.query({
      query: (tenderId) => `/bids/tender/${tenderId}`,
      providesTags: (result, error, tenderId) => {
        // only tag when we actually have docs
        const docs = result?.data?.docs;
        if (docs) {
          return [
            ...docs.map(({ _id }) => ({ type: 'Bid', id: _id })),
            { type: 'Bid', id: tenderId }  // tag the list as well
          ];
        }
        // fallback tag for list
        return [{ type: 'Bid', id: tenderId }];
      },
    }),

    updateBidStatus: builder.mutation({
      query: ({ bidId, status }) => ({
        url: `/bids/${bidId}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (result, error, { bidId }) => [{ type: 'Bid', id: bidId }],
    }),
  })
});

export const {
  useSubmitBidMutation,
  useGetMyBidsQuery,
  useDeleteBidMutation,
  useGetTenderBidsQuery,
  useUpdateBidStatusMutation,
  useGetBidDetailsQuery
} = bidApi;
