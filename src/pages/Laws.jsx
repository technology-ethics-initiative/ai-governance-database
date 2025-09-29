import { useState } from "react";
import { useParams } from "react-router-dom";
import "chart.js/auto"; // for Chart.js to register its elements
import { Line } from "react-chartjs-2";
import nationalLaws from "../data/national-laws-and-policies.json";
import styles from "./Laws.module.css";

function Laws() {
    let { option } = useParams(); // scope option of laws, to determine appropriate dataset
    const label = option == "international" ? "International" :
                  option == "states" ? "U.S. States" : "National";  // label fitting scope option
    const data = option == "international" ? [] :
                  option == "states" ? [] : nationalLaws;  // data according to scope option

    let lawsDict = {};  // law data processed as dictionary based on year
    for(let i = 0; i < data.length; i++) {
      let law = data[i];
      if (lawsDict[parseInt(law.year)]) {
        lawsDict[parseInt(law.year)].push(law);
      } else {
        lawsDict[parseInt(law.year)] = [law,];
      }
    }
    let yearLabels = Object.keys(lawsDict);  // list of years to display in timeline chart

    const [year, setYear] = useState(yearLabels[yearLabels.length-1]);  // year selected (defualt: most recent year)
    const [filteredLaws, setFilteredLaws] = useState(lawsDict[year]); // filtered list of laws to display

    const ratio = 2;  // ratio used in determining size of points
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
          title: {
            display: true,
            text: "Year",
          },
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
          setFilteredLaws(lawsDict[yearLabels[index]]);
        }
      },
    };
    const TimelineChart = () => {  // timeline chart component
      return (
          <Line id="timeline" data={chartData} options={chartOptions} />
      );
    };

    return (
      <>
        <div className={styles.pageContent}>
          <h2>{label} Laws</h2>
          <section className={styles.chartContainer}>
            <TimelineChart />
          </section>
          <section> 
            <h4>Laws passed in {year}</h4>
            <div className={styles.cardContainer}>
              {filteredLaws.map((law, index) => (
              <article key={index} className={styles.dataCard}>
                <b>Name: {law.name}</b>
                <p>Country: {law.country}</p>
                <p>Year: {law.year}</p>
                <p>Stage: {law.stage}</p>
                <p>Relevance to AI: {law.relevance}</p>
              </article>
            ))}
            </div>
          </section>
        </div>
      </>
    );
}

export default Laws;