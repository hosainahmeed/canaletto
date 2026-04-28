import baseApis from '../query/baseApis';

const propertyFileApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyPropertyFiles: builder.query({
      query: (id: string) => ({
        url: `/property-file/get-all/${id}`,
        method: 'GET',
      }),
      providesTags: ["propertyFile"]
    }),
    getSinglePropertyFile: builder.query({
      query: (id: string) => ({
        url: `/property-file/get-single/${id}`,
        method: 'GET',
      }),
      providesTags: ["propertyFile"]
    }),
  })
})

export const { useGetMyPropertyFilesQuery, useGetSinglePropertyFileQuery } = propertyFileApis

export default propertyFileApis