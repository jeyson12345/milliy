import { Col, DatePicker, DatePickerProps, Form, FormItemProps } from 'antd';
import { baseFormItemCol } from 'src/constants/form';

type DateFormItemProps = DatePickerProps &
  FormItemProps & {
    col?: number;
    message?: string;
    format?: 'date' | 'month' | 'year';
  };

function DateFormItem({
  col = baseFormItemCol,
  name = 'date',
  label = 'Sana',
  message = 'Sanani tanlang!',
  format = 'date',
  ...rest
}: DateFormItemProps) {
  return (
    <Col span={col}>
      <Form.Item
        name={name}
        label={label}
        rules={!!message ? [{ required: true, message }] : []}
      >
        <DatePicker picker={format} style={{ width: '100%' }} {...rest} />
      </Form.Item>
    </Col>
  );
}

export default DateFormItem;
