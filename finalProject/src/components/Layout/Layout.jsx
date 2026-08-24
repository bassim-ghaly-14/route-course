import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

export default function Layout() {
  const { loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="font-bold text-xl text-primary-700">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/*
        The Navbar is position:fixed, so the document flow does not reserve
        space for it. Instead of a hardcoded pt-24/pt-32 guess, main offsets
        by --navbar-height — a CSS variable that Navbar keeps in sync with
        its REAL rendered height (which differs between mobile/desktop and
        auth states). One centralized fix for every route.
      */}
      <main
        className="page-container min-h-screen pb-16"
        style={{ paddingTop: "calc(var(--navbar-height, 4rem) + 0.5rem)" }}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}