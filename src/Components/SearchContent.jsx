import { useState, useEffect } from "react";
import styles from "./SearchContent.module.css";
import { MinusIcon, PlusIcon, SearchIcon } from "../Components/Icons";
import TimelineChart from "../Components/TimelineChart";

export default function SearchContent(searchProps) {
  const { news, term } = searchProps;
  const [newsResults, setNewsResults] = useState(news);   // news articles resulting from search
  const [terms, setTerms] = useState(term ? [term,] : []);
  const [filterDrop, setFilterDrop] = useState(false);  // state (visible or hidden) of 'Advanced Search' menu
  const [showTitleB, setShowTitleB] = useState({
    And: false,
    Or: false,
  });  // state (visible or hidden) of 'titleInputB' search bar through whether 'and' 'or' buttons are selected
  const [showRegionB, setShowRegionB] = useState({
    And: false,
    Or: false,
  }); // state (visible or hidden) of 'regionInputB' search bar through whether 'and' 'or' buttons are selected
  const [showCompanyB, setShowCompanyB] = useState({
    And: false,
    Or: false,
  }); // state (visible or hidden) of 'companyInputB' search bar through whether 'and' 'or' buttons are selected
  const [showConceptB, setShowConceptB] = useState({
    And: false,
    Or: false,
  }); // state (visible or hidden) of 'conceptInputB' search bar through whether 'and' 'or' buttons are selected
  

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
      return articleRegions && articleRegions.toLowerCase().includes(term);
    });
  }

  function filterCompany(articles, term) { // filters articles by company using the given term
    return articles.filter((article) => {
      let articleCompanies = JSON.stringify(article.company);
      return articleCompanies && articleCompanies.toLowerCase().includes(term); 
    })
  }

  function filterConcept(articles, term) { // filters articles by concept using the given term
    return articles.filter((article) => {
      let articleConcepts = JSON.stringify(article.concept);
      return articleConcepts && articleConcepts.toLowerCase().includes(term);
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

  function resetPriority(articles) { // resets priority attribute of articles
    articles.forEach((article) => {
      article.priority = 0;
    });
  }

  function addPriority(articles, metadataKey, searchTerm) { // adds count to priority of articles
    articles.forEach((article) => {
      article.priority += (article[metadataKey] && article[metadataKey][searchTerm] ? article[metadataKey][searchTerm] : 0);
    });
    return articles;
  }

  function searchInput(articles, input, filterFunc, metadataKey) { // search by particular field using given input
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
      results = addPriority(results, metadataKey, searchTerm);

      if (index < 0) { input = "" }
      else { input = input.substring(index); }
    }
    
    return results;
  }
  
  function searchNews(articles) { // search and filter to get the final list of resulting news articles
    resetPriority(articles);
    let titleA = document.getElementById("titleInputA").value;
    let resultArticles = searchInput(articles, titleA, filterTitle);

    if (filterDrop) {
      let titleB = document.getElementById("titleInputB").value;
      if (showTitleB.And) {
        resultArticles = searchInput(resultArticles, titleB, filterTitle);
      } else if (showTitleB.Or && titleB !== "") {
        resultArticles = mergeArray(resultArticles, searchInput(articles, titleB, filterTitle));
      }

      let regionA = document.getElementById("regionInputA").value;
      let regionB = document.getElementById("regionInputB").value;
      let filteredArticles = resultArticles;
      if(regionA !== "") {
        filteredArticles = searchInput(resultArticles, regionA, filterRegion, "region");
      }
      if (showRegionB.And && regionB !== "") {
        filteredArticles = searchInput(filteredArticles, regionB, filterRegion, "region");
      } else if (showRegionB.Or && regionB !== "") {
        filteredArticles = mergeArray(filteredArticles, searchInput(resultArticles, regionB, filterRegion, "region"));
      }
      
      let companyA = document.getElementById("companyInputA").value;
      let companyB = document.getElementById("companyInputB").value;
      resultArticles = filteredArticles;  // store previous results of filter
      if(companyA !== "") {
        filteredArticles = searchInput(resultArticles, companyA, filterCompany, "company");
      }
      if(showCompanyB.And && companyB !== "") {
        filteredArticles = searchInput(filteredArticles, companyB, filterCompany, "company");
      } else if(showCompanyB.Or && companyB !== "") {
        filteredArticles = mergeArray(filteredArticles, searchInput(resultArticles, companyB, filterCompany, "company"));
      }

      let conceptA = document.getElementById("conceptInputA").value;
      let conceptB = document.getElementById("conceptInputB").value;
      resultArticles = filteredArticles;  // store previous results of filter
      if(conceptA !== "") {
        filteredArticles = searchInput(resultArticles, conceptA, filterConcept, "concept");
      }
      if(showConceptB.And && conceptB !== "") {
        filteredArticles = searchInput(filteredArticles, conceptB, filterConcept, "concept");
      } else if(showConceptB.Or && conceptB !== "") {
        filteredArticles = mergeArray(filteredArticles, searchInput(resultArticles, conceptB, filterConcept, "concept"));
      }

      resultArticles = filteredArticles;  // back to results to converge into one variable name
    } else {
      resultArticles = mergeArray(resultArticles, searchInput(articles, titleA, filterRegion, "region"));
      resultArticles = mergeArray(resultArticles, searchInput(articles, titleA, filterCompany, "company"));
      resultArticles = mergeArray(resultArticles, searchInput(articles, titleA, filterConcept, "concept"));
    }

    // sort resultArticles in descending order of priority
    resultArticles = resultArticles.sort((articleA, articleB) => (articleB.priority - articleA.priority));

    return resultArticles;
  };

  function updateTerms() { // updates 
    let tempTerms = term ? [term, ] : [];
    let titleA = document.getElementById("titleInputA").value;
    if(titleA) { tempTerms.push(titleA); }

    if(filterDrop) {
      let titleB = document.getElementById("titleInputB").value;
      if(titleB) { tempTerms.push(titleB); }

      let regionA = document.getElementById("regionInputA").value;
      if(regionA) { tempTerms.push(regionA); }
      let regionB = document.getElementById("regionInputB").value;
      if(regionB) { tempTerms.push(regionB); }

      let companyA = document.getElementById("companyInputA").value;
      if(companyA) { tempTerms.push(companyA); }
      let companyB = document.getElementById("companyInputB").value;
      if(companyB) { tempTerms.push(companyB); }

      let conceptA = document.getElementById("conceptInputA").value;
      if(conceptA) { tempTerms.push(conceptA); }
      let conceptB = document.getElementById("conceptInputB").value;
      if(conceptB) { tempTerms.push(conceptB); }
    }

    setTerms(tempTerms);
  }

  function updateResults(articles) {
    const resultArticles = searchNews(articles);  // get search results

    // update 
    let newDict = toDict(resultArticles);
    let newLabels = Object.keys(newDict);
    let newYear = newLabels[newLabels.length-1];
    setDataDict(newDict);
    setYearLabels(newLabels);
    setYear(newYear);
    setFilteredNews(newDict[newYear]);

    updateTerms();
  }

  useEffect(() => {   // handles update of news by general tab pages
    updateResults(news);
  }, [news])

  /* Graph Functionality */
  const toDict = (articles) => {  // convert news articles to a dictionary key-ed by year
    let articlesDict = {};  // law data processed as dictionary based on year
    for(let i = 0; i < articles.length; i++) {
      let article = articles[i];
      let label = article.date == null ? "?" : parseInt(article.date);

      if (articlesDict[label]) {
        articlesDict[label].push(article);
      } else {
        articlesDict[label] = [article,];
      }
    }
    articlesDict.All = articles;

    return articlesDict;
  }

  const [dataDict, setDataDict] = useState(toDict(news));   // dictionary with data per year
  const [yearLabels, setYearLabels] = useState(Object.keys(dataDict));  // list of years to display in timeline chart
  const [year, setYear] = useState("All");  // year selected (defualt: most recent year)
  const [filteredNews, setFilteredNews] = useState(dataDict[year]); // filtered list of laws to display

  const chartData = {
    yearLabels: yearLabels,
    dataDict: dataDict,
    year: year,
  }

  function handleClick(event, elements) {
    let index = elements[0].index;
    if (year == yearLabels[index]) {
      setYear("All");
      setFilteredNews(dataDict.All);
    } else if (yearLabels[index]) {
      setYear(yearLabels[index]);
      setFilteredNews(dataDict[yearLabels[index]]);
    }
  }

  return (
    <>
        <div className={styles.searchBox}>
          <div className={styles.spaceTogether}>
            <div className={styles.searchBar}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="titleInputA" type="search" placeholder={"Search" + (filterDrop ? " for a title" : "") + "..."} />
            </div>
            <button id="titleAnd" className={(showTitleB.And ? styles.active : "") + " " + (filterDrop ? styles.open : styles.hidden)}
                    onClick={() => setShowTitleB({And: !showTitleB.And, Or: false})}>And</button>
            <button id="titleOr" className={(showTitleB.Or ? styles.active : "") + " " + (filterDrop ? styles.open : styles.hidden)}
                    onClick={() => setShowTitleB({And: false, Or: !showTitleB.Or})}>Or</button>
          </div>

          <div className={styles.advancedMenu + " " + (filterDrop ? styles.open : "")}>
            <div className={styles.searchBar + " " + (showTitleB.And || showTitleB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="titleInputB" type="search" placeholder="Search for another title..." />
            </div>
            <br />
            <div className={styles.spaceTogether}>
              <div className={styles.searchBar}>
                <SearchIcon width="1.2em" height="1.2em" />
                <input id="regionInputA" type="search" placeholder="Search for a region or country..." />
              </div>
              <button id="regionAnd" className={showRegionB.And ? styles.active : ""}
                      onClick={() => setShowRegionB({And: !showRegionB.And, Or: false})}>And</button>
              <button id="regionOr" className={showRegionB.Or ? styles.active : ""}
                      onClick={() => setShowRegionB({And: false, Or: !showRegionB.Or})}>Or</button>
            </div>
            <div className={styles.searchBar + " " + (showRegionB.And || showRegionB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="regionInputB" type="search" placeholder="Search for another region or country..." />
            </div>
            <br />
            <div className={styles.spaceTogether}>
              <div className={styles.searchBar}>
                <SearchIcon width="1.2em" height="1.2em" />
                <input id="companyInputA" type="search" placeholder="Search for a company..." />
              </div>
              <button id="companyAnd" className={showCompanyB.And ? styles.active : ""}
                      onClick={() => setShowCompanyB({And: !showCompanyB.And, Or: false})}>And</button>
              <button id="companyOr" className={showCompanyB.Or ? styles.active : ""}
                      onClick={() => setShowCompanyB({And: false, Or: !showCompanyB.Or})}>Or</button>
            </div>
            <div className={styles.searchBar + " " + (showCompanyB.And || showCompanyB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="companyInputB" type="search" placeholder="Search for another company..." />
            </div>
            <br />
            <div className={styles.spaceTogether}>
              <div className={styles.searchBar}>
                <SearchIcon width="1.2em" height="1.2em" />
                <input id="conceptInputA" type="search" placeholder="Search for a concept..." />
              </div>
              <button id="conceptAnd" className={showConceptB.And ? styles.active : ""}
                      onClick={() => setShowConceptB({And: !showConceptB.And, Or: false})}>And</button>
              <button id="conceptOr" className={showConceptB.Or ? styles.active : ""}
                      onClick={() => setShowConceptB({And: false, Or: !showConceptB.Or})}>Or</button>
            </div>
            <div className={styles.searchBar + " " + (showConceptB.And || showConceptB.Or ? "" : styles.hidden)}>
              <SearchIcon width="1.2em" height="1.2em" />
              <input id="conceptInputB" type="search" placeholder="Search for another concept..." />
            </div>
          </div>

          <button className={styles.searchButton} type='submit' onClick={() => setNewsResults(updateResults(news))}>Search</button>
          <button className={styles.menuButton} onClick={() => setFilterDrop(!filterDrop)}>
            { filterDrop ? (
              <MinusIcon height="1.2em" width="1.2em" />
            ) : (
              <PlusIcon height="1.2em" width="1.2em" />
            )}
            Advanced Search
          </button>
        </div>
        
        <div className={styles.tagContainer}>
          {terms.map((term) => (
            <div className={styles.tag} key={term}>{term}</div>
          ))}
        </div>
        <section className={styles.chartContainer + " " + (newsResults ? "" : "hidden")}>
          <TimelineChart data={chartData} clickHandle={handleClick} />
        </section>
        <div className={styles.newsContainer}>
        {filteredNews ? (
          filteredNews.map((article) => (
            <a className={styles.articleCard} key={article.uniqueID} href={article.url ? article.url : article.proquest}>
              <b>{/*Title:*/} {article.title}</b>
              <p className={styles.spaceBetween}>
                <span>Author: {article.author}</span>
                <span>Date: {article.date ? article.date : "Unknown"}</span>
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
