import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./BusinessRegulation.module.css";
import { data } from "../data/news";

const regulations = data.regulations;

function BusinessRegulation() {

    return (
      <>
        <PageTitle title="Business Regulation | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Business Self Regulation</h2>
          <SearchContent news={regulations} />
        </div>
      </>
    );
}

export default BusinessRegulation;