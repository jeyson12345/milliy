import { Button, Flex, Form, message, Modal, Spin } from 'antd';
import {
  useSendMessageToAllMutation,
  useSendMessageToUserMutation,
} from 'src/app/services/users';
import { InputFormItem } from 'src/components/form';

interface IAddMessageProps {
  open: boolean;
  userId?: string;
  setOpen: (open: boolean) => void;
  callBack?: () => void;
}

export const AddMessage = ({
  userId,
  open,
  setOpen,
  callBack,
}: IAddMessageProps) => {
  const [form] = Form.useForm();

  const [sendAll, { isLoading: AllLoading }] = useSendMessageToAllMutation();
  const [sendUser, { isLoading: UserLoading }] = useSendMessageToUserMutation();

  const onFinish = async (val: any) => {
    if (userId) {
      await sendUser({ ...val, userId })
        .unwrap()
        .then(() => {
          setOpen(false);
          message.success('Muvofaqqiyatli yuborildi');
        });
    } else {
      await sendAll(val)
        .unwrap()
        .then(() => {
          setOpen(false);
          message.success('Muvofaqqiyatli yuborildi');
        });
    }

    callBack?.();
    form.resetFields();
  };
  return (
    <Modal
      open={open}
      footer={null}
      title="Barchaga xabar yuborish"
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
    >
      <Spin spinning={AllLoading || UserLoading}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <InputFormItem
            row={4}
            textarea
            name="message"
            label="Xabar"
            message="Ilitmos xabarni kiriting !"
          />

          <Flex justify="end">
            <Button type="primary" htmlType="submit" size="large">
              Yuborish
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
