import baseApis from '../query/baseApis';

const invoiceApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (payload: FormData) => ({
        url: '/payment-invoice/create',
        method: 'POST',
        body: payload,
      })
    }),
    getInvoidById: builder.query({
      query: (id) => ({
        url: `payment-invoice/get-single/${id}`,
        method: 'GET',
      })
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `payment-invoice/delete/${id}`,
        method: 'DELETE',
      })
    })
  })
})
export const { useCreateInvoiceMutation, useGetInvoidByIdQuery, useDeleteInvoiceMutation } = invoiceApis
