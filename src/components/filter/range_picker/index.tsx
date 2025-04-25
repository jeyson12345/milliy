import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { dateFormat } from 'src/constants/form';
import useParamsHook from 'src/hooks/params';

const { RangePicker } = DatePicker;

function FilterRangePicker() {
  const { searchParams, handleMakeParams } = useParamsHook();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  return (
    <Form.Item name="date_interval" label="Vaqt intervali">
      <RangePicker
        defaultValue={
          startDate && endDate
            ? [dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]
            : undefined
        }
        onChange={(dates) => {
          if (!dates) {
            handleMakeParams('startDate', '');
            handleMakeParams('endDate', '');
            return;
          }
          handleMakeParams('startDate', dates[0]?.format(dateFormat) || '');
          handleMakeParams('endDate', dates[1]?.format(dateFormat) || '');
        }}
      />
    </Form.Item>
  );
}

export default FilterRangePicker;
