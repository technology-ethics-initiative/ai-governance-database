import { useState } from "react";
import { AboutIcon, AlbumIcon, BookIcon, CheckIcon, MinusIcon, PersonIcon, PlusIcon } from "./Icons";
import styles from './SideBar.module.css';

interface SideBarProps {
    open: Boolean;
}

function SideBar(props : SideBarProps) {

  const [lawsDrop, setLawsDrop] = useState(false);  // state (visible or hidden) of 'Laws and Policies' dropdown menu
  const [businessDrop, setBusinessDrop] = useState(false);  // state (visible or hidden) of 'Business Self-Regulation' dropdown menu
  const [solutionsDrop, setSolutionsDrop] = useState(false);  // state (visible or hidden) of 'Technical Solutions' dropdown menu

  console.log(props.open);

  return (
    <>
      {props.open ? (
        <nav className={styles.sideBar}>
              <a href="#/">
                <button className="secondary">
                  <BookIcon height="1.2em" width="1.2em" />
                  News
                </button>
              </a>
              <a href="#/about">
                <button className="secondary">
                  <AboutIcon height="1.2em" width="1.2em" />
                  About
                </button>
              </a>
              <button id="lawsDropdown" className="secondary" onClick={() => setLawsDrop(!lawsDrop)}>
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
                  <button className="secondary">
                    National
                  </button>
                </a>
                <a href="#/laws-and-policies/states">
                  <button className="secondary">
                    U.S. States
                  </button>
                </a>
                <a href="#/laws-and-policies/international">
                  <button className="secondary">
                    International
                  </button>
                </a>
              </div>
              <button id="businessDropdown" className="secondary" onClick={() => setBusinessDrop(!businessDrop)}>
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
                  <button className="secondary">
                    Principles and Standards
                  </button>
                </a>
                <a href="#/business-self-regulation/boards-and-councils">
                  <button className="secondary">
                    Boards and Councils
                  </button>
                </a>
                <a href="#/business-self-regulation/teams">
                  <button className="secondary">
                    Teams
                  </button>
                </a>
              </div>
              <button id="solutionsDropdown" className="secondary" onClick={() => setSolutionsDrop(!solutionsDrop)}>
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
                  <button className="secondary">
                    AI for Social Good
                  </button>
                </a>
                <a href="#/technical-solutions/human-in-the-loop">
                  <button className="secondary">
                    Human-in-the-Loop
                  </button>
                </a>
                <a href="#/technical-solutions/de-biasing">
                  <button className="secondary">
                    De-Biasing
                  </button>
                </a>
                <a href="#/technical-solutions/testing">
                  <button className="secondary">
                    Testing
                  </button>
                </a>
                <a href="#/technical-solutions/ai-detection">
                  <button className="secondary">
                    AI Detection
                  </button>
                </a>
              </div>
        </nav>
      ) : <div className={styles.hidden}></div> }
    </>
  );
}

export type { SideBarProps}
export default SideBar