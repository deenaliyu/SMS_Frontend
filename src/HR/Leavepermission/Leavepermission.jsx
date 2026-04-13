import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

export default function LeavePermission() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for leave requests
  const data = [
    { name: "Danjuma Danlami", title: "Sick Leave", status: "Accepted" },
    { name: "Aisha Abubakar", title: "Overtime", status: "Rejected" },
    { name: "Danjuma Danlami", title: "Emergency", status: "Pending" },
  ];

  const filteredData = data.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout activeTab="HR">
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leave - Permission Request</h1>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span
            onClick={() => navigate("/HrDashboard")}
            className="text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-black px-2 py-1 rounded"
          >
            HR-Dashboard
          </span>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-400">Quick Links</span>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-black font-medium">Leave - Permission Request</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Requests</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded w-full max-w-sm"
            />
          </div>

          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>S/N</th>
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Permission Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>WSB5147</td>
                  <td>{entry.name}</td>
                  <td>14/3/2024</td>
                  <td>{entry.title}</td>
                  <td
                    className={
                      entry.status === "Accepted"
                        ? "text-green-500"
                        : entry.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }
                  >
                    {entry.status}
                  </td>
                  <td className="flex gap-2 py-2">
                    <button
                      onClick={() => setShowPopup(true)}
                      className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 border border-green-600 px-3 py-1 rounded cursor-pointer disabled:opacity-40"
                      disabled={entry.status !== "Pending"}
                    >
                      Accept
                    </button>
                    <button
                      className="text-red-600 border border-red-600 px-3 py-1 rounded cursor-pointer disabled:opacity-40"
                      disabled={entry.status !== "Pending"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <LeaveRequestDetails onClose={() => setShowPopup(false)} />
          </div>
        )}
      </div>
    </Layout>
  );
}

export function LeaveRequestDetails({ onClose }) {
  return (
    <div className="bg-white max-w-2xl w-full p-6 rounded shadow border relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
      >
        <X />
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-lg font-semibold">Danjuma Danlami</p>
          <p className="text-green-600 text-sm">Teacher</p>
        </div>
        <div className="text-sm text-right">
          <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
          <p className="mt-2">Leave Status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
        <div>
          <p className="font-semibold">Date of Request:</p>
          <p>August 22, 2024</p>
        </div>
        <div>
          <p className="font-semibold">Leave Type:</p>
          <p>Annual Leave</p>
        </div>
        <div>
          <p className="font-semibold">Start Date:</p>
          <p>September 1, 2024</p>
        </div>
        <div>
          <p className="font-semibold">End Date:</p>
          <p>September 15, 2024</p>
        </div>
        <div>
          <p className="font-semibold">Total Leave Days:</p>
          <p>15 Days</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-sm text-gray-700 mb-2">Reason for Leave</p>
        <div className="border rounded p-4 text-sm text-gray-600 bg-gray-50 leading-relaxed">
          I am requesting this leave to attend to a personal family matter that requires my presence
          outside of the city...
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-green-500 text-white py-2 rounded w-full sm:w-1/2 hover:bg-green-600 transition">
          Accept
        </button>
        <button className="border border-red-500 text-red-600 py-2 rounded w-full sm:w-1/2 hover:bg-red-50 transition">
          Reject
        </button>
      </div>
    </div>
  );
}
