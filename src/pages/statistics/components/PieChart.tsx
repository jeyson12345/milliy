import { useEffect, useState } from 'react';
// import the core library.
import 'echarts/lib/chart/pie';
import ReactEcharts from 'echarts-for-react';

interface IPieChart {
  data: { [key: string]: number }[];
}

export const PieChart = ({ data }: { data: IPieChart }) => {
  const [list, setList] = useState<number[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const options = {
    grid: { top: 20, right: 40, bottom: 20, left: 40 },
    xAxis: {
      type: 'category',
      data: names,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
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
      setList(Object.values(data));
      setNames(Object.keys(data));
    }
  }, [data]);

  return (
    // <ReactApexChart
    //   options={{
    //     chart: {
    //       type: 'pie',
    //     },
    //     labels: names,
    //     legend: {
    //       show: false,
    //     },
    //   }}
    //   series={list}
    //   type="pie"
    //   width={420}
    // />
    <ReactEcharts
      option={options}
      style={{ width: '600px', height: '300px' }}
    ></ReactEcharts>
  );
};
