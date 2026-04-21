import baseApis from '../query/baseApis';

export const settingApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    legalAndCompanyInfo: build.query({
      query: () => ({
        url: '/legal-and-company/get',
        method: 'GET',
      }),
    }),
    getPrivacyPolicy: build.query({
      query: () => ({
        url: '/manage/get-privacy-policy',
        method: 'GET',
      }),
    }),
    getTermsAndConditions: build.query({
      query: () => ({
        url: '/manage/get-terms-conditions',
        method: 'GET',
      }),
    }),
  }),
})

export const { useLegalAndCompanyInfoQuery, useGetPrivacyPolicyQuery, useGetTermsAndConditionsQuery } = settingApis

export default settingApis