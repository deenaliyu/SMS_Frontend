import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Layout from "../../components/Layout/Layout"; // ✅ Import Layout

export default function Admission() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const data = [
    { id: "559", name: "Aisha Abubakar", class: "SS 1", status: "Rejected" },
    { id: "558", name: "Danjuma Danlami", class: "SS 1", status: "Pending" },
    { id: "557", name: "Aisha Abubakar", class: "JSS 1", status: "Accepted" },
    { id: "556", name: "Danjuma Danlami", class: "SS 1", status: "Accepted" },
    { id: "555", name: "Aisha Abubakar", class: "JSS 1", status: "Accepted" },
    { id: "554", name: "Danjuma Danlami", class: "JSS 1", status: "Accepted" },
    { id: "553", name: "Aisha Abubakar", class: "SS 1", status: "Pending" },
    { id: "552", name: "Danjuma Danlami", class: "JSS 1", status: "Rejected" },
  ];

  // Filter data based on search term
  const filteredData = data.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.includes(searchTerm)
  );

  return (
    <Layout activeTab="HR">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admission</h1>
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
          <span className="text-black font-medium">Leave -Permission Request</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Admission</h2>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full max-w-sm mb-4"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th>S/N</th>
                  <th>Admission No.</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td>{index + 1}</td>
                    <td>{entry.id}</td>
                    <td>{entry.name}</td>
                    <td>{entry.class}</td>
                    <td>14/3/2024</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === "Accepted"
                            ? "bg-green-100 text-green-600"
                            : entry.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate("/StudentInfo")}
                        className="bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button className="border border-green-500 text-green-600 px-4 py-1 rounded hover:bg-green-50 cursor-pointer">
              Previous
            </button>
            <button className="border border-green-500 text-green-600 px-4 py-1 rounded hover:bg-green-50 cursor-pointer">
              Next
            </button>
            <span className="text-gray-500">Page 1 of 50</span>
          </div>
        </div>
      </main>
    </Layout>
  );
}
