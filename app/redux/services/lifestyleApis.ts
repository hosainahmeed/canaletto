import baseApis from '../query/baseApis';

const lifestyleApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLifestyle: builder.query({
      query: (params?: { searchTerm?: string, type?: string }) => ({
        url: `/lifestyle/get-all`,
        method: 'GET',
        params
      })
    }),
    getLifestyleById: builder.query({
      query: (id: string) => ({
        url: `/lifestyle/get-single/${id}`,
        method: 'GET',
      })
    }),
  })
})
export const { useGetLifestyleByIdQuery, useGetLifestyleQuery } = lifestyleApis
