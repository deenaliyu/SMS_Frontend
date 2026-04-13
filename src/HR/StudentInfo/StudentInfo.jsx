"use client"

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  MessageCircle,
  CalendarDays,
  DollarSign,
  Bell,
  ClipboardList,
  BookOpenCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar"; // Use the shared Sidebar

export default function AdmissionDetail() {
  const [activeTab, setActiveTab] = useState("student");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => setShowAcceptModal(true);
  const handleReject = () => setShowRejectModal(true);
  const handleBackToDashboard = () => {
    setShowAcceptModal(false);
    setShowRejectModal(false);
    navigate("/HrDashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeTab="HR" />
      {/* Main Content */}
      <main className={`flex-1 p-6 ${showAcceptModal || showRejectModal ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Danjuma Danlami</h1>
          <div className="space-x-2">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-4">
          <span onClick={() => navigate("/HrDashboard")} className="text-gray-700 cursor-pointer hover:underline">
            HR-Dashboard
          </span>
          <span className="mx-1">&gt;</span>
          <span className="text-gray-400">Quick Links</span>
          <span className="mx-1">&gt;</span>
          <span onClick={() => navigate("/admission")} className="text-gray-700 cursor-pointer hover:underline">
            Admission
          </span>
          <span className="mx-1">&gt;</span>
          <span className="text-black font-medium">Danjuma Danlami</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button
            className={`pb-2 border-b-2 font-medium text-sm ${activeTab === "student" ? "border-green-500 text-green-600" : "text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("student")}
          >
            Student Info
          </button>
          <button
            className={`pb-2 border-b-2 font-medium text-sm ${activeTab === "parent" ? "border-green-500 text-green-600" : "text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("parent")}
          >
            Parent/Guardian Info
          </button>
        </div>

        {/* Student Info Form */}
        {activeTab === "student" && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Input label="Admission Number" value="600" />
              <Input label="Admission Date" value="14/3/2024" />
              <Input label="Class" value="SS 1" />
              <Input label="First Name" value="Danlami" />
              <Input label="Middle Name" value="Nil" />
              <Input label="Last Name" value="Danjuma" />
              <Input label="Date of Birth" value="01/03/2008" />
              <Input label="Gender" value="Male" />
              <Input label="Address" value="123 Nassarawa GRA, Kano" />
              <Input label="State" value="Kano" />
              <Input label="Email" value="danjumadanlami2008@gmail.com" />
              <Input label="LGA" value="Nasarawa" />
              <Input label="Mobile number" value="08121345678" />
              <Input label="Previous School" value="Jubril Memorial School" />
            </div>
          </div>
        )}

        {/* Parent Info */}
        {activeTab === "parent" && (
          <div className="bg-white p-6 rounded-lg shadow border text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" value="Mr" />
              <Input label="First Name" value="DanJuma" />
              <Input label="Middle Name" value="Nit" />
              <Input label="Last Name" value="Alfa" />
              <Input label="Date of Birth" value="01/12/1973" />
              <Input label="Gender" value="Male" />
              <Input label="Address" value="123 Nassarawa GRA, Kano" />
              <Input label="State" value="Kano" />
              <Input label="LGA*" value="Nasarawa" />
              <Input label="Email" value="danjumaalfa@gmail.com" />
              <Input label="Mobile number" value="09012345678" />
              <Input label="Educational Qualification" value="Msc. Cyber Security" />
              <Input label="Occupation" value="Civil Servant" />
              <Input label="Annual Income" value="N2,345,213" />
            </div>
          </div>
        )}
      </main>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accepted!</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Admission request has been approved successfully!
              <br />a notification has been sent to the applicant and the
              <br />
              guardians email respectively.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition font-medium"
            >
              Back To HR Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Rejected!</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Admission request has been rejected!
              <br />a notification has been sent to the applicant and the
              <br />
              guardians email respectively.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition font-medium"
            >
              Back To HR Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
      />
    </div>
  );
}
