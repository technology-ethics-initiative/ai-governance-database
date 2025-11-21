import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./Laws.module.css";
import { data, pagesData} from "../data/news";

const laws = data.laws;
const country_laws = pagesData.laws;


function Laws() {
    const { country } = useParams();
    /*const [news, setNews] = useState(laws);
    useEffect(() => {
      if(country) { setNews(filterRegion(laws, country.toLowerCase())); }
    }, country)
    //console.log(country ? filterRegion(laws, country.toLowerCase()) : laws);
    console.log(news);*/

    return (
      <>
        <PageTitle title="Laws and Policies | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Laws and Policies</h2>
          <SearchContent news={country ? country_laws[country] : laws} term={country} />
        </div>
      </>
    );
}

export default Laws;