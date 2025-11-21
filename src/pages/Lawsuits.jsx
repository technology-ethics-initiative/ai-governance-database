import { useParams } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import SearchContent from "../Components/SearchContent";
import styles from "./Lawsuits.module.css";
import { data, pagesData } from "../data/news";

const lawsuits = data.lawsuits;
const company_lawsuits = pagesData.lawsuits;

function Lawsuits() {
  const { company } = useParams();

    return (
      <>
        <PageTitle title="Lawsuits | AI Governance Database" />
        <div className={styles.pageContent}>
          <h2>Lawsuits</h2>
          <SearchContent news={company ? company_lawsuits[company] : lawsuits} term={company} />
        </div>
      </>
    );
}

export default Lawsuits;