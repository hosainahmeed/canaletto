import baseApis from '../query/baseApis';

const userApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: '/user/get-my-profile',
        method: 'GET',
      }),
    })
  })
})

export const { useGetMyProfileQuery } = userApis