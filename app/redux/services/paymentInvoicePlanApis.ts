import baseApis from '../query/baseApis';

baseApis.injectEndpoints({
  endpoints: (builder) => ({
    get: builder.query({
      query: () => ({
        url: "",
        method: "GET"
      })
    })
  })
})