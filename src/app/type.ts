export type IBaseId = string;
export type IBaseRes<TData> = TData & {
  _id: IBaseId;
  key?: number;
  is_archived?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type IBaseNameRes<TData = {}> = TData & {
  id: IBaseRes<TData>['_id'];
  name_uz: string;
  name_oz: string;
  name_ru: string;
};

export interface IBaseEdit<TData> {
  id: IBaseRes<TData>['_id'];
  body: Partial<TData>;
  method?: 'PUT' | 'PATCH';
}

export interface IBaseReq<TData> extends Partial<IBaseEdit<TData>> {
  platform: 'web' | 'mobile';
  params?: string;
}

export interface IBaseDataRes<TData> {
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
  items: TData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface IBaseDeleteRes {
  id: IBaseId;
  success?: boolean;
}

export interface IBaseOption {
  label: string;
  value: string;
}

export interface IBaseAddProps<TData> {
  data?: TData;
  setData: React.Dispatch<React.SetStateAction<TData | undefined>>;
  handleGet: () => void;
}

export interface IParams {
  limit?: number;
  offset?: number;
}

export type PositionAttributes = 'ceo' | 'accountant' | 'employee';
export type CurrencyAttributes = 'usd' | 'uzs';
export type CurrencyAttributes2 = 'usd' | 'uzs';
