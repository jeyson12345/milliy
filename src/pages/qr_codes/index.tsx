import { Button, Drawer, Flex, Form, message, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { hostName } from 'src/app/services/api/const';
import {
  useGenerateQRMutation,
  useGetQrCodesMutation,
  useGetScansMutation,
} from 'src/app/services/users';
import { IQRRes, IScanRes } from 'src/app/services/users/type';
import { IBaseId } from 'src/app/type';
import { PlusIcon } from 'src/assets/icon';
import TableContent from 'src/components/cards/table_content';
import { DateFormItem, InputFormItem } from 'src/components/form';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';
import { scanColumns } from '../scans';

function QRCodes() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetQrCodesMutation();
  const [getScans, { isLoading: scanLoading }] = useGetScansMutation();
  const [data, setData] = useState<IQRRes[]>();
  const [detail, setDetail] = useState<IQRRes | null>();
  const [scans, setScans] = useState<IScanRes[]>();
  const [open, setOpen] = useState(false);

  const handleGetScans = (id: IBaseId) => {
    getScans('size=100000&qrCodeId=' + id)
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
  };

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
      width: 100,
      title: 'Skanerlar',
      dataIndex: '_id',
      key: '_id',
      fixed: 'right',
      render: (id, el) => (
        <Button
          onClick={() => {
            setDetail(el);
            handleGetScans(id);
          }}
          type="link"
          style={{ padding: '0 16px' }}
        >
          Ko'rish
        </Button>
      ),
    },
    {
      title: 'Fayli',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      width: 120,
      render: (val) => (
        <a href={`${hostName}/admin/qr-codes/${val}/download`} download>
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
    <>
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
          </>
        }
      />

      {/* Add new QR code */}
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

      {/* QR code scans */}
      <Drawer
        width={700}
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title + ' QR kod skanerlari'}
        placement="right"
        className="user-info-drawer"
      >
        <Table
          dataSource={scans}
          columns={[...scanColumns.slice(0, 2), scanColumns[4]]}
          bordered
          loading={scanLoading}
          scroll={{ x: 100, y: innerHeight - 173 }}
        />
      </Drawer>
    </>
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
    title: 'Boshlanish vaqti',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 180,
    align: 'center',
    render: (val) => dayjs(val).format('DD-MM-YYYY HH:mm:ss'),
  },
  {
    title: 'Tugash vaqti',
    dataIndex: 'validUntil',
    key: 'validUntil',
    width: 180,
    align: 'center',
    render: (val) => dayjs(val).format('DD-MM-YYYY HH:mm:ss'),
  },
  {
    title: 'Holati',
    dataIndex: 'isActive',
    key: 'isActive',
    width: 100,
    align: 'center',
    render: (val) => (
      <p style={{ color: val ? colors.blue : colors.red }}>
        {val ? 'Aktiv' : 'Aktiv emas'}
      </p>
    ),
  },
];
