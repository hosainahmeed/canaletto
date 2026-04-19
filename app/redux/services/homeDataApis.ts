import baseApis from '../query/baseApis';

const homeDataApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: () => ({
        url: '/property/home-data',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetHomeDataQuery } = homeDataApis