import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;