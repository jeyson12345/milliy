import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetWinnersMutation } from 'src/app/services/users';
import { IWinnersRes } from 'src/app/services/users/type';
import TableContent from 'src/components/cards/table_content';
import useParamsHook from 'src/hooks/params';

function Winners() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetWinnersMutation();
  const [data, setData] = useState<IWinnersRes[]>();

  // Search params
  const { searchParams, params } = useParamsHook();
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  // Get
  const handleGet = () => {
    const initial = (Number(page || 1) - 1) * Number(size || 10);

    get(params)
      .unwrap()
      .then((res) => {
        setData(
          res.items.map((item, index) => {
            return {
              ...item,
              key: initial + index + 1,
            };
          })
        );
      });
  };

  useEffect(() => handleGet(), [params, pathname]);

  return (
    <TableContent
      title="G'oliblar"
      tableHeightGap={180.8}
      paginationVisible={false}
      dataSource={data}
      columns={columns}
      loading={isLoading}
    />
  );
}

export default Winners;

export const columns: ColumnsType<IWinnersRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
    align: 'center',
  },
  {
    title: 'Ism, familya',
    key: 'name',
    render: (_, { userId }) =>
      `${userId?.firstName} ${userId?.secondName} ${userId?.surname}`,
  },
  {
    title: 'Viloyat',
    key: 'city',
    render: (_, { userId }) => userId?.city,
  },
  {
    title: 'Tuman',
    key: 'region',
    render: (_, { userId }) => userId?.city,
  },
  {
    title: 'Jami bali',
    key: 'combinedScore',
    render: (_, { userId }) => userId?.combinedScore?.toLocaleString(),
  },
  {
    title: 'Referal ballari',
    key: 'referralBonus',
    render: (_, { userId }) => userId?.referralBonus?.toLocaleString(),
  },
  {
    title: 'Yutuq turi',
    key: 'type',
    align: 'center',
    width: 140,
    render: (_, record) =>
      record?.winType == 'daily'
        ? 'Kunlik'
        : record?.winType == 'weekly'
        ? 'Haftalik'
        : record?.winType == 'answer'
        ? 'Savol javob'
        : record?.winType == 'referral'
        ? "Referal bo'yicha"
        : 'Oylik',
  },
  {
    title: 'Yutgan sana',
    key: 'date',
    width: 200,
    align: 'center',
    render: (_, record) => dayjs(record?.wonAt).format('DD-MM-YYYY HH:mm:ss'),
  },
];
