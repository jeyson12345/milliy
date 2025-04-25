import { Flex, Spin, Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { useGetStatsQuery } from 'src/app/services/users';
import ContentTop from 'src/components/cards/content_top';
import { BarChart, PieChart } from './components/PieChart';
import './main.scss';
import { names } from 'src/utils';

function Statistics() {
  const { data, isLoading } = useGetStatsQuery();

  const formatter: StatisticProps['formatter'] = (value) => (
    // @ts-ignore
    <CountUp end={value as number} duration={5} separator=" " decimal="," />
  );

  return (
    <div style={{ width: '100%' }} className="statisticsPage">
      <ContentTop title="Statistika"></ContentTop>

      <Spin spinning={isLoading} size="large">
        {/* Top stats */}
        <div style={{ minHeight: '80vh' }}>
          <Flex style={{ marginTop: 16, padding: '0 24px' }} gap={16}>
            {Object.entries(data?.stats || {}).map(([key, value]) => (
              <Statistic
                key={key}
                title={names?.[key as keyof typeof names] || key}
                value={value}
                formatter={formatter}
                className="stat"
              />
            ))}
          </Flex>

          {data && (
            <>
              <h2 className="statTitle">
                Jinsi va yoshi bo'yicha umumiy statistika
              </h2>
              <Flex justify="center">
                <PieChart data={data?.demographics?.gender} />
                <PieChart data={data?.demographics?.ageGroups} />
              </Flex>
            </>
          )}

          {data && (
            <>
              <h2 className="statTitle">Kunlik umumiy statistika</h2>
              <Flex justify="center">
                <BarChart data={data?.dailyStats} />
              </Flex>
            </>
          )}
        </div>
      </Spin>
    </div>
  );
}

export default Statistics;
