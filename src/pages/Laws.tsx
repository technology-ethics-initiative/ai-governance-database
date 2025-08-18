//import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Laws.module.css";

function Laws() {
    let { option } = useParams();
    const label = option == "international" ? "International" : option == "states" ? "U.S. States" : "National";
    return (
      <>
        <div className={styles.pageContent}>
          <h2>{label} Laws</h2>
        </div>
      </>
    );
}

export default Laws;