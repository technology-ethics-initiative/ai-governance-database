import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./BusinessRegulation.module.css";
import { data } from "../data/news";

const boards = data.boards;

function BusinessRegulation() {

    return (
      <>
        <PageTitle title="Business Regulation | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Business Self Regulation</h2>
          <SearchContent news={boards} />
        </div>
      </>
    );
}

export default BusinessRegulation;