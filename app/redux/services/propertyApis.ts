import baseApis from '../query/baseApis';

const propertyApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMyProperty: builder.query({
      query: () => ({
        url: '/property/my-properties',
        method: 'GET',
      }),
      providesTags: ["property"]
    })
  })
})

export const { useGetMyPropertyQuery } = propertyApis 