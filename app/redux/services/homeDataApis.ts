import baseApis from '../query/baseApis';

const homeDataApis = baseApis.injectEndpoints({
  overrideExisting: true,
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

export default homeDataApis