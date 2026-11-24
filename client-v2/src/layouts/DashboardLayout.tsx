
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // إغلاق القائمة عند الانتقال إلى صفحة أخرى
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed
          inset-y-0
          right-0
          z-50
          w-72
          transform
          transition-transform
          duration-300
          ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:sticky
          lg:inset-auto
          lg:top-0
          lg:z-auto
          lg:h-screen
          lg:shrink-0
          lg:translate-x-0
        `}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main */}
      <div className="min-w-0 flex-1 flex flex-col">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="w-full p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
