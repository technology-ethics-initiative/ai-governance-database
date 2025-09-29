import PageTitle from "../Components/PageTitle";
import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <PageTitle title="About | AI Governance Database" />
      <div className={styles.pageContent}>
        <h2>About Us</h2>

        <h3>Our Team</h3>
        <p>AI Governance Database @ SU is ...</p>
        <h3>Contributors</h3>
        <p>Our team is composed of students and professors from multiple cohorts and disciplines.</p>
        <h4>Seattle University Law Department</h4>
        <ul>
          <li>Dr. Onur Bakiner</li>
          <li>Swarnim Swasti</li>
        </ul>
        <h4>Seattle University Computer Science Department</h4>
        <ul>
          <li>Dr. Nate Kremer-Herman</li>
          <li>Rena Ahn</li>
        </ul>
        <h4>Special Thanks</h4>
        <p>The following are ...</p>
        <ul>
          <li>BioSims?</li>
        </ul>
      </div>
    </>
  )
};
