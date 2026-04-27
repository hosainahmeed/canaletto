import baseApis from '../query/baseApis';

const legalUpdateApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLegalUpdate: builder.query({
      query: (params?: { frame?: string, searchTerm?: string }) => ({
        url: `/legal-update/get-all`,
        method: 'GET',
        params
      })
    }),
    getLegalUpdateById: builder.query({
      query: (id: string) => ({
        url: `/legal-update/get-single/${id}`,
        method: 'GET',
      })
    }),
  })
})
export const { useGetLegalUpdateQuery, useGetLegalUpdateByIdQuery } = legalUpdateApis
