//import fs from 'fs'
import { useState } from "react";
import "chart.js/auto"; // for Chart.js to register its elements
import { Line } from "react-chartjs-2";
import styles from "./Legend.module.css";

function TimelineChart(dataDict, handleYearChange) {
  let yearLabels = Object.keys(dataDict);  // list of years to display in timeline chart

  const [year, setYear] = useState(yearLabels[yearLabels.length-1]);  // year selected (defualt: most recent year)

  const ratio = data.length / 10;  // ratio used in determining size of points
  const chartData = { // 1D data and labels for timeline component
    labels: yearLabels,
    datasets: [
      {
        data: yearLabels.map((x) => 0), // array of 0s to acheive a straight uniform graph
        fill: false,
        borderColor: "rgb(0, 0, 0)",  // (--cr-primary-black)
        pointHitRadius: 10,
        pointRadius: yearLabels.map((value) => {
          return 5 + (lawsDict[value].length / ratio);
        }),
        hoverRadius: yearLabels.map((value) => {
          return 8 + (lawsDict[value].length / ratio);
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
        /*title: {
          display: true,
          text: "Year",
        },*/
        grid: {
          display: false,
        },
        border: {
          display: false,
        }
      },
      y: {
        display: false,
        min: -0.3,
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
        enabled: false,
      }
    },
    maintainAspectRatio: false,
    onClick: function(event, elements) {
      let index = elements[0].index;
      if (yearLabels[index]) {
        setYear(yearLabels[index]);
        handleYearChange(yearLabels[index]);
        setFilteredLaws(lawsDict[yearLabels[index]]);
      }
    },
  };

  return (
    <>
      <section className={styles.chartContainer}>
        <Line id="timeline" data={chartData} options={chartOptions} />
      </section>
    </>
  );
}

export default TimelineChart;
