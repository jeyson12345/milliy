import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetMessagesMutation } from 'src/app/services/users';
import { IMessageRes } from 'src/app/services/users/type';
import { PlusIcon } from 'src/assets/icon';
import TableContent from 'src/components/cards/table_content';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';
import { AddMessage } from './components/AddMessage';

function QRCodes() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetMessagesMutation();
  const [data, setData] = useState<IMessageRes[]>();

  const [open, setOpen] = useState(false);

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
    <>
      {/* // Table */}
      <TableContent
        title="QR-kodlar"
        total={allData?.pagination?.total}
        dataSource={data}
        columns={columns}
        loading={isLoading}
        headerExtra={
          <Button
            size="large"
            type="primary"
            icon={<PlusIcon />}
            onClick={() => setOpen(true)}
          >
            Barchaga xabar yuborish
          </Button>
        }
      />

      {/* // Modals */}
      <AddMessage open={open} setOpen={setOpen} callBack={handleGet} />
    </>
  );
}

export default QRCodes;

export const columns: ColumnsType<IMessageRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
  },
  {
    title: 'Sana',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (val) => new Date(val).toLocaleDateString('uz-UZ'),
  },
  {
    title: 'Holati',
    dataIndex: 'isBroadcast',
    key: 'isBroadcast',
    width: 100,
    render: (val) => (
      <p style={{ color: val ? colors.blue : colors.red }}>
        {val ? 'Umumiy' : 'Foydalanuvchi'}
      </p>
    ),
  },
];
