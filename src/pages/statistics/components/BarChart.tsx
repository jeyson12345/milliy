import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/pie';
import { useEffect, useState } from 'react';
import { DailyStat } from 'src/app/services/users/type';

export const BarChart = ({ data }: { data: DailyStat[] | undefined }) => {
  const [list, setList] = useState<number[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const options = {
    grid: { top: 20, right: 40, bottom: 20, left: 60 },
    xAxis: {
      type: 'category',
      data: names,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Soni: ',
        data: list,
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  useEffect(() => {
    if (data) {
      setList(data?.map((item) => item.count) || []);
      setNames(data?.map((item) => item._id) || []);
    }
  }, [data]);

  return (
    <ReactEcharts
      option={options}
      style={{ width: '95%', height: '300px' }}
    ></ReactEcharts>
  );
};
