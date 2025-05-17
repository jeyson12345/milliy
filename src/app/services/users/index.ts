import { IBaseDataRes, IBaseDeleteRes, IBaseId } from 'src/app/type';
import { api } from '../api';
import {
  IBlockRes,
  IDistrict,
  ILogin,
  IMessageRes,
  IQRDto,
  IQRRes,
  IQuestionAnswerRes,
  IQuestionDto,
  IQuestionRes,
  IRegion,
  IScanRes,
  IStatistcsRes,
  ITokensRes,
  IUser,
  IUserScansReferrals,
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
    //Get users endpoint
    getUsers: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/users?` + params,
      }),
    }),
    //Get user by id endpoint
    getUserById: build.mutation<IBaseDataRes<IUser>, string>({
      query: (id) => ({
        url: `/admin/users/` + id,
      }),
    }),
    //Get user scans endpoint
    getUserScansReferrals: build.mutation<IUserScansReferrals, string>({
      query: (id) => ({
        url: `/admin/users/${id}/scanners-and-referrals?size=1000`,
      }),
    }),
    //Get users donwload endpoint
    getUsersDownload: build.mutation<string, string>({
      query: (params) => ({
        url: `/admin/users/download?` + params,
      }),
    }),
    //Get top users endpoint
    getTopUsers: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/top-users?` + params,
      }),
    }),
    //Get top weekly users endpoint
    getTopWeeklyUsers: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/users/top-weekly?` + params,
      }),
    }),
    //Get top users by referral endpoint
    getTopUsersByReferral: build.mutation<IBaseDataRes<IUser>, string>({
      query: (params) => ({
        url: `/admin/users/top-users-by-referral?` + params,
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

    /////////////////// Scans endpoints //////////////////////
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

    /////////////////// Questions endpoints //////////////////////
    //Get questions endpoint
    getQuestions: build.mutation<IQuestionRes[], string>({
      query: (params) => ({
        url: `/questions?` + params,
      }),
    }),
    //Get question answers endpoint
    getQuestionAnswers: build.mutation<
      IBaseDataRes<IQuestionAnswerRes>,
      string
    >({
      query: (id) => ({
        url: `/questions/${id}/answers`,
      }),
    }),
    //Add question endpoint
    addQuestion: build.mutation<IQuestionRes, IQuestionDto>({
      query: (body) => ({
        url: `/questions`,
        method: 'POST',
        body,
      }),
    }),
    // Delete question endpoint
    deleteQuestion: build.mutation<IBaseDeleteRes, IBaseId>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersMutation,
  useGetUserByIdMutation,
  useGetUserScansReferralsMutation,
  useGetUsersDownloadMutation,
  useBlockUserMutation,
  useGetTopUsersMutation,
  useGetTopWeeklyUsersMutation,
  useGetTopUsersByReferralMutation,

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

  // Questions endpoints
  useGetQuestionsMutation,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionAnswersMutation,
} = authApi;
