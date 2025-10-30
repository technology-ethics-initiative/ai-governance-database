import { useState } from "react";
import { AboutIcon, AlbumIcon, BookIcon, CheckIcon, ListIcon, MinusIcon, PersonIcon, PlusIcon } from "./Icons";
import styles from './SideBar.module.css';

function SideBar(props) {
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
            <button>
              <AlbumIcon height="1.2em" width="1.2em" />
              Laws and Policies
            </button>
          </a>
          <a href="#/lawsuits">
            <button>
              <ListIcon height="1.2em" width="1.2em" />
              Lawsuits
            </button>
          </a>
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