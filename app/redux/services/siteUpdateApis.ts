import baseApis from '../query/baseApis';

const siteUpdateApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyPropertyImage: builder.query({
      query: (id: string) => ({
        url: `/property-image/get-all/${id}`,
        method: 'GET',
      }),
    }),
    getSinglePropertyImages: builder.query({
      query: (id: string) => ({
        url: `/property-image/get-single/${id}`,
        method: 'GET',
      }),
    }),
  })
})

export const { useGetMyPropertyImageQuery, useGetSinglePropertyImagesQuery } = siteUpdateApis

export default siteUpdateApis