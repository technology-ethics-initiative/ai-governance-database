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
  const [selectedButton, setSelectedButton] = useState(null);

  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  return (
    <>
      {props.open ? (
        <nav className={styles.sideBar}>
          <a href="#/about">
            <button id="about"
              className={(selectedButton == "about" ? styles.selected : "")}
              onClick={() => {setSelectedButton("about")}}>
              <AboutIcon height="1.2em" width="1.2em" />
              About
            </button>
          </a>
          <a href="#/">
            <button id="news"
              className={(selectedButton == "news" ? styles.selected : "")}
              onClick={() => {setSelectedButton("news")}}>
              <BookIcon height="1.2em" width="1.2em" />
              News Articles
            </button>
          </a>
          <a href="#/laws-and-policies">
            <button id="lawsDropdown"
              className={(selectedButton == "lawsDropDown" ? styles.selected : "")}
              onClick={() => {setLawsDrop(!lawsDrop); setSelectedButton("lawsDropDown"); }}>
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
                <button className={selectedButton == ("laws-"+country) ? styles.selected : ""}
                  onClick={() => setSelectedButton("laws-"+country)}>{country}</button>
              </a>
            ))}
          </div>
          <a href="#/lawsuits">
            <button id="suitsDropdown"
              className={(selectedButton == "suitsDropDown" ? styles.selected : "")}
              onClick={() => {setSuitsDrop(!suitsDrop); setSelectedButton("suitsDropDown"); }}>
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
                <button className={selectedButton == ("suits-"+company) ? styles.selected : ""}
                  onClick={() => setSelectedButton("suits-"+company)}>{company}</button>
              </a>
            ))}
          </div>
          <a href="#/business-self-regulation">
            <button id="business"
              className={(selectedButton == "business" ? styles.selected : "")}
              onClick={() => {setSelectedButton("business")}}>
              <PersonIcon height="1.2em" width="1.2em" />
              Business Self Regulation
            </button>
          </a>
          <a href="#/technical-solutions">
            <button id="solutions"
              className={(selectedButton == "solutions" ? styles.selected : "")}
              onClick={() => {setSelectedButton("solutions")}}>
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