import baseApis from '../query/baseApis';

const constructionApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getConsructionStatus: builder.query({
      query: (id: string) => ({
        url: `/construction-stage/${id}`,
        method: 'GET',
      }),
      providesTags: ["construction"]
    }),
  })
})

export const { useGetConsructionStatusQuery } = constructionApis