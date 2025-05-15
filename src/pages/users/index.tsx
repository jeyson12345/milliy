import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DocumentDownload } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { hostName } from 'src/app/services/api/const';
import {
  useBlockUserMutation,
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

interface Props {
  isTopUser?: boolean;
  isWeeklyUser?: boolean;
  isReferralUser?: boolean;
}

function Users({ isTopUser, isWeeklyUser, isReferralUser }: Props) {
  // Methods
  const { pathname } = useLocation();

  const [get, { data: users, isLoading: usersLoading }] = useGetUsersMutation();
  const [getTopUsers, { data: topUsers, isLoading: topLoading }] =
    useGetTopUsersMutation();
  const [getWeeklyUsers, { data: weeklyUsers, isLoading: weeklyLoading }] =
    useGetTopWeeklyUsersMutation();
  const [
    getReferralUsers,
    { data: referralUsers, isLoading: referralLoading },
  ] = useGetTopUsersByReferralMutation();

  const [data, setData] = useState<IUser[]>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>();
  const [openInfo, setOpenInfo] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Search params
  const { searchParams, params } = useParamsHook();
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
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Get
  const handleGet = async () => {
    const initial = (Number(page || 1) - 1) * Number(size || 10);
    let res: IBaseDataRes<IUser>;
    const { abort: abortTop, unwrap: unwrapTop } = getTopUsers(params);
    const { abort: abortWeekly, unwrap: unwrapWeekly } = getWeeklyUsers(params);
    const { abort: abortReferral, unwrap: unwrapReferral } =
      getReferralUsers(params);
    const { abort, unwrap } = get(params);
    if (isTopUser) {
      abortWeekly();
      abortReferral();
      abort();
      res = await unwrapTop();
    } else if (isWeeklyUser) {
      abortTop();
      abortReferral();
      abort();
      res = await unwrapWeekly();
    } else if (isReferralUser) {
      abortTop();
      abortWeekly();
      abort();
      res = await unwrapReferral();
    } else {
      abortTop();
      abortWeekly();
      abortReferral();
      res = await unwrap();
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
  }, [params, pathname]);

  //Block user
  const [block, { originalArgs, isLoading: blockLoading }] =
    useBlockUserMutation();
  // console.log('originalArgs', originalArgs);

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

  if (!(isTopUser || isWeeklyUser || isReferralUser)) columns.splice(6, 1);
  if (isReferralUser) columns.splice(6, 1, referralObj as any);

  return (
    <>
      <TableContent
        title={
          isTopUser
            ? 'Top foydalanuvchilar'
            : isWeeklyUser
            ? 'Top haftalik foydalanuvchilar' +
              (weeklyUsers
                ? ` (${new Date(weeklyUsers.period.start).toLocaleDateString(
                    'uz-UZ'
                  )} / ${new Date(weeklyUsers.period.end).toLocaleDateString(
                    'uz-UZ'
                  )})`
                : '')
            : isReferralUser
            ? 'Top referal foydalanuvchilar'
            : 'Foydalanuvchilar'
        }
        total={
          isTopUser
            ? topUsers?.pagination?.total
            : isWeeklyUser
            ? weeklyUsers?.pagination.total
            : isReferralUser
            ? referralUsers?.pagination?.total
            : users?.pagination?.total
        }
        dataSource={data}
        columns={columns}
        loading={usersLoading || topLoading || weeklyLoading || referralLoading}
        headerExtra={
          isTopUser || isWeeklyUser || isReferralUser ? null : (
            <Button
              size="large"
              type="primary"
              onClick={handleDownload}
              loading={downloadLoading}
              icon={<DocumentDownload size="16" />}
            >
              Yuklash
            </Button>
          )
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
