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
    createInterestedClient: builder.mutation({
      query: (data) => ({
        url: "/interested-client/create",
        method: 'POST',
        body: data,
      }),
    }),

  })
})

export const { useGetAlProjectQuery, useGetSingleProjectQuery, useCreateInterestedClientMutation } = projectApis

export default projectApis