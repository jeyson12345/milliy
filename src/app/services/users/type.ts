import { IBaseDataRes, IBaseId, IBaseRes } from 'src/app/type';

export interface ILogin {
  username: string;
  password: string;
}

export interface ITokensRes {
  message: string;
  token: string;
}

export interface IUser extends IBaseRes<object> {
  firstName: string;
  surname: string;
  secondName: string;
  phoneNumber: string;
  telegramId: string;
  region: string;
  city: string;
  birthdate: string;
  isBlocked: boolean;
  age: number;
  sex: string;
  balance: number;
  combinedScore: number;
  childrenCount: number;
  referralsCount: number;
  scanCount: number;
}

export interface IUserScansReferrals {
  scanners: IBaseDataRes<IUserScans>;
  referrals: IBaseDataRes<IUserReferrals>;
}

export interface IUserScans {
  qrCode: {
    code: string;
    title: string;
    _id: IBaseId;
  };
  registrationCompleted: boolean;
  scannedAt: string;
}

export interface IUserReferrals {
  registeredAt: string;
  referred: {
    firstName: string;
    phoneNumber: string;
    surname: string;
    secondName: string;
    telegramId: string;
    _id: IBaseId;
  };
}

export interface IBlockRes {
  message: string;
  isBanned: boolean;
}

// QR code types
export interface IQRDto {
  validityHours: number;
  title: string;
  validFrom: string;
}
export interface IQRRes extends IBaseRes<object> {
  title: string;
  code: string;
  validUntil: string;
  isActive: boolean;
}

export interface IWinnersRes extends IBaseRes<object> {
  _id: string;
  startedAt: string;
  endedAt: string;
  wonAt: string;
  winType: string;
  userId: IUser;
}

// Scan types
export interface IScanRes extends IBaseRes<object> {
  userId: IUser;
  qrCodeId: IQRRes;
  scannedAt: string;
  registrationCompleted: boolean;
}

export interface IMessageRes extends IBaseRes<object> {
  message: string;
  createdBy: IRecipient;
  recipient: IRecipient;
  isBroadcast: boolean;
}

export interface IRecipient {
  _id: string;
  firstName: string;
  surname: string;
  phoneNumber: string;
  telegramId: string;
}

// Location types
export interface IRegion {
  id: number;
  name: string;
}
export interface IDistrict extends IRegion {
  city_id: number;
}

// Types for statistcs page
export interface IStatistcsRes {
  stats: Stats;
  demographics: Demographics;
  dailyStats: DailyStat[];
}
export interface Stats {
  totalUsers: number;
  newUsers: number;
  totalScanners: number;
  todayScanners: number;
  activeUsers: number;
}

export interface Demographics {
  gender: Gender;
  ageGroups: AgeGroups;
  cities: Record<string, string>;
}

export interface Gender {
  male: number;
  unknown: number;
  female: number;
}

export interface AgeGroups {
  adults: number;
  young_adults: number;
  teenagers: number;
  unknown: number;
  middle_aged: number;
  seniors: number;
}

export interface DailyStat {
  _id: string;
  count: number;
}
