//import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Lawsuits.module.css";

function Lawsuits() {
    let { option } = useParams(); // company/organization option, to determine appropriate dataset
    const label = option == "openai" ? "OpenAI" :
                  option == "tiktok" ? "TikTok" :
                  option == "x.ai" ? "X.AI" :
                  option == "facebook" ? "Facebook" :
                  option == "google" ? "Google" :
                  option == "snap-inc" ? "Snap Inc." : "Other";
    return (
      <>
        <div className={styles.pageContent}>
          <h2>{label} Lawsuits</h2>
        </div>
      </>
    );
}

export default Lawsuits;