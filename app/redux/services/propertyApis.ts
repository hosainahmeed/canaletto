import baseApis from '../query/baseApis';

const propertyApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMyProperty: builder.query({
      query: () => ({
        url: '/property/my-properties',
        method: 'GET',
      }),
      providesTags: ["property"]
    }),
    getSingleProperty: builder.query({
      query: (id: string) => ({
        url: `/project/get-single/${id}`,
        method: 'GET',
      }),
      providesTags: ["property"]
    })
  })
})

export const { useGetMyPropertyQuery, useGetSinglePropertyQuery } = propertyApis 