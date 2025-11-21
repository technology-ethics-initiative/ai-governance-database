import { useState } from "react";
import { AboutIcon, AlbumIcon, BookIcon, CheckIcon, ListIcon, MinusIcon, PersonIcon, PlusIcon } from "./Icons";
import styles from './SideBar.module.css';
import { pagesData } from "../data/news";

console.log(Object.keys(pagesData.laws))
const countries = Object.keys(pagesData.laws);
const companies = Object.keys(pagesData.lawsuits);

function SideBar(props) {
  const [lawsDrop, setLawsDrop] = useState(false);
  const [suitsDrop, setSuitsDrop] = useState(false);

  return (
    <>
      {props.open ? (
        <nav className={styles.sideBar}>
          <a href="#/about">
            <button>
              <AboutIcon height="1.2em" width="1.2em" />
              About
            </button>
          </a>
          <a href="#/">
            <button>
              <BookIcon height="1.2em" width="1.2em" />
              News Articles
            </button>
          </a>
          <a href="#/laws-and-policies">
            <button id="lawsDropdown" onClick={() => setLawsDrop(!lawsDrop)}>
              <AlbumIcon height="1.2em" width="1.2em" />
              Laws and Policies
              { lawsDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )
              }
            </button>
          </a>
          <div className={styles.dropDown + " " + (lawsDrop ? styles.open : "")}>
            {countries.map((country) => (
              <a key={country} href={"#/laws-and-policies/" + country}>
                <button>{country}</button>
              </a>
            ))}
          </div>
          <a href="#/lawsuits">
            <button id="suitsDropdown" onClick={() => setSuitsDrop(!suitsDrop)}>
              <ListIcon height="1.2em" width="1.2em" />
              Lawsuits
              { suitsDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )
              }
            </button>
          </a>
          <div className={styles.dropDown + " " + (suitsDrop ? styles.open : "")}>
            {companies.map((company) => (
              <a key={company} href={"#/lawsuits/" + company}>
                <button>{company}</button>
              </a>
            ))}
          </div>
          <a href="#/business-self-regulation">
            <button>
              <PersonIcon height="1.2em" width="1.2em" />
              Business Self Regulation
            </button>
          </a>
          <a href="#/technical-solutions">
            <button>
              <CheckIcon height="1.2em" width="1.2em" />
              Technical Solutions
            </button>
          </a>
        </nav>
      ) : <div className={styles.hidden}></div> }
    </>
  );
}

export default SideBar