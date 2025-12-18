import PageTitle from "../Components/PageTitle";
import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <PageTitle title="About | AI Governance Database" />
      <div className={styles.pageContent}>
        <h2>About Us</h2>
        <hr />

        <h3>Our Team</h3>
        <div>
          <p>AI Governance Database @ SU is ...</p>
          <p>We are a team composed of students and professors from multiple cohorts and disciplines.</p>  
        </div>
        
        <br />
        <h3>Contributors</h3>
        <ul>
          <li><i>Rena Ahn</i> - Department of Computer Science</li>
          <li><i>Dr. Onur Bakiner</i> - Technology Ethics Initiative, Department of Political Science</li>
          <li><i>Dr. Nate Kremer-Herman</i> - Technology Ethics Initiative, Department of Computer Science</li>
          <li><i>Swarnim Swasti</i> - Technology Ethics Initiative, School of Law</li>
        </ul>
      </div>
    </>
  )
}
