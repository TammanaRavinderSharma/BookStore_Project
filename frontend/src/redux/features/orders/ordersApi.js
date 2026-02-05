import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseUrl';

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
  }),
  tagTypes: ['orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: '/',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: ['orders'],
    }),

    getOrderByEmail: builder.query({
      query: (email) => `/email/${email}`,
      providesTags: ['orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
} = ordersApi;

export default ordersApi;
