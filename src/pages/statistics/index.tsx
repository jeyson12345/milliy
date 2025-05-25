import { Flex, Spin, Statistic, StatisticProps, Table } from 'antd';
import {
  Category2,
  Firstline,
  Link,
  Profile2User,
  StatusUp,
} from 'iconsax-react';
import CountUp from 'react-countup';
import { useGetStatsQuery } from 'src/app/services/users';
import ContentTop from 'src/components/cards/content_top';
import { colors } from 'src/constants/theme';
import { names, prettierNumber } from 'src/utils';
import StatisticsCard from './components/CardBox';
import { BarChart, PieChart } from './components/PieChart';
import './statistics.scss';

function Statistics() {
  const { data, isLoading } = useGetStatsQuery();

  const formatter: StatisticProps['formatter'] = (value) => (
    // @ts-ignore
    <CountUp end={value as number} duration={5} separator=" " decimal="," />
  );

  return (
    <div className="statistics">
      <ContentTop title="Statistika"></ContentTop>

      <Spin spinning={isLoading} size="large">
        {/* Top stats */}
        <div className="statistics-content">
          <Flex style={{ marginBottom: 24 }} gap={16}>
            {Object.entries(data?.stats || {}).map(([key, value], index) =>
              key === 'activeUsers' ? undefined : (
                <Statistic
                  key={key}
                  title={names?.[key as keyof typeof names] || key}
                  value={value}
                  formatter={formatter}
                  suffix={<div className="stat-icon">{statIcons[index]}</div>}
                  className="stat"
                />
              )
            )}
          </Flex>

          <Flex justify="space-between" wrap="wrap" gap={24}>
            <StatisticsCard title="Jinsi bo'yicha foydalanuvchilar">
              <PieChart data={data?.demographics?.gender} />
            </StatisticsCard>
            <StatisticsCard title="Yoshi bo'yicha foydalanuvchilar">
              <PieChart data={data?.demographics?.ageGroups} />
            </StatisticsCard>
            <StatisticsCard title="Kunlar bo'yicha skanerlar" fullWidth>
              <BarChart data={data?.dailyStats} />
            </StatisticsCard>
            <StatisticsCard
              title="Viloyatlari bo'yicha foydalanuvchilar"
              fullWidth
            >
              <Table
                columns={regionsColumns}
                dataSource={
                  data?.demographics?.cities
                    ? formatRegionData(data?.demographics?.cities)
                    : []
                }
                rowKey="city"
                pagination={false}
              />
            </StatisticsCard>
          </Flex>
        </div>
      </Spin>
    </div>
  );
}

export default Statistics;

const formatRegionData = (cities: Object) => {
  const cityEntries = Object.entries(cities); // Convert the object to an array of [region, users] pairs
  const totalUsers = cityEntries.reduce(
    (sum, [region, users]) => sum + users,
    0
  ); // Calculate total users

  return cityEntries.map(([region, users]) => {
    const percentage = ((users / totalUsers) * 100).toFixed(2) + '%'; // Calculate percentage

    return {
      region: region === 'unknown' ? 'Aniq emas' : region, // Область
      users: users, // Пользователи
      percentage: percentage, // Процент от общего
      key: region, // Unique key for each row
    };
  });
};

const statIcons = [
  <Profile2User size="24" color={colors.white} />,
  <StatusUp size="24" color={colors.white} />,
  <Category2 size="24" color={colors.white} />,
  <Firstline size="24" color={colors.white} />,
  <Link size="28" color={colors.white} />,
  <Link size="24" color={colors.white} />,
];

const regionsColumns = [
  {
    title: 'Viloyat',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Foydalanuvchilar',
    dataIndex: 'users',
    key: 'users',
    render: (val: number) => prettierNumber(val, ' '),
  },
  {
    title: 'Foizda (%)',
    dataIndex: 'percentage',
    key: 'percentage',
  },
];
