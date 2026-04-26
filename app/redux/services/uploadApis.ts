import baseApis from '../query/baseApis';

const uploadApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: '/file-upload/upload-files',
        method: 'POST',
        body: data,
      }),
    }),
  })
})

export const { useUploadFileMutation } = uploadApis

export default uploadApis