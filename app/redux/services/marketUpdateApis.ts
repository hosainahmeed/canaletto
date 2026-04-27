import baseApis from '../query/baseApis';

const marketUpdateApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMarketUpdate: builder.query({
      query: (params) => ({
        url: `/market-update/get-all`,
        method: 'GET',
        params
      })
    }),
    getMarketUpdateById: builder.query({
      query: (id: string) => ({
        url: `/market-update/get-single/${id}`,
        method: 'GET',
      })
    }),
  })
})
export const { useGetMarketUpdateQuery, useGetMarketUpdateByIdQuery } = marketUpdateApis
