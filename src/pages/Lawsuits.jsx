import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./Lawsuits.module.css";
import data from "../data/news";

const lawsuits = data.lawsuits;

function Lawsuits() {

    return (
      <>
        <PageTitle title="Lawsuits | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Lawsuits</h2>
          <SearchContent news={lawsuits} />
        </div>
      </>
    );
}

export default Lawsuits;