import baseApis from '../query/baseApis';

export const supportMessageRoomApis = baseApis.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    supportMessage: build.query({
      query: (id) => ({
        url: `/support-message/get/${id}`,
        method: 'GET',
        keepalive: true,
      }),
    }),
  }),
})

export const { useSupportMessageQuery } = supportMessageRoomApis

export default supportMessageRoomApis