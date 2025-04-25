import { Descriptions, DescriptionsProps, Drawer } from 'antd';
import { IUser } from 'src/app/services/users/type';
import { colors } from 'src/constants/theme';

interface IProps {
  open: boolean;
  data?: IUser;
  onClose: (open: any) => void;
}

export const UserInfo = ({ open = true, onClose, data }: IProps) => {
  const items: DescriptionsProps['items'] = [
    {
      label: 'F.I.Sh.',
      key: 'firstName',
      children: `${data?.firstName} ${data?.secondName} ${data?.surname}`,
      span: 3,
    },
    {
      label: 'Jinsi',
      key: 'sex',
      children: data?.sex === 'male' ? 'Erkak' : 'Ayni',
      span: 3,
    },
    {
      label: `Tug'ilgan sanasi`,
      key: 'birthdate',
      children: new Date(String(data?.birthdate)).toLocaleDateString('uz-UZ'),
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
      children: data?.balance,
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

  return (
    <Drawer
      width={600}
      open={open}
      onClose={onClose}
      title="Foydalanuvchi haqida"
    >
      <Descriptions bordered items={items} />
    </Drawer>
  );
};
