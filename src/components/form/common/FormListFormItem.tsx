import { Col, Form, Row } from 'antd';
import { AddCircle, MinusCirlce } from 'iconsax-react';
import { baseFormItemCol, formGutter } from 'src/constants/form';
import { colors } from 'src/constants/theme';
import InputFormItem, { InputFormItemProps } from './InputFormItem';

export interface FormListFormItemProps extends InputFormItemProps {
  col?: number;
  message?: string;
}

function FormListFormItem({
  col = baseFormItemCol,
  name = 'additional_details',
  label = `Additional Details`,
  required,
  ...rest
}: FormListFormItemProps) {
  return (
    <Col span={24}>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Row
                key={key}
                gutter={formGutter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 8.3,
                }}
              >
                <InputFormItem
                  required={index === 0 ? required : false}
                  label={index === 0 ? label : ''}
                  name={name}
                  col={22}
                  {...restField}
                  {...rest}
                />

                <div style={{ marginBottom: index === 0 ? -7 : 24 }}>
                  {fields.length - 1 === index ? (
                    <AddCircle
                      onClick={() => add()}
                      size="32"
                      color={colors.primary}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  ) : (
                    <MinusCirlce
                      style={{ cursor: 'pointer' }}
                      size="32"
                      color={colors.red}
                      onClick={() => remove(name)}
                    />
                  )}
                </div>
              </Row>
            ))}
          </>
        )}
      </Form.List>
    </Col>
  );
}

export default FormListFormItem;
