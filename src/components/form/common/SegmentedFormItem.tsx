import { Col, Form, FormItemProps, Segmented, SegmentedProps } from 'antd';
import '../form_item.scss';
import { baseFormItemCol } from 'src/constants/form';

type CombinedType = FormItemProps & SegmentedProps;

export interface SegmentedFormItemProps extends CombinedType {
  col?: number;
  message?: string;
}

function SegmentedFormItem({
  col = baseFormItemCol,
  name,
  label,
  message,
  ref,
  ...rest
}: SegmentedFormItemProps) {
  return (
    <Col span={col}>
      <Form.Item
        name={name}
        label={label}
        rules={!!message ? [{ required: true, message }] : []}
      >
        <Segmented {...rest} />
      </Form.Item>
    </Col>
  );
}

export default SegmentedFormItem;
