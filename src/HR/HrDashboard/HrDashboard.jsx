import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

export default function HRDashboard() {
  const navigate = useNavigate();

  return (
    <Layout activeTab="HR">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <button className="lg:hidden text-gray-700 cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => navigate("/Leavepermission")}
          className="border border-green-500 text-green-600 font-medium py-3 rounded-lg cursor-pointer hover:bg-green-50"
        >
          Leave/Permission/Query Request
        </button>
        <button
          onClick={() => navigate("/StaffAttendance")}
          className="border border-green-500 text-green-600 font-medium py-3 rounded-lg cursor-pointer hover:bg-green-50"
        >
          Staff Attendance
        </button>
        <button
          onClick={() => navigate("/AdmissionManagement")}
          className="border border-green-500 text-green-600 font-medium py-3 rounded-lg cursor-pointer hover:bg-green-50"
        >
          Admission Management
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Staffs', value: '2250' },
          { label: 'Present Teachers', value: '2000' },
          { label: 'Absent Teachers', value: '250' }
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 rounded shadow text-center">
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="text-2xl font-bold text-black">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold">Attendance Summary</h3>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-semibold mb-4">Today's Attendance</h3>
          <div className="h-40 flex items-center justify-center">
            <div className="w-32 h-32 bg-green-100 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Request Table */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-semibold mb-4">Today's Request</h3>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>S/N</th>
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Permission Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b">
                  <td>{i}</td>
                  <td>WS6587</td>
                  <td>{i % 2 === 0 ? 'Aisha Abubakar' : 'Danjuma Danlami'}</td>
                  <td>14/7/2024</td>
                  <td>{['Sick Leave', 'Overtime', 'Emergency'][i % 3]}</td>
                  <td>
                    <button className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-sm">
            <button className="border px-4 py-1 rounded cursor-pointer">Previous</button>
            <button className="border px-4 py-1 rounded cursor-pointer">Next</button>
            <span className="text-gray-500">Page 1 of 50</span>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-semibold mb-4">Recent Attendance</h3>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>S/N</th>
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b">
                  <td>{i}</td>
                  <td>WS6587</td>
                  <td>{i % 2 === 0 ? 'Aisha Abubakar' : 'Danjuma Danlami'}</td>
                  <td>14/7/2024</td>
                  <td className={i === 2 ? 'text-red-500' : 'text-green-600'}>
                    {i === 2 ? 'Absent' : 'Present'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-sm">
            <button className="border px-4 py-1 rounded cursor-pointer">Previous</button>
            <button className="border px-4 py-1 rounded cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
