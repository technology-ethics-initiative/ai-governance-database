import { useState } from "react";
import styles from "./SearchContent.module.css";
import { MinusIcon, PlusIcon, SearchIcon } from "../Components/Icons";
import TimelineChart from "../Components/TimelineChart";

export default function SearchContent(searchProps) {
  const { news } = searchProps;
  const [newsResults, setNewsResults] = useState(news);   // news articles resulting from search
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
  function mergeArray(arrayA, arrayB) {
    let mergedArray = new Set([...arrayA.concat(arrayB)]);  // conversion to Set to remove duplicates
    return [...mergedArray];
  }

  function filterTitle(articles, term) {  // filters articles by title using the given term
    return articles.filter((article) => {
      let articleTitle = article.title ? article.title.toLowerCase() : "";
      return articleTitle.includes(term);
    })
  }

  function filterRegion(articles, term) { // filters articles by region using the given term
    return articles.filter((article) => {
      let articleRegions = JSON.stringify(article.region);
      return articleRegions && articleRegions.includes(term);
    });
  }

  function getNextIndex(input) {  // helper function to searchInput; retrieves next index of "|" or "&"
    let indexOr = input.indexOf("|");
    let indexAnd = input.indexOf("&");

    if (indexOr < 0 && indexAnd < 0) { return -1; }
    else if (indexOr < 0) { return indexAnd; }
    else if (indexAnd < 0) { return indexOr; }
    else { return indexOr < indexAnd ? indexOr : indexAnd; }
  }

  function searchInput(articles, input, filterFunc) { // search by particular field using given input
    input = input.replace("AND", "&").replace("OR", "|").toLowerCase();
    let index = -1;  // index of next "&" or "|" (if it exists)
    let searchTerm = "";  // search term for each iteration
    let results = articles;     // updated results according to the search

    while(input !== "") {
      if (input[0] === "|") {
        input = input.substring(1).trim();
        index = getNextIndex(input);

        if(index < 0) { searchTerm = input.trim(); }
        else { searchTerm = input.substring(0, index).trim(); }
        results = mergeArray(results, filterFunc(articles, searchTerm));
      } else if (input[0] === "&") {
        input = input.substring(1).trim();
        index = getNextIndex(input);

        if(index < 0) { searchTerm = input.trim(); }
        else { searchTerm = input.substring(0, index).trim(); }
        results = filterFunc(results, searchTerm);
      } else {
        index = getNextIndex(input);

        if(index < 0) { searchTerm = input.trim(); }
        else { searchTerm = input.substring(0, index).trim(); }
        results = filterFunc(results, searchTerm);
      }

      if (index < 0) { input = "" }
      else { input = input.substring(index); }
    }
    
    return results;
  }
  
  function searchNews(articles) { // search and filter to get the final list of resulting news articles
    let titleA = document.getElementById("titleInputA").value;
    let regionA = document.getElementById("regionInputA").value;
    let resultArticles = searchInput(articles, titleA, filterTitle);

    if (filterDrop) {
      let titleB = document.getElementById("titleInputB").value;
      let regionB = document.getElementById("regionInputB").value;
      if (showTitleB.And) {
        resultArticles = searchInput(resultArticles, titleB, filterTitle);
      } else if (showTitleB.Or && titleB !== "") {
        resultArticles = mergeArray(resultArticles, searchInput(articles, titleB, filterTitle));
      }

      let filteredArticles = resultArticles;
      if(regionA !== "") {
        filteredArticles = searchInput(resultArticles, regionA, filterRegion);
      }
      if (showRegionB.And && regionB !== "") {
        filteredArticles = searchInput(filteredArticles, regionB, filterRegion);
      } else if (showRegionB.Or && regionB !== "") {
        filteredArticles = mergeArray(filteredArticles, searchInput(resultArticles, regionB, filterRegion));
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

  const [dataDict, setDataDict] = useState(toDict(news));   // dictionary with data per year
  const [yearLabels, setYearLabels] = useState(Object.keys(dataDict));  // list of years to display in timeline chart
  const [year, setYear] = useState(yearLabels[yearLabels.length-1]);  // year selected (defualt: most recent year)
  const [filteredNews, setFilteredNews] = useState(dataDict[year]); // filtered list of laws to display

  const chartData = {
    yearLabels: yearLabels,
    dataDict: dataDict,
    year: year,
  }

  function handleClick(event, elements) {
    let index = elements[0].index;
    if (yearLabels[index]) {
      setYear(yearLabels[index]);
      setFilteredNews(dataDict[yearLabels[index]]);
    }
  }

  return (
    <>
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
          <TimelineChart data={chartData} clickHandle={handleClick} />
        </section>
        <div className={styles.newsContainer}>
        {filteredNews ? (
          filteredNews.map((article) => (
            <a className={styles.articleCard} key={article.uniqueID} href={article.proquest}>
              <b>Title: {article.title}</b>
              <p className={styles.spaceBetween}>
                <span>Author: {article.author}</span>
                <span>Date: {article.date}</span>
                <span>Publication: {article.publication}</span>
              </p>
              {/*<p>Summary: {article.summary}</p>*/}
            </a>
          ))
        ) : <p>0 results.</p>}
        </div>
    </>
  );
}
