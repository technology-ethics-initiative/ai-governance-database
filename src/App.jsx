import { createHashRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { HeartIcon, SUFullIcon } from "./Components/Icons";
import SideBar from "./Components/SideBar";
import About from "./pages/About";
import Home from "./pages/Home";
import Laws from "./pages/Laws";
import Lawsuits from "./pages/Lawsuits";
import BusinessRegulation from "./pages/BusinessRegulation";
import Solutions from "./pages/Solutions";
import styles from "./App.module.css";

const router = createHashRouter([
    {
    path: "/about",
    element: <About />
  },
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/laws-and-policies",
    element: <Laws />
  },
  {
    path: "/laws-and-policies/:country",
    element: <Laws />
  },
  {
    path: "/lawsuits",
    element: <Lawsuits />
  },
  {
    path: "/lawsuits/:company",
    element: <Lawsuits />
  },
  {
    path: "/business-self-regulation",
    element: <BusinessRegulation />
  },
  {
    path: "/technical-solutions",
    element: <Solutions />
  },
]);

function App() {
  let mobile = window.innerWidth > 800;
  const [sideOpen, setNavOpen] = useState(mobile);  // state (visible or hidden) of sidebar
  const [menuOpen, setMenuOpen] = useState(false);  // state (visible or hidden) of mobile menu

  const MainLogo = () => {
    return (
      <div className={styles.logo} onClick={() => router.navigate("/")}>
        <span className={styles.title}>AI Governance Database</span>
      </div>
    );
  }
  // scroll to top on navigation
  router.subscribe(() => {
    window.scrollTo(0, 0);
  });

  // clicking something not in the menu should close the menu
  window.addEventListener("click", (e) => {
    if (menuOpen && !(e.target).closest("." + styles.mobileNav)) {
      setMenuOpen(false);
    }
  });
  // when the window resizes past the mobile breakpoint, close the menu
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      setMenuOpen(false);
      setNavOpen(true);
    } else {
      setNavOpen(false);
    }
  });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.nav}>
          <MainLogo />
        </div>
        <div className={styles.mobileNav}>
          <MainLogo />
          <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={styles.hamburger}>
              <span className={styles.hamburgerInnerLine}></span>
            </span>
          </button>
        </div>
        <nav className={styles.mobileMenu + " " + (menuOpen ? styles.open : "")}>
          <a href="#/about">About</a>
          <a href="#/">News</a>
        </nav>
      </header>
      <section className={styles.content}>
        <SideBar open={sideOpen} />
        <RouterProvider router={router} />
      </section>
      <footer className={styles.footer}>
        <SUFullIcon />
        <p className={styles.footerHeartMsg}>We <HeartIcon /> open source!</p>
        <a href="https://github.com/">Visit our GitHub</a>
      </footer>
    </>
  )
}

export default App;
