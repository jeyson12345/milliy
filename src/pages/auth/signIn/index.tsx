import { Button, Form, message, Spin } from 'antd';
import { useLoginMutation } from 'src/app/services/users';
import { ILogin } from 'src/app/services/users/type';
import { InputFormItem } from 'src/components/form';

function SignIn() {
  const [form] = Form.useForm();
  const [loginPassword, { isLoading }] = useLoginMutation();

  const onFinish = (val: ILogin) => {
    loginPassword(val)
      .unwrap()
      .catch(() => {
        message.error('Email yoki parol xato!');
      });
  };

  return (
    <div className="auth_layout__form">
      <h2>Xush kelibsiz</h2>
      <p>Davom etish uchun tizimga kiring</p>
      <div>
        <Spin spinning={isLoading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <InputFormItem
              size="large"
              name="username"
              label="Foydalanuvchi nomi"
              message="Foydalanuvchi nomini kiriting!"
            />

            <InputFormItem
              password
              size="large"
              name="password"
              label="Foydalanuvchi paroli"
              message="Foydalanuvchi parolini kiriting!"
            />

            {/* <Checkbox style={{ marginBottom: 36 }}>Remember me</Checkbox> */}
            <br />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ height: 44, width: '100%' }}
              >
                Tizimga kirish
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}

export default SignIn;
