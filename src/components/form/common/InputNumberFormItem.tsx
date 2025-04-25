import { Col, Form, FormItemProps, InputNumber, InputNumberProps } from 'antd';
import {
  amountFormatter,
  amountParser,
  baseFormItemCol,
} from 'src/constants/form';

type CombinedType = FormItemProps & InputNumberProps;

export interface InputNumberFormItemProps extends CombinedType {
  col?: number;
  message?: string;
}

function InputNumberFormItem({
  col = baseFormItemCol,
  name = 'amount',
  label = `Miqdor`,
  message = 'Miqdorni kiriting!',
  ...rest
}: InputNumberFormItemProps) {
  return (
    <Col span={col}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: !!message, message }]}
      >
        <InputNumber
          formatter={amountFormatter}
          parser={amountParser}
          style={{ width: '100%' }}
          name={name}
          {...rest}
        />
      </Form.Item>
    </Col>
  );
}

export default InputNumberFormItem;
