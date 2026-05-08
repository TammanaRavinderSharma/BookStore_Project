import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token =  localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Books'],
    endpoints: (builder) =>({
        fetchAllBooks: builder.query({
            query: (category) => {
                let url = "/";
                if(category) url += `?category=${category}`;
                return url;
            },
            providesTags: ["Books"]
        }),
        fetchExploreBooks: builder.query({
            query: ({ category, search, page = 1, limit = 20 } = {}) => {
                let url = `/explore?page=${page}&limit=${limit}`;
                if (search) url += `&search=${encodeURIComponent(search)}`;
                else if (category) url += `&category=${category}`;
                return url;
            },
            providesTags: ["Books"]
        }),
        fetchBooksByMood: builder.query({
            query: ({ moodType, limit = 12, page = 1 }) =>
                `/mood/${moodType}?limit=${limit}&page=${page}`,
            providesTags: ["Books"]
        }),
        fetchRecommendations: builder.query({
            query: (email) =>
                email
                    ? `/recommendations?email=${encodeURIComponent(email)}`
                    : `/recommendations`,
            providesTags: ["Books"]
        }),
        fetchExploreBookById: builder.query({
            query: (id) => `/explore/${id}`,
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }),
        summarizeBook: builder.mutation({
            query: (bookData) => ({
                url: `${getBaseUrl()}/api/ai/summarize`,
                method: "POST",
                body: bookData
            })
        }),
        fetchBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/create-book`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Books"]
        })
    })
})

export const {useFetchAllBooksQuery, useFetchExploreBooksQuery, useFetchExploreBookByIdQuery, useFetchBooksByMoodQuery, useFetchRecommendationsQuery, useSummarizeBookMutation, useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation} = booksApi;
export default booksApi;