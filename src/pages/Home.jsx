import styles from "./Home.module.css";
import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import { data } from "../data/news";

const news = data.all;  // change to news if specificity was intended

export default function Home() {
  
  return (
    <>
      <PageTitle title="AI Governance Database" />
      <div className={styles.pageContent}>
        <h1>Welcome to the AI Governance Database!</h1>
        <p>Search for concepts, companies, or regions.</p>
        <SearchContent news={news} />
      </div>
    </>
  );
}
