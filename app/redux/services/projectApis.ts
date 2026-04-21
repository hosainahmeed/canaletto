import baseApis from '../query/baseApis';

const projectApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAlProject: builder.query({
      query: () => ({
        url: '/project/get-all',
        method: 'GET',
      }),
      providesTags: ["project"]
    }),
    getSingleProject: builder.query({
      query: (id: string) => ({
        url: `/project/get-single/${id}`,
        method: 'GET',
      }),
      providesTags: ["project"]
    }),
  })
})

export const { useGetAlProjectQuery, useGetSingleProjectQuery } = projectApis

export default projectApis