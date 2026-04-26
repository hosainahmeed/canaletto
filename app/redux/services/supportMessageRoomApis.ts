import baseApis from '../query/baseApis';

export const supportMessageRoomApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    supportMessage: build.query({
      query: ({ id, limit }) => ({
        url: `/support-message/get/${id}`,
        method: 'GET',
        params: { limit },
      }),
    }),
  }),
})

export const { useSupportMessageQuery } = supportMessageRoomApis

export default supportMessageRoomApis