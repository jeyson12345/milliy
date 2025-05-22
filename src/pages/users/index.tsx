import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DocumentDownload } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { hostName } from 'src/app/services/api/const';
import {
  useBlockUserMutation,
  useGetTopUsersByAnswersMutation,
  useGetTopUsersByLinksMutation,
  useGetTopUsersByReferralMutation,
  useGetTopUsersMutation,
  useGetTopWeeklyUsersMutation,
  useGetUsersMutation,
} from 'src/app/services/users';
import { IUser } from 'src/app/services/users/type';
import { IBaseDataRes, IBaseId } from 'src/app/type';
import TableActions from 'src/components/cards/table_actions';
import TableContent from 'src/components/cards/table_content';
import FilterDistrict from 'src/components/filter/district';
import FilterRangePicker from 'src/components/filter/range_picker';
import FilterRegion from 'src/components/filter/region';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';
import { AddMessage } from '../messages/components/AddMessage';
import { UserInfo } from './components/UserInfo';
import './user.scss';

function Users() {
  // Methods
  const [get, { data: users, isLoading: usersLoading }] = useGetUsersMutation();
  const [getTopUsers, { data: topUsers, isLoading: topLoading }] =
    useGetTopUsersMutation();
  const [getWeeklyUsers, { data: weeklyUsers, isLoading: weeklyLoading }] =
    useGetTopWeeklyUsersMutation();
  const [
    getReferralUsers,
    { data: referralUsers, isLoading: referralLoading },
  ] = useGetTopUsersByReferralMutation();
  const [getAnswerUsers, { data: answersUsers, isLoading: answersLoading }] =
    useGetTopUsersByAnswersMutation();
  const [getLinksUsers, { data: linksUsers, isLoading: linksLoading }] =
    useGetTopUsersByLinksMutation();

  const [data, setData] = useState<IUser[]>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>();
  const [openInfo, setOpenInfo] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Filter
  const [filter, setFilter] = useState<FilterTypes>('all');

  // Search params
  const { searchParams, params, handleMakeParams } = useParamsHook();
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      const response = await fetch(
        `${hostName}/admin/users/download?${
          params.includes('page') ? params : 'page=1&size=10&' + params
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const startIndex = (Number(page) - 1) * Number(size) + 1;
      const endIndex = startIndex + Number(size) - 1;
      link.download = `users(${startIndex}-${endIndex})-${Date.now()}.xlsx`;

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Get
  const handleGet = async () => {
    const initial = (Number(page || 1) - 1) * Number(size || 10);
    let res: IBaseDataRes<IUser>;

    if (filter === 'top') {
      res = await getTopUsers(params).unwrap();
    } else if (filter === 'weekly') {
      res = await getWeeklyUsers(params).unwrap();
    } else if (filter === 'referral') {
      res = await getReferralUsers(params).unwrap();
    } else if (filter === 'answers') {
      res = await getAnswerUsers(params).unwrap();
    } else if (filter === 'link') {
      res = await getLinksUsers(params).unwrap();
    } else {
      res = await get(params).unwrap();
    }
    if (res)
      setData(
        res.items.map((item, index) => {
          return {
            ...item,
            key: initial + index + 1,
          };
        })
      );
  };

  useEffect(() => {
    handleGet();
  }, [filter, params]);

  //Block user
  const [block, { originalArgs, isLoading: blockLoading }] =
    useBlockUserMutation();

  const blockUser = (id: IBaseId) => {
    block(id)
      .unwrap()
      .then((res) => {
        setData(
          (prev) =>
            prev?.map((item) => {
              return {
                ...item,
                isBlocked: item._id === id ? res.isBanned : item.isBlocked,
              };
            })
        );
      });
  };

  // Columns

  const columns: ColumnsType<IUser> = [
    ...baseColumns,
    {
      width: 100,
      title: 'Amallar',
      dataIndex: '_id',
      key: '_id',
      fixed: 'right',
      render: (id, el) => (
        <TableActions
          onBlock={() => blockUser(id)}
          blockLoading={originalArgs === id && blockLoading}
          isBlocked={el.isBlocked}
          onMessage={() => {
            setOpen(true);
            setUser(el);
          }}
          onView={() => {
            setUser(el);
            setOpenInfo(true);
          }}
        />
      ),
    },
  ];

  if (filter === 'all' || filter === 'answers') columns.splice(6, 1);
  if (filter === 'referral') columns.splice(6, 1, referralObj as any);
  if (filter === 'referral') columns.splice(7, 0, referralScoreObj as any);
  if (filter === 'answers') columns.splice(2, 1, answersCountObj as any);
  if (filter === 'answers') columns.splice(3, 1, answersObj as any);
  if (filter === 'link') columns.splice(6, 1, linksObj as any);

  return (
    <>
      <TableContent
        title={filterOptions.find((item) => item.value === filter)?.label}
        total={
          filter === 'top'
            ? topUsers?.pagination?.total
            : filter === 'weekly'
            ? weeklyUsers?.pagination.total
            : filter === 'referral'
            ? referralUsers?.pagination?.total
            : filter === 'answers'
            ? answersUsers?.pagination?.total
            : filter === 'link'
            ? linksUsers?.pagination?.total
            : users?.pagination?.total
        }
        dataSource={data}
        columns={columns}
        loading={
          usersLoading ||
          topLoading ||
          weeklyLoading ||
          referralLoading ||
          answersLoading ||
          linksLoading
        }
        headerExtra={
          <>
            {filter === 'all' && (
              <Button
                size="large"
                type="primary"
                onClick={handleDownload}
                loading={downloadLoading}
                icon={<DocumentDownload size="16" />}
              >
                Yuklash
              </Button>
            )}

            <Select
              options={filterOptions}
              onChange={(val) => {
                setFilter(val);
                handleMakeParams('page', '');
                handleMakeParams('size', '');
              }}
              value={filter}
              style={{ width: 200 }}
            />
          </>
        }
        filters={
          <>
            <FilterRegion />
            <FilterDistrict />
            <FilterRangePicker />
          </>
        }
        tableHeightGap={230.8}
      />

      <AddMessage
        open={open}
        setOpen={(val) => {
          setOpen(val);
          setUser(null);
        }}
        userId={user?._id}
      />

      <UserInfo
        open={openInfo}
        data={user || undefined}
        onClose={() => setOpenInfo(false)}
      />
    </>
  );
}

export default Users;

type FilterTypes = 'all' | 'top' | 'weekly' | 'referral' | 'answers' | 'link';

const filterOptions = [
  { value: 'all', label: 'Barcha foydalanuvchilar' },
  { value: 'top', label: 'Top foydalanuvchilar' },
  { value: 'weekly', label: 'Haftalik foydalanuvchilar' },
  { value: 'referral', label: 'Referal foydalanuvchilar' },
  { value: 'answers', label: 'Savol javob foydalanuvchilari' },
  { value: 'link', label: 'Link foydalanuvchilari' },
];

export const baseColumns: ColumnsType<IUser> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 70,
  },
  {
    title: 'F.I.Sh.',
    dataIndex: 'firstName',
    key: 'firstName',
    // width: 180,
    render: (_, el) =>
      (el.firstName || '') +
      ' ' +
      (el.surname || '') +
      ' ' +
      (el.secondName || ''),
  },
  {
    title: 'Jinsi',
    dataIndex: 'sex',
    key: 'sex',
    width: 60,
    align: 'center',
    render: (val) =>
      val === 'male' ? 'Erkak' : val === 'female' ? 'Ayol' : '',
  },
  {
    title: 'Yosh',
    dataIndex: 'age',
    key: 'age',
    width: 60,
    align: 'center',
  },
  {
    title: 'Viloyat',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: 'Tuman',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Jami bali',
    dataIndex: 'combinedScore',
    key: 'combinedScore',
    width: 120,
    align: 'center',
    render: (val) => (val ? val.toLocaleString('uz-UZ') : ''),
    sorter: (a, b) => a.balance - b.balance,
  },
  {
    title: "Ro'yxatdan o'tgan sana",
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 100,

    render: (val) => (val ? new Date(val).toLocaleDateString('uz-UZ') : ''),
  },
  {
    title: 'Holati',
    dataIndex: 'isBlocked',
    key: 'isBlocked',
    width: 100,
    align: 'center',
    render: (val) => (
      <p style={{ color: val ? colors.red : colors.blue }}>
        {val ? 'Bloklangan' : 'Faol'}
      </p>
    ),
  },
];

const referralObj = {
  title: 'Referallar soni',
  dataIndex: 'referralsCount',
  key: 'referralsCount',
  width: 120,
  align: 'center',
  render: (val: number) => (val ? val.toLocaleString('uz-UZ') : ''),
  sorter: (a: any, b: any) => a.balance - b.balance,
};
const referralScoreObj = {
  title: 'Referallar ballari',
  dataIndex: 'combinedScore',
  key: 'combinedScore',
  width: 120,
  align: 'center',
  render: (val: number) => (val ? val.toLocaleString('uz-UZ') : ''),
  sorter: (a: any, b: any) => a.balance - b.balance,
};
const answersCountObj = {
  title: 'Jami javoblar soni',
  dataIndex: 'answerCount',
  key: 'answerCount',
  width: 130,
  align: 'center',
  render: (val: number) => (val ? val.toLocaleString('uz-UZ') : ''),
  sorter: (a: any, b: any) => a.balance - b.balance,
};
const answersObj = {
  title: 'Jami javob ballari',
  dataIndex: 'totalBonus',
  key: 'totalBonus',
  width: 120,
  align: 'center',
  render: (val: number) => (val ? val.toLocaleString('uz-UZ') : ''),
  sorter: (a: any, b: any) => a.balance - b.balance,
};
const linksObj = {
  title: "O'tkazilgan linklar soni",
  dataIndex: 'linkScanCount',
  key: 'linkScanCount',
  width: 120,
  align: 'center',
  render: (val: number) => (val ? val.toLocaleString('uz-UZ') : ''),
  sorter: (a: any, b: any) => a.balance - b.balance,
};
