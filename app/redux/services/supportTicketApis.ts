import baseApis from '../query/baseApis';

export const supportTicketApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    myTickets: build.query({
      query: (params) => ({
        url: '/support-ticket/my-tickets',
        method: 'GET',
        params
      }),
    }),
    ticketCreate: build.mutation({
      query: (data: { issue: string, propertyId?: string }) => ({
        url: '/support-ticket/create',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useTicketCreateMutation, useMyTicketsQuery } = supportTicketApis

export default supportTicketApis