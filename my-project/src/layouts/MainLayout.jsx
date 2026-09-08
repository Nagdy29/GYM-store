import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white text-zinc-900"
    >
      <Navbar />

      <main className="min-h-[60vh] bg-white text-zinc-900">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;