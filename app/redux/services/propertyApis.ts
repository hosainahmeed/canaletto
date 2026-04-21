import baseApis from '../query/baseApis';

const propertyApis = baseApis.injectEndpoints({
  overrideExisting: true,
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
        url: `/property/get-single/${id}`,
        method: 'GET',
      }),
      providesTags: ["property"]
    })
  })
})

export const { useGetMyPropertyQuery, useGetSinglePropertyQuery } = propertyApis

export default propertyApis 