const colorArr = [
  '#5B7BE5',
  '#F76565',
  '#666081',
  '#5DB578',
  '#B7C331',
  '#D3709A',
  '#DD983A',
  '#9B9EDE',
  '#75AEBC',
  '#E3C939',
  '#816060',

  '#5B7BE5',
  '#F76565',
  '#666081',
  '#5DB578',
  '#B7C331',
  '#D3709A',
  '#DD983A',
  '#9B9EDE',
  '#75AEBC',
  '#E3C939',
  '#816060',

  '#5B7BE5',
  '#F76565',
  '#666081',
  '#5DB578',
  '#B7C331',
  '#D3709A',
  '#DD983A',
  '#9B9EDE',
  '#75AEBC',
  '#E3C939',
  '#816060',

  '#5B7BE5',
  '#F76565',
  '#666081',
  '#5DB578',
  '#B7C331',
  '#D3709A',
  '#DD983A',
  '#9B9EDE',
  '#75AEBC',
  '#E3C939',
  '#816060',
];

function formatChartData(source, type) {
  const { seriesList, eventList } = source;
  const chartData = {
    xAxisData: seriesList,
    seriesData: [],
  };

  eventList.forEach((item, eIndex) => {
    const {
      name, amount,
      // total
    } = item;

    switch (type) {
      case 'line':
        chartData.seriesData.push({
          name,
          type: type,
          symbol: 'circle',
          smooth: true,
          // data: (typeof value === 'string') ? JSON.parse(value) : value,
          data: amount,
          color: colorArr[eIndex]
        });
        break;
      case 'pie':
        break;
      case 'bar':

        chartData.seriesData.push({
          name,
          type: type,
          data: amount,
          stack: '总数',
          color: colorArr[eIndex]
        });
        break;
      default:
        break;
    }
  });

  return chartData;
}

export function getBarChart(chartData) {
  const formatData = formatChartData(chartData, 'bar');
  console.log(formatData);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      // data: ['2014', '2015', '2016', '2017', '2018', '2019'],
      data: formatData.xAxisData,
      axisLine:{
        lineStyle:{
          color:'#8FA3B7',//y轴颜色
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#6D6D6D',
        }
      },
      axisTick: {show: false}
    }],
    yAxis: [{
      type: 'value',
      splitLine:{show: false},
      //max: 700,
      splitNumber: 3,
      axisTick: {show: false},
      axisLine:{
        lineStyle:{
          color:'#8FA3B7',//y轴颜色
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#6D6D6D',
        }
      },
    }],
    series: formatData.seriesData

  };
  return option;
}

export function getLineChart(chartData) {
  const formatData = formatChartData(chartData, 'line');

  const option = {
    color: ['#D53A35'],
    tooltip: {
      trigger: 'axis',
      //formatter: "{b} <br> 合格率: {c}%"
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: '',
      boundaryGap: false,
      axisLine:{
        show:false,
        lineStyle:{
          color:'#525252'
        }
      },
      axisTick:{
        show:false
      },
      axisLabel:{
        color:'#525252'
      },
      // data: ['01', '02', '03', '04', '05', '06', '07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
      data: formatData.xAxisData
    },
    yAxis: {
      type: 'value',
      name: '',
      axisLine:{
        show:false,
      },
      axisTick:{
        show:false
      },
      axisLabel:{
        color:'#525252'
      },
      splitLine:{
        lineStyle:{
          type:'dotted',
          color:'#AAA'//F3F3F3
        }
      }
    },
    series: formatData.seriesData
    // series: [
    //   {
    //     name: 'a',
    //     type: 'line',
    //     symbol: 'circle',
    //     smooth: true,
    //     data: [100,120, 132, 101, 134, 90, 230, 210,80,20,90,210,200,100,120, 132, 101, 134, 90, 230, 210,80,20,90]
    //   },
    // ]
  };
  return option;
}

export function getPieChart(chartData, pie) {
  const option = {
    title: {
      text: '',
      subtext: pie.name,
      left: 'center',
      bottom: '5%',
      textAlign: 'center'
    },
    color: colorArr,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      // containLabel: true
    },
    series: [{
      // name: chartData.seriesList[pieNum],
      type: 'pie',
      radius: ['20%', '40%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        normal: {
          borderColor: '#FFFFFF',
          borderWidth: 2
        }
      },
      data: chartData[pie.event].map((data, s) => {
        return {
          name: `${chartData.seriesList[s]},${data.name}`,
          value: data.total
        }
      })
    }]
  };
  return option;
}
