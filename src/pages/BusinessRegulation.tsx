//import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./BusinessRegulation.module.css";

function BusinessRegulation() {
    let { option } = useParams();
    const label = option == "principles-and-standards" ? "Principles and Standards" : 
                  option == "boards-and-councils" ? "Boards and Councils" : "Teams";
    return (
      <>
        <div className={styles.pageContent}>
          <h2>{label}</h2>
        </div>
      </>
    );
}

export default BusinessRegulation;