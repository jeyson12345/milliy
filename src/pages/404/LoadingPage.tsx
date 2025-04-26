import { Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { colors } from 'src/constants/theme';

export const LoadingPage = () => {
  return (
    <Flex style={{ height: '95vh' }} justify="center" align="center">
      <LoadingOutlined style={{ color: colors.primary, fontSize: 64 }} />
    </Flex>
  );
};
