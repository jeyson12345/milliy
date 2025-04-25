import { Form, Select } from 'antd';
import { useGetRegionsQuery } from 'src/app/services/users';
import useParamsHook from 'src/hooks/params';

function FilterRegion() {
  const { searchParams, handleMakeParams } = useParamsHook();

  //Get data
  const { data } = useGetRegionsQuery();

  return (
    <Form.Item name="city" label="Viloyat">
      <Select
        options={data?.map((el) => {
          return {
            label: el.name,
            value: el.name,
          };
        })}
        placeholder="Viloyatni tanlang"
        style={{ width: 200 }}
        allowClear
        onChange={(val) => {
          handleMakeParams('city', val);
          handleMakeParams('region', '');
        }}
        defaultValue={searchParams.get('city')}
        value={searchParams.get('city')}
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

export default FilterRegion;
