import { Col, Form, FormItemProps, Radio, RadioGroupProps } from 'antd';
import '../form_item.scss';
import { IBaseOption } from 'src/app/type';
import { baseFormItemCol } from 'src/constants/form';

type CombinedType = FormItemProps & RadioGroupProps;

export interface RadioGroupFormItemProps extends CombinedType {
  col?: number;
  message?: string;
  options?: IBaseOption[];
}

function RadioGroupFormItem({
  col = baseFormItemCol,
  name,
  label,
  message,
  options,
  ...rest
}: RadioGroupFormItemProps) {
  return (
    <Col span={col}>
      <Form.Item
        name={name}
        label={label}
        rules={!!message ? [{ required: true, message }] : []}
      >
        <Radio.Group {...rest}>
          {options?.map((item, index) => {
            return (
              <Radio.Button
                value={item.value}
                key={index + item.value.toString()}
              >
                {item.label}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </Form.Item>
    </Col>
  );
}

export default RadioGroupFormItem;
