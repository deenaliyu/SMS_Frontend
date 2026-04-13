import React, { useState } from "react";
import Sidebar from "../SideBar/SideBar";
import { List } from "lucide-react";

export default function Layout({ children, activeTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile toggle icon */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded shadow cursor-pointer"
      >
        <List className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeTab={activeTab} />

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
