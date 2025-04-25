import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import {
  useGetDistrictsQuery,
  useGetRegionsQuery,
} from 'src/app/services/users';
import useParamsHook from 'src/hooks/params';

function FilterDistrict() {
  const { searchParams, handleMakeParams } = useParamsHook();
  const region = searchParams.get('city');
  const district = searchParams.get('region');

  useEffect(() => {
    if (!district) setValue(null);
  }, [district]);

  //Get data
  const { data: regions } = useGetRegionsQuery();
  const regionId = regions?.find((el) => el.name === region)?.id;

  const { data } = useGetDistrictsQuery(regionId, { skip: !regionId });

  const [value, setValue] = useState<string | null>(searchParams.get('region'));

  return (
    <Form.Item name="region" label="Tuman">
      <Select
        options={data?.map((el) => {
          return {
            label: el.name,
            value: el.name,
          };
        })}
        placeholder="Tumanni tanlang"
        style={{ width: 200 }}
        allowClear
        onChange={(val) => {
          handleMakeParams('region', val);
        }}
        defaultValue={value}
        value={value}
        showSearch
        optionFilterProp="label"
        filterOption={(input: any, option: any) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA: any, optionB: any) =>
          optionA.label
            ?.toLowerCase()
            .localeCompare(optionB.label.toLowerCase())
        }
      />
    </Form.Item>
  );
}

export default FilterDistrict;
