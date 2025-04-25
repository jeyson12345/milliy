import { Button, Flex, Form, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useDownloadQrCodeMutation,
  useGenerateQRMutation,
  useGetQrCodesMutation,
} from 'src/app/services/users';
import { IQRRes } from 'src/app/services/users/type';
import { PlusIcon } from 'src/assets/icon';
import TableContent from 'src/components/cards/table_content';
import { DateFormItem, InputFormItem } from 'src/components/form';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';

function QRCodes() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetQrCodesMutation();
  const [data, setData] = useState<IQRRes[]>();
  const [open, setOpen] = useState(false);

  // Download QR code
  const [download, { data: image }] = useDownloadQrCodeMutation();
  console.log('image', image);

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

  const columns: ColumnsType<IQRRes> = [
    ...baseColumns,
    {
      title: 'Fayli',
      dataIndex: '_id',
      key: '_id',
      render: (val) => (
        <a
          href={`http://137.184.119.32:3000/admin/qr-codes/${val}/download`}
          download
        >
          Yuklab olish
        </a>
      ),
    },
  ];

  // Add new QR code
  const [form] = Form.useForm();
  const [generate, { isLoading: generateLoading }] = useGenerateQRMutation();
  const onFinish = (val: any) => {
    let obj = {
      validityHours: 1,
      title: val?.title,
      startTime: new Date(val?.startTime).toISOString(),
    };
    generate(obj)
      .unwrap()
      .then(() => {
        setOpen(false);
        message.success('QR kod muvaffaqiyatli yaratildi!');
        form.resetFields();
        handleGet();
      });
  };

  return (
    <TableContent
      title="QR-kodlar"
      total={allData?.pagination?.total}
      dataSource={data}
      columns={columns}
      loading={isLoading}
      headerExtra={
        <>
          <Button
            size="large"
            type="primary"
            icon={<PlusIcon />}
            onClick={() => setOpen(true)}
          >
            Yangi QR-kod yaratish
          </Button>

          <Modal
            open={open}
            footer={null}
            title="Yangi QR-kod yaratish"
            onCancel={() => {
              setOpen(false);
              form.resetFields();
            }}
          >
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <InputFormItem
                name="title"
                label="Nomi"
                message="QR kod nomini kiriting!"
              />
              <DateFormItem
                name="startTime"
                label="Boshlanish vaqti"
                message="Boshlanish vaqtini tanlang!"
                showTime
              />

              <Flex justify="end">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={generateLoading}
                >
                  Yaratish
                </Button>
              </Flex>
            </Form>
          </Modal>
        </>
      }
    />
  );
}

export default QRCodes;

export const baseColumns: ColumnsType<IQRRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Nom',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Kod',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Eskirish vaqti',
    dataIndex: 'validUntil',
    key: 'validUntil',
    width: 140,
    render: (val) => (val ? new Date(val).toLocaleDateString('uz-UZ') : ''),
  },
  {
    title: 'Holati',
    dataIndex: 'isActive',
    key: 'isActive',
    width: 100,
    render: (val) => (
      <p style={{ color: val ? colors.blue : colors.red }}>
        {val ? 'Aktiv' : 'Aktiv emas'}
      </p>
    ),
  },
];
