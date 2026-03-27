import "chart.js/auto"; // for Chart.js to register its elements
import { useState } from "react";
import { Line, Scatter } from "react-chartjs-2";
import styles from './TimelineChart.module.css';

const TimelineChart = (chartProps) => {
  const { data, clickHandle } = chartProps;
  const { yearLabels, dataDict, year } = data;
  const [mobile, setMobile] = useState(window.innerWidth < 800);
  //console.log(dataDict);  // !!! DELETE FOR FINAL !!!

  let max = 1;  // greatest number of articles for a year; used in determining size of points
  if (yearLabels.length > 0) {
    for(let i = 0; i < yearLabels.length; i++) {
      if(yearLabels[i] != "All" && dataDict[yearLabels[i]].length > max) {
        max = dataDict[yearLabels[i]].length
      }
    }
  }

  let chartData = {   // 1D data and labels for timeline component
    labels: yearLabels,
    datasets: [
      {
        data: yearLabels.map((x) => 0), // array of 0s to acheive a straight uniform graph
        fill: false,
        borderColor: "#003747",  // (--cr-primary-black)
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
          return value == year ? "#9ef7ff" : "#003747"; // (--cr-shaded-main) : (--cr-dark-main)
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

  function getDataSlice(start, end) {
    let originalDataset = chartData.datasets[0]  
    let slicedDatasets = {}
    slicedDatasets.data = originalDataset.data.slice(start, end);
    slicedDatasets.fill = originalDataset.fill;
    slicedDatasets.borderColor = originalDataset.borderColor;
    slicedDatasets.pointHitRadius = originalDataset.pointHitRadius;
    slicedDatasets.pointRadius = originalDataset.pointRadius.slice(start, end);
    slicedDatasets.hoverRadius = originalDataset.hoverRadius.slice(start, end);
    slicedDatasets.pointBackgroundColor = originalDataset.pointBackgroundColor.slice(start, end);

    let dataSlice = {};
    dataSlice.labels = chartData.labels.slice(start, end);
    dataSlice.datasets = [slicedDatasets]
    return dataSlice;
  }

  let slicedData = []
  if (mobile) {
    let c = 0;
    while(c < yearLabels.length-1) {   // display 10 points at a time for mobile
      let endI = ((c+10 < yearLabels.length-1) ? c+10 : yearLabels.length-1)
      slicedData.push(getDataSlice(c, endI))
      c += 10;
    }
  }

  // when the window resizes, change slicedData accordingly
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      setMobile(false);
    } else {
      setMobile(true)
    }
  });

  return (
    <>
      {mobile ? (
        slicedData.map((data, i) => (
          <div key={"timeline" + i} className={styles.chart}>
            <Line data={data} options={chartOptions} />
          </div>
        ))
      ) : (
        <div className={styles.chart}>
          <Line id="timeline" data={chartData} options={chartOptions} />
        </div>
      )}
    </>
  );
};

export default TimelineChart;
