import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./Laws.module.css";
import data from "../data/news";

const laws = data.laws;

function Laws() {

    return (
      <>
        <PageTitle title="Laws and Policies | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Laws and Policies</h2>
          <SearchContent news={laws} />
        </div>
      </>
    );
}

export default Laws;