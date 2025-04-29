import {
  Descriptions,
  DescriptionsProps,
  Drawer,
  Table,
  Tabs,
  TabsProps,
} from 'antd';
import { useEffect, useState } from 'react';
import { useGetScansMutation } from 'src/app/services/users';
import { IScanRes, IUser } from 'src/app/services/users/type';
import { colors } from 'src/constants/theme';
import { scanColumns } from 'src/pages/scans';

interface IProps {
  open: boolean;
  data?: IUser;
  onClose: (open: any) => void;
}

export const UserInfo = ({ open = true, onClose, data }: IProps) => {
  const [getScans, { isLoading: scanLoading }] = useGetScansMutation();
  const [scans, setScans] = useState<IScanRes[]>();
  const [key, setKey] = useState('1');

  const handleGetScans = () => {
    if (data) {
      setKey(`1`);
      getScans('size=10000&userId=' + data?._id)
        .unwrap()
        .then((res) => {
          setScans(
            res.items.map((item, index) => {
              return {
                ...item,
                key: index + 1,
              };
            })
          );
        });
    }
  };

  useEffect(() => {
    handleGetScans();
  }, [data]);

  const infoItems: DescriptionsProps['items'] = [
    {
      label: 'F.I.Sh.',
      key: 'firstName',
      children: `${data?.firstName || ''} ${data?.secondName || ''} ${
        data?.surname || ''
      }`,
      span: 3,
    },
    {
      label: 'Jinsi',
      key: 'sex',
      children:
        data?.sex === 'male' ? 'Erkak' : data?.sex === 'female' ? 'Ayol' : '',
      span: 3,
    },
    {
      label: `Tug'ilgan sanasi`,
      key: 'birthdate',
      children: data?.birthdate
        ? new Date(String(data?.birthdate)).toLocaleDateString('uz-UZ')
        : '',
      span: 3,
    },
    {
      label: 'Yosh',
      key: 'age',
      children: data?.age,
      span: 3,
    },
    {
      label: 'Telefon raqami',
      key: 'phone',
      children: data?.phoneNumber,
      span: 3,
    },
    {
      label: 'Viloyat',
      key: 'region',
      children: data?.city,
      span: 3,
    },
    {
      label: 'Tuman',
      key: 'city',
      children: data?.region,
      span: 3,
    },
    {
      label: 'Jami bali',
      key: 'balance',
      children: (data?.scanCount || 0) + (data?.referralsCount || 0),
      span: 3,
    },
    {
      label: 'Referallar soni',
      key: 'referal',
      children: data?.referralsCount,
      span: 3,
    },
    {
      label: "Ro'yxatdan o'tgan sana",
      key: 'createdAt',
      children: new Date(String(data?.createdAt)).toLocaleDateString('uz-UZ'),
      span: 3,
    },
    {
      label: 'Holati',
      key: 'isBlocked',
      children: (
        <p style={{ color: data?.isBlocked ? colors.red : colors.blue }}>
          {data?.isBlocked ? 'Bloklangan' : 'Faol'}
        </p>
      ),
      span: 3,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Malumotlar',
      children: <Descriptions bordered items={infoItems} />,
    },
    {
      key: '2',
      label: 'Skanerlar',
      children: (
        <Table
          dataSource={scans}
          columns={[scanColumns[0], ...scanColumns.slice(2)]}
          bordered
          loading={scanLoading}
          scroll={{ x: 100, y: innerHeight - 234 }}
        />
      ),
    },
    {
      key: '3',
      label: 'Referallar',
      children: 'Content of Tab Pane 3',
    },
  ];

  return (
    <Drawer
      width={600}
      open={open}
      onClose={onClose}
      title="Foydalanuvchi haqida"
      className="user-info-drawer"
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        activeKey={key}
        onChange={setKey}
      />
    </Drawer>
  );
};
