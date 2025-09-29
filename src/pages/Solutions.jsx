//import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Solutions.module.css";

function Solutions() {
    let { option } = useParams();  // option for type of solution, to determine appropriate dataset
    const label = option == "ai-for-social-good" ? "AI for Social Good" :
                  option == "human-in-the-loop" ? "Human-in-the-Loop" :
                  option == "de-biasing" ? "De-Biasing" :
                  option == "testing" ? "Testing" : "AI Detection";
    return (
      <>
        <div className={styles.pageContent}>
          <h2>{label} Solutions</h2>
        </div>
      </>
    );
}

export default Solutions;