import { phoneMask } from 'src/constants/form';
import InputFormItem, { InputFormItemProps } from '../common/InputFormItem';

interface Props extends InputFormItemProps {}

export default function PhoneFormItem({ mask, ...rest }: Props) {
  return (
    <InputFormItem
      name="phone"
      label="Telefon raqam"
      message="Telefon raqamni kiriting"
      mask={mask || phoneMask}
      addonBefore="+998"
      {...rest}
    />
  );
}
