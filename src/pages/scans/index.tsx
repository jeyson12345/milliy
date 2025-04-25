import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetScansMutation } from 'src/app/services/users';
import { IScanRes } from 'src/app/services/users/type';
import TableContent from 'src/components/cards/table_content';
import FilterRangePicker from 'src/components/filter/range_picker';
import useParamsHook from 'src/hooks/params';

function Scans() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetScansMutation();
  const [data, setData] = useState<IScanRes[]>();

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
      title="Skanerlar"
      total={allData?.pagination?.total}
      dataSource={data}
      columns={columns}
      loading={isLoading}
      filters={
        <>
          <FilterRangePicker />
        </>
      }
    />
  );
}

export default Scans;

export const columns: ColumnsType<IScanRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Foydalanuvchi',
    dataIndex: 'userId',
    key: 'userId',
    render: (val) =>
      (val?.firstName || '') +
      ' ' +
      (val?.surname || '') +
      '' +
      (val?.secondName || ''),
  },
  {
    title: 'QR-kod nomi',
    dataIndex: 'qrCodeId',
    key: 'qrCodeId',
    // colSpan: 2,
    render: (val) => val?.title,
  },
  {
    title: 'QR-kod kodi',
    dataIndex: 'qrCodeId',
    key: 'qrCodeId',
    // colSpan: 0,
    render: (val) => val?.code,
  },
  {
    title: 'Skanerlash vaqti',
    dataIndex: 'scannedAt',
    key: 'scannedAt',
    width: 140,
    render: (val) => (val ? new Date(val).toLocaleDateString('uz-UZ') : ''),
  },
];
