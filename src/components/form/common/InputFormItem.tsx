import { Col, Form, FormItemProps, Input, InputProps } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
import { OTPProps } from 'antd/es/input/OTP';
import { baseFormItemCol } from 'src/constants/form';
import '../form_item.scss';

type CombinedType = FormItemProps &
  InputProps &
  OTPProps &
  Partial<MaskedInputProps>;

export interface InputFormItemProps extends CombinedType {
  col?: number;
  message?: string;
  textarea?: boolean;
  row?: number;
  password?: boolean;
  otp?: boolean;
  required?: boolean;
}

function InputFormItem({
  col = baseFormItemCol,
  name,
  label,
  message,
  mask,
  textarea,
  password,
  otp,
  row = 2,
  required,
  ...rest
}: InputFormItemProps) {
  return (
    <Col span={col}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: !!message, message }]}
      >
        {password ? (
          <Input.Password {...rest} />
        ) : otp ? (
          <div className="form-item-input-otp">
            <Input.OTP {...rest} length={5} />
          </div>
        ) : textarea ? (
          <Input.TextArea rows={row} placeholder={rest.placeholder} />
        ) : mask ? (
          <MaskedInput mask={mask} {...rest} className="form-item-input-mask" />
        ) : (
          <Input {...rest} />
        )}
      </Form.Item>
    </Col>
  );
}

export default InputFormItem;
