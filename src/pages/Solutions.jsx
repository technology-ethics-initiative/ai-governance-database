import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./Solutions.module.css";
import { data } from "../data/news";

const solutions = data.solutions;

function Solutions() {

    return (
      <>
        <PageTitle title="Solutions | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Technical Solutions</h2>
          <SearchContent news={solutions} />
        </div>
      </>
    );
}

export default Solutions;