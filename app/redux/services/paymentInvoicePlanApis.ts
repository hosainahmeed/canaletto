import baseApis from '../query/baseApis';

const paymentInvoicePlanApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInvoiceByPropertyId: builder.query({
      query: (id: string) => ({
        url: `/payment-invoice/get-all/${id}`,
        method: "GET"
      }),
      providesTags: ["invoice"]
    }),
    getPaymentPlansByPropertyId: builder.query({
      query: (id: string) => ({
        url: `/payment-plan/get-all/${id}`,
        method: "GET"
      }),
      providesTags: ["paymentPlan"]
    })
  })
})

export const { useGetInvoiceByPropertyIdQuery, useGetPaymentPlansByPropertyIdQuery } = paymentInvoicePlanApis

export default paymentInvoicePlanApis