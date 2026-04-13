// src/pages/HR/StaffAttendance.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

export default function StaffAttendance() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const attendanceData = [
    // Dummy Data
    { name: "Danjuma Danlami", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Aisha Abubakar", status: "Absent" },
    { name: "Danjuma Danlami", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Aisha Abubakar", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Danjuma Danlami", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Aisha Abubakar", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Danjuma Danlami", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Aisha Abubakar", status: "Present", timeIn: "9:00AM", timeOut: "5:00PM", hours: "8 Hours" },
    { name: "Danjuma Danlami", status: "Absent" },
  ];

  // Filter logic
  const filteredData = attendanceData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Add date filtering logic if you want
    return matchesSearch;
  });

  return (
    <Layout activeTab="HR">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Attendance</h1>
      </div>

      {/* Breadcrumb */}
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
        <span className="text-black font-medium">Staff Attendance</span>
      </div>

      {/* Attendance Filters */}
      <div className="bg-white p-4 rounded shadow border mb-6">
        <h2 className="text-lg font-semibold mb-4">Attendance</h2>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-2 rounded w-full sm:w-auto max-w-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="border px-3 py-2 rounded text-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border px-3 py-2 rounded text-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>S/N</th>
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>WSB5147</td>
                  <td>{entry.name}</td>
                  <td>14/3/2024</td>
                  <td className={entry.status === "Present" ? "text-green-600" : "text-red-500"}>
                    {entry.status}
                  </td>
                  <td>{entry.timeIn || "-"}</td>
                  <td>{entry.timeOut || "-"}</td>
                  <td>{entry.hours || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button className="border px-4 py-1 rounded cursor-pointer">Previous</button>
          <button className="border px-4 py-1 rounded cursor-pointer">Next</button>
          <span className="text-gray-500">Page 1 of 50</span>
        </div>
      </div>
    </Layout>
  );
}
