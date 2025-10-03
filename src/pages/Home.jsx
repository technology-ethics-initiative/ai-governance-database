import { useState } from "react";
import "chart.js/auto"; // for Chart.js to register its elements
import { Line } from "react-chartjs-2";
import styles from "./Home.module.css";
import { MinusIcon, PlusIcon, SearchIcon } from "../Components/Icons";
import PageTitle from "../Components/PageTitle";
import news from "../data/news";

export default function Home() {
  const [newsResults, setNewsResults] = useState([]);   // news articles resulting from search
  const [filterDrop, setFilterDrop] = useState(false);  // state (visible or hidden) of 'Advanced Search' menu
  const [showTitleB, setShowTitleB] = useState({
    And: false,
    Or: false,
  });  // state (visible or hidden) of 'titleInputB' search bar through whether 'and' 'or' buttons are selected
  const [showRegionB, setShowRegionB] = useState({
    And: false,
    Or: false,
  }); // state (visible or hidden) of 'regionInputB' search bar through whether 'and' 'or' buttons are selected

  /* Search Functionality */
  const searchTitle = (articles, searchTitle) => {  // search articles by title
    let results = articles.filter((article) => {
      let articleTitle = article.title ? article.title.toLowerCase() : "";
      return articleTitle.includes(searchTitle);
    });
    return results;
  };
  const filterRegion = (articles, searchRegion) => {  // filter search by region and sort by number of appearances/mentions
    if (searchRegion === "") {
      return articles;
    }

    let filteredResults = articles.filter((article) => {
      let articleRegions = JSON.stringify(article.region);
      return articleRegions && articleRegions.includes(searchRegion);
    });
        
    let sortedResults = filteredResults.sort((articleA, articleB) => {
      return articleB.region[searchRegion] - articleA.region[searchRegion];
    })
    return sortedResults;
  };
  const searchNews = (articles) => { // search and filter to get the final list of resulting news articles
    let titleA = document.getElementById("titleInputA").value.toLowerCase();
    let regionA = document.getElementById("regionInputA").value.toLowerCase();
    let resultArticles = searchTitle(articles, titleA);

    if (filterDrop) {
      let titleB = document.getElementById("titleInputB").value.toLowerCase();
      let regionB = document.getElementById("regionInputB").value.toLowerCase();
      if (showTitleB.And) {
        resultArticles = searchTitle(resultArticles, titleB);
      } else if (showTitleB.Or && titleB !== "") {
        resultArticles = resultArticles.concat(searchTitle(articles, titleB));
        let articlesSet = new Set([...resultArticles]);   // conversion to Set to remove duplicates
        resultArticles = [...articlesSet];
      }

      let filteredArticles = filterRegion(resultArticles, regionA);
      if (showRegionB.And) {
        filteredArticles = filterRegion(filteredArticles, regionB);
      } else if (showRegionB.Or && regionB !== "") {
        filteredArticles = filteredArticles.concat(filterRegion(resultArticles, regionB));
        let articlesSet = new Set([...filteredArticles]);   // conversion to Set to remove duplicates
        filteredArticles = [...articlesSet];
      }
      resultArticles = filteredArticles;  // back to results to converge into one variable name
    }

    let newDict = toDict(resultArticles);
    let newLabels = Object.keys(newDict);
    let newYear = newLabels[newLabels.length-1];
    setDataDict(newDict);
    setYearLabels(newLabels);
    setYear(newYear);
    setFilteredNews(newDict[newYear]);
    return resultArticles;
  };

  /* Graph Functionality */
  const toDict = (articles) => {  // convert news articles to a dictionary key-ed by year
    let articlesDict = {};  // law data processed as dictionary based on year
    for(let i = 0; i < articles.length; i++) {
      let article = articles[i];
      if (articlesDict[parseInt(article.date)]) {
        articlesDict[parseInt(article.date)].push(article);
      } else {
        articlesDict[parseInt(article.date)] = [article,];
      }
    }
    return articlesDict;
  }

  const [dataDict, setDataDict] = useState({});   // dictionary with data per year
  const [yearLabels, setYearLabels] = useState([]);  // list of years to display in timeline chart
  const [year, setYear] = useState(0);  // year selected (defualt: most recent year)
  const [filteredNews, setFilteredNews] = useState([]); // filtered list of laws to display

  const ratio = 100;  // ratio used in determining size of points
  const chartData = { // 1D data and labels for timeline component
    labels: yearLabels,
    datasets: [
      {
        data: yearLabels.map((x) => 0), // array of 0s to acheive a straight uniform graph
        fill: false,
        borderColor: "rgb(0, 0, 0)",  // (--cr-primary-black)
        pointHitRadius: 10,
        pointRadius: yearLabels.map((value) => {
          return 5 + (dataDict[value].length / ratio);
        }),
        hoverRadius: yearLabels.map((value) => {
          return 8 + (dataDict[value].length / ratio);
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
        }
      },
      y: {
        display: false,
        min: -0.5,
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
        setFilteredNews(dataDict[yearLabels[index]]);
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
      <PageTitle title="AI Governance Database @ SU | Home" />
      <div className={styles.pageContent}>
        <h1>Welcome to the AI Governance Database!</h1>
        <p>Search for concepts, companies, or regions.</p>
        <div className={styles.searchBox}>
          <div className={styles.searchBar}>
            <SearchIcon width="1.2em" height="1.2em" />
            <input id="titleInputA" type="search" placeholder={"Search" + (filterDrop ? " for a title" : "") + "..."} />
          </div>

        <div className={styles.advancedMenu + " " + (filterDrop ? styles.open : "")}>
          <div className={styles.spaceTogether}>
            <button id="titleAnd" className={showTitleB.And ? styles.active : ""}
                    onClick={() => setShowTitleB({And: !showTitleB.And, Or: false})}>And</button>
            <button id="titleOr" className={showTitleB.Or ? styles.active : ""}
                    onClick={() => setShowTitleB({And: false, Or: !showTitleB.Or})}>Or</button>
            <div className={styles.searchBar + " " + (showTitleB.And || showTitleB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="titleInputB" type="search" placeholder="Search for another title..." />
            </div>
          </div>
          <div className={styles.searchBar}>
            <SearchIcon width="1.2em" height="1.2em" />
            <input id="regionInputA" type="search" placeholder="Search for a region or country..." />
          </div>
          <div className={styles.spaceTogether}>
            <button id="regionAnd" className={showRegionB.And ? styles.active : ""}
                    onClick={() => setShowRegionB({And: !showRegionB.And, Or: false})}>And</button>
            <button id="regionOr" className={showRegionB.Or ? styles.active : ""}
                    onClick={() => setShowRegionB({And: false, Or: !showRegionB.Or})}>Or</button>
            <div className={styles.searchBar + " " + (showRegionB.And || showRegionB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="regionInputB" type="search" placeholder="Search for another region or country..." />
            </div>
          </div>
        </div>

          <button className={styles.searchButton} type='submit' onClick={() => setNewsResults(searchNews(news))}>Search</button>
          <button className={styles.menuButton} onClick={() => setFilterDrop(!filterDrop)}>
          { filterDrop ? (
            <MinusIcon height="1.2em" width="1.2em" />
          ) : (
            <PlusIcon height="1.2em" width="1.2em" />
          )}
          Advanced Search
        </button>
        </div>
        
        <section className={styles.chartContainer + " " + (newsResults ? "" : "hidden")}>
          <TimelineChart />
        </section>
        <div className={styles.newsContainer}>
          {filteredNews.map((article) => (
            <a className={styles.articleCard} key={article.uniqueID} href={article.proquest}>
              <b>Title: {article.title}</b>
              <p className={styles.spaceBetween}>
                <span>Author: {article.author}</span>
                <span>Date: {article.date}</span>
                <span>Publication: {article.publication}</span>
              </p>
              <p>Summary: {article.summary}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
