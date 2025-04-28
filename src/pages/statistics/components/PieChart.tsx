import { useEffect, useState } from 'react';
// import the core library.
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/pie';
import { DailyStat } from 'src/app/services/users/type';
import { names } from 'src/utils';

export const PieChart = ({ data }: { data: any }) => {
  const [list, setList] = useState<{ value: number; name: string }[]>([]);

  const options = {
    grid: { top: 20, right: 40, bottom: 20, left: 40 },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      top: 'start',
    },
    series: [
      {
        data: list,
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (data) {
      setList(
        Object.entries(data).map(([key, value]) => ({
          value: Number(value),
          name: names?.[key as keyof typeof names] || key,
        }))
      );
    }
  }, [data]);

  return (
    <>
      <ReactEcharts
        option={options}
        style={{ width: '600px', height: '270px' }}
      ></ReactEcharts>
    </>
  );
};

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
        barWidth: '20%',
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
      style={{ width: '100%', height: '300px' }}
    ></ReactEcharts>
  );
};
