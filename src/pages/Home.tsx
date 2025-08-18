//import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { SearchIcon } from '../Components/Icons';
import PageTitle from '../Components/PageTitle';

export default function Home() {
  //const navigate = useNavigate();
  //const handleLearnMoreClick = () => { navigate('/about'); };

  return (
    <>
      <PageTitle title="AI Governance Database @ SU | Home" />
      <div className={styles.pageContent}>
        <h1>Welcome to the AI Governance Database!</h1>
        <p>Try querying law articles below.</p>
        <div className={styles.searchBar}>
          <SearchIcon width="1.2em" height="1.2em" />
          <input name="query" type='search' placeholder="Search..." />
        </div>
      </div>
    </>
  );
}
