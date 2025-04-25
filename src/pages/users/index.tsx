import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useBlockUserMutation,
  useGetTopUsersMutation,
  useGetUsersMutation,
} from 'src/app/services/users';
import { IUser } from 'src/app/services/users/type';
import { IBaseId } from 'src/app/type';
import TableActions from 'src/components/cards/table_actions';
import TableContent from 'src/components/cards/table_content';
import FilterDistrict from 'src/components/filter/district';
import FilterRangePicker from 'src/components/filter/range_picker';
import FilterRegion from 'src/components/filter/region';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';
import { AddMessage } from '../messages/components/AddMessage';
import { UserInfo } from './components/UserInfo';

function Users({ isTopUser }: { isTopUser?: boolean }) {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: users, isLoading: usersLoading }] = useGetUsersMutation();
  const [getTopUsers, { data: topUsers, isLoading: topUsersLoading }] =
    useGetTopUsersMutation();
  const [data, setData] = useState<IUser[]>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>();
  const [openInfo, setOpenInfo] = useState(false);

  // Search params
  const { searchParams, params } = useParamsHook();
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  // Get
  const handleGet = () => {
    const initial = (Number(page || 1) - 1) * Number(size || 10);

    if (isTopUser) {
      getTopUsers(params)
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
    } else {
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
    }
  };

  useEffect(() => handleGet(), [params, pathname]);

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

  return (
    <>
      <TableContent
        title={isTopUser ? 'Top foydalanuvchilar' : 'Foydalanuvchilar'}
        total={
          isTopUser ? topUsers?.pagination?.total : users?.pagination?.total
        }
        dataSource={data}
        columns={columns}
        loading={isTopUser ? topUsersLoading : usersLoading}
        filters={
          <>
            <FilterRegion />
            <FilterDistrict />
            <FilterRangePicker />
          </>
        }
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
    width: 50,
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
    render: (val) => (val === 'male' ? 'Erkak' : 'Ayol'),
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
    dataIndex: 'balance',
    key: 'balance',
    width: 120,
    align: 'center',
    render: (_, record) =>
      Number(record?.referralsCount || 0) + Number(record?.scanCount || 0),
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
