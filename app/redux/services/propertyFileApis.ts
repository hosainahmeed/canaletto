import baseApis from '../query/baseApis';

const propertyFileApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMyPropertyFiles: builder.query({
      query: (id: string) => ({
        url: `/property-file/get-all/${id}`,
        method: 'GET',
      }),
      providesTags: ["propertyFile"]
    }),
    grtSinglePropertyFile: builder.query({
      query: (id: string) => ({
        url: `/property-file/get-single/${id}`,
        method: 'GET',
      }),
      providesTags: ["propertyFile"]
    }),
  })
})

export const { useGetMyPropertyFilesQuery, useLazyGrtSinglePropertyFileQuery } = propertyFileApis