import baseApis from "../query/baseApis";

const authApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    verifyForgotOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-reset-otp',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),

    verifyResetOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-reset-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendResetCode: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-reset-code',
        method: 'POST',
        body: data,
      }),
    }),

    verificationCreate: builder.mutation({
      query: (data) => ({
        url: '/verification/create',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    deleteUserAccount: builder.mutation({
      query: (data) => ({
        url: '/user/delete-account',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
  })
})

export const {
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useVerificationCreateMutation,
  useSignInMutation,
  useChangePasswordMutation,
  useDeleteUserAccountMutation,
  useVerifyResetOtpMutation,
  useResendResetCodeMutation,
} = authApis

export default authApis

