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
        <ul>
          <li>Rena Ahn - Department of Computer Science</li>
          <li>Dr. Onur Bakiner - Technology Ethics Initiative, Department of Political Science</li>
          <li>Dr. Nate Kremer-Herman - Technology Ethics Initiative, Department of Computer Science</li>
          <li>Swarnim Swasti - Technology Ethics Initiative, School of Law</li>
        </ul>
      </div>
    </>
  )
}
