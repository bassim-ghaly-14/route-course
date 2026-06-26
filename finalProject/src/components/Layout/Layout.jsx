import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

export default function Layout() {
  const { loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-green-600 font-bold text-xl">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container mx-auto p-10 pt-24 min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}