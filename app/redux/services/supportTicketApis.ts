import baseApis from '../query/baseApis';

export const supportTicketApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    ticketCreate: build.mutation({
      query: (data: { issue: string, propertyId?: string }) => ({
        url: '/support-ticket/create',
        method: 'POST',
        body: data
      }),
    }),
  }),
})

export const { useTicketCreateMutation } = supportTicketApis

export default supportTicketApis