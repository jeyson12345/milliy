import { Flex, Spin, Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { useGetStatsQuery } from 'src/app/services/users';
import ContentTop from 'src/components/cards/content_top';
import { PieChart } from './components/PieChart';

const { innerHeight } = window;

function Statistics() {
  const { data, isLoading } = useGetStatsQuery();

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} duration={5} separator=" " decimal="," />
  );

  return (
    <div style={{ width: '100%' }}>
      <ContentTop title="Statistika"></ContentTop>

      <Spin spinning={isLoading} size="large">
        {/* Top stats */}
        <Flex style={{ marginTop: 16 }}>
          {Object.entries(data?.stats || {}).map(([key, value]) => (
            <Flex
              justify="center"
              style={{ flexGrow: 1, textAlign: 'center' }}
              key={key}
            >
              <Statistic title={key} value={value} formatter={formatter} />
            </Flex>
          ))}
        </Flex>

        <Flex justify="center" gap={64} style={{ marginTop: 64 }}>
          <PieChart data={data?.demographics?.gender} />
          <PieChart data={data?.demographics?.ageGroups} />
        </Flex>
      </Spin>
    </div>
  );
}

export default Statistics;
