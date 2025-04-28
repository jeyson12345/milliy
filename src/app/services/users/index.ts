import { IBaseDataRes, IBaseId } from 'src/app/type';
import { api } from '../api';
import {
  IBlockRes,
  IDistrict,
  ILogin,
  IMessageRes,
  IQRDto,
  IQRRes,
  IRegion,
  IScanRes,
  IStatistcsRes,
  ITokensRes,
  IUser,
  IWinnersRes,
} from './type';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Login endpoint
    login: build.mutation<ITokensRes, ILogin>({
      query: (body) => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      }),
    }),

    /////////////////// User endpoints //////////////////////
    //Get user endpoint
    getUsers: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/users?` + params,
      }),
    }),
    //Get user endpoint
    getUsersDownload: build.mutation<string, string>({
      query: (params) => ({
        url: `/admin/users/download?` + params,
      }),
    }),
    //Get top user endpoint
    getTopUsers: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/top-users?` + params,
      }),
    }),
    //Block user endpoint
    blockUser: build.mutation<IBlockRes, IBaseId>({
      query: (userId) => ({
        url: `/admin/ban-user`,
        method: 'POST',
        body: { userId },
      }),
    }),

    /////////////////// Winners endpoints //////////////////////
    //Get winners endpoint
    getWinners: build.mutation<IBaseDataRes<IWinnersRes>, string>({
      query: (params) => ({
        url: `/admin/get-winners?` + params,
      }),
    }),
    //Select daily winner endpoint
    selectDailyWinner: build.mutation<IUser, void>({
      query: () => ({
        url: `/winners/select-daily-winner`,
        method: 'POST',
      }),
    }),
    //Select weekly winner endpoint
    selectWeeklyWinner: build.mutation<IUser, void>({
      query: () => ({
        url: `/winners/select-weekly-winner`,
        method: 'POST',
      }),
    }),
    //Select monthly winner endpoint
    selectMonthlyWinner: build.mutation<IUser, void>({
      query: () => ({
        url: `/winners/select-monthly-winner`,
        method: 'POST',
      }),
    }),

    /////////////////// Stats endpoints //////////////////////
    //Get scans endpoint
    getStats: build.query<IStatistcsRes, void>({
      query: () => ({
        url: `/admin/dashboard`,
      }),
    }),

    /////////////////// Scan endpoints //////////////////////
    //Get scans endpoint
    getScans: build.mutation<IBaseDataRes<IScanRes>, string>({
      query: (params) => ({
        url: `/admin/scans?` + params,
      }),
    }),

    /////////////////// QR codes endpoints //////////////////////
    //Get qr codes endpoint
    getQrCodes: build.mutation<IBaseDataRes<IQRRes>, string>({
      query: (params) => ({
        url: `/admin/qr-codes?` + params,
      }),
    }),
    // Generate qr code endpoint
    generateQR: build.mutation<IQRRes, Partial<IQRDto>>({
      query: (body) => ({
        url: `/admin/qr-codes`,
        method: 'POST',
        body,
      }),
    }),
    //Download qr code endpoint
    downloadQrCode: build.mutation<string, IBaseId>({
      query: (id) => ({
        url: `/admin/qr-codes/${id}/download`,
      }),
    }),

    /////////////////// Messages endpoints //////////////////////
    //Get messages endpoint
    getMessages: build.mutation<IBaseDataRes<IMessageRes>, string>({
      query: (params) => ({
        url: `/admin/messages?` + params,
      }),
    }),
    sendMessageToAll: build.mutation<
      IBaseDataRes<IMessageRes>,
      { message: string }
    >({
      query: (body) => ({
        url: `/admin/send-message-to-all`,
        method: 'POST',
        body,
      }),
    }),
    sendMessageToUser: build.mutation<
      IBaseDataRes<IMessageRes>,
      { message: string; userId: string }
    >({
      query: (body) => ({
        url: `/admin/send-message-to-user`,
        method: 'POST',
        body,
      }),
    }),

    /////////////////// Location endpoints //////////////////////
    //Get regions endpoint
    getRegions: build.query<IRegion[], void>({
      query: () => ({
        url: `/locations/cities`,
      }),
    }),
    //Get districts endpoint
    getDistricts: build.query<IDistrict[], number | undefined>({
      query: (id) => ({
        url: `/locations/regions/${id}`,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersMutation,
  useGetUsersDownloadMutation,
  useBlockUserMutation,
  useGetTopUsersMutation,

  // Stats endpoints
  useGetStatsQuery,

  // Scan endpoints
  useGetScansMutation,

  // QR codes endpoints
  useGetQrCodesMutation,
  useGenerateQRMutation,
  useDownloadQrCodeMutation,

  // Winners endpoints
  useGetWinnersMutation,
  useSelectDailyWinnerMutation,
  useSelectWeeklyWinnerMutation,
  useSelectMonthlyWinnerMutation,

  // Messages endpoints
  useGetMessagesMutation,
  useSendMessageToAllMutation,
  useSendMessageToUserMutation,

  //Location endpoints
  useGetRegionsQuery,
  useGetDistrictsQuery,
} = authApi;
