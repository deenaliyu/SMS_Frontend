import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../SideBar/SideBar";

export default function Layout({ children, activeTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeTab={activeTab} />

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}