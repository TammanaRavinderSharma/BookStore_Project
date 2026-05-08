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

    getAllOrders: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ['orders'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: { status },
      }),
      invalidatesTags: ['orders'],
    }),

    // ── Razorpay Payment Endpoints ──────────────────────────────────────
    createRazorpayOrder: builder.mutation({
      query: (body) => ({
        url: '/create-razorpay-order',
        method: 'POST',
        body,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (body) => ({
        url: '/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} = ordersApi;

export default ordersApi;

