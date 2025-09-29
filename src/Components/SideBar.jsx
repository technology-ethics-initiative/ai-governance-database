import { useState } from "react";
import { AboutIcon, AlbumIcon, BookIcon, CheckIcon, ListIcon, MinusIcon, PersonIcon, PlusIcon } from "./Icons";
import styles from './SideBar.module.css';

function SideBar(props) {

  const [lawsDrop, setLawsDrop] = useState(false);  // state (visible or hidden) of 'Laws and Policies' dropdown menu
  const [suitsDrop, setSuitsDrop] = useState(false);  // state (visible or hidden) of 'Lawsuits' dropdown menu
  const [businessDrop, setBusinessDrop] = useState(false);  // state (visible or hidden) of 'Business Self-Regulation' dropdown menu
  const [solutionsDrop, setSolutionsDrop] = useState(false);  // state (visible or hidden) of 'Technical Solutions' dropdown menu

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
              <button id="lawsDropdown" onClick={() => setLawsDrop(!lawsDrop)}>
                <AlbumIcon height="1.2em" width="1.2em" />
                Laws and Policies
                { lawsDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )}
              </button>
              <div className={styles.dropDown + " " + (lawsDrop ? styles.open : "")}>
                <a href="#/laws-and-policies/national">
                  <button>National</button>
                </a>
                <a href="#/laws-and-policies/states">
                  <button>U.S. States</button>
                </a>
                <a href="#/laws-and-policies/international">
                  <button>International</button>
                </a>
              </div>
              <button id="suitsDropdown" onClick={() => setSuitsDrop(!suitsDrop)}>
                <ListIcon height="1.2em" width="1.2em" />
                Lawsuits
                { suitsDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )}
              </button>
              <div className={styles.dropDown + " " + (suitsDrop ? styles.open : "")}>
                <a href="#/lawsuits/openai">
                  <button>OpenAI</button>
                </a>
                <a href="#/lawsuits/tiktok">
                  <button>TikTok</button>
                </a>
                <a href="#/lawsuits/x.ai">
                  <button>X.AI</button>
                </a>
                <a href="#/lawsuits/facebook">
                  <button>Facebook</button>
                </a>
                <a href="#/lawsuits/google">
                  <button>Google</button>
                </a>
                <a href="#/lawsuits/snap-inc">
                  <button>Snap Inc.</button>
                </a>
                <a href="#/lawsuits/other">
                  <button>Other</button>
                </a>
              </div>
              <button id="businessDropdown" onClick={() => setBusinessDrop(!businessDrop)}>
                <PersonIcon height="1.2em" width="1.2em" />
                Business Self-Regulation
                { businessDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )}
              </button>
              <div className={styles.dropDown + " " + (businessDrop ? styles.open : "")}>
                <a href="#/business-self-regulation/principles-and-standards">
                  <button>Principles and Standards</button>
                </a>
                <a href="#/business-self-regulation/boards-councils-teams">
                  <button>Boards, Councils, and Teams</button>
                </a>
              </div>
              <button id="solutionsDropdown" onClick={() => setSolutionsDrop(!solutionsDrop)}>
                <CheckIcon height="1.2em" width="1.2em" />
                <span>Technical Solutions</span>
                { solutionsDrop ? (
                  <MinusIcon height="1.2em" width="1.2em" />
                ) : (
                  <PlusIcon height="1.2em" width="1.2em" />
                )}
              </button>
              <div className={styles.dropDown + " " + (solutionsDrop ? styles.open : "")}>
                <a href="#/technical-solutions/ai-for-social-good">
                  <button>AI for Social Good</button>
                </a>
                <a href="#/technical-solutions/human-in-the-loop">
                  <button>Human-in-the-Loop</button>
                </a>
                <a href="#/technical-solutions/de-biasing">
                  <button>De-Biasing</button>
                </a>
                <a href="#/technical-solutions/testing">
                  <button>Testing</button>
                </a>
                <a href="#/technical-solutions/ai-detection">
                  <button>AI Detection</button>
                </a>
              </div>
        </nav>
      ) : <div className={styles.hidden}></div> }
    </>
  );
}

export default SideBar