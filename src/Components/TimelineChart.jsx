import "chart.js/auto"; // for Chart.js to register its elements
import { Line } from "react-chartjs-2";

const TimelineChart = (chartProps) => {
  const { data, clickHandle } = chartProps;
  const { yearLabels, dataDict, year } = data;
  console.log(dataDict);  // !!! DELETE FOR FINAL !!!

  let max = 1;  // greatest number of articles for a year; used in determining size of points
  if (yearLabels.length > 0) {
    for(let i = 0; i < yearLabels.length; i++) {
      if(yearLabels[i] != "All" && dataDict[yearLabels[i]].length > max) {
        max = dataDict[yearLabels[i]].length
      }
    }
  }

  const chartData = { // 1D data and labels for timeline component
    labels: yearLabels,
    datasets: [
      {
        data: yearLabels.map((x) => 0), // array of 0s to acheive a straight uniform graph
        fill: false,
        borderColor: "rgb(0, 0, 0)",  // (--cr-primary-black)
        pointHitRadius: 10,
        pointRadius: yearLabels.map((value) => {
          if(value == "All") { return 15; }
          return 5 + ((dataDict[value].length/max) * 10);
        }),
        hoverRadius: yearLabels.map((value) => {
          if(value == "All") { return 18; }
          return 8 + ((dataDict[value].length/max) * 10);
        }),
        pointBackgroundColor: yearLabels.map((value => {
          return value == year ? "rgb(174, 174, 174)" : "rgb(0, 0, 0)"; // (--cr-bg-secondary) : (--cr-text-primary)
        }))

      },
    ],
  };

  const chartOptions = { // chart options for timeline component
    scales: {
      x: {
        position: "bottom",
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          minRotation: 0,
          maxRotation: 0,
        }
      },
      y: {
        display: false,
        min: -1,
        max: 1,
        grid: {
          display: false,
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function(tooltipItems, data) { 
            let label = yearLabels[tooltipItems.dataIndex];
            return dataDict[label].length + " articles";
          },
          labelColor: function(context) {
            return undefined;
          }
        },
      },
    },
    maintainAspectRatio: false,
    onClick: clickHandle,
  };

  return (
    <>
      <Line id="timeline" data={chartData} options={chartOptions} />
    </>
  );
};

export default TimelineChart;
