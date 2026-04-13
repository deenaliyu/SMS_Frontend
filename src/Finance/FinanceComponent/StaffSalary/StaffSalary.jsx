import Layout from "../../../components/Layout/Layout"
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import SalTable from "./SalHistoryTable";
import AttendanceTable from "./AttendanceTable";
import { useState } from "react";

export default function StaffSalary() {

  const navigate = useNavigate();
  const [salHistoryTab, setSalHistoryTab] = useState(true);

  return(
    <>
      <Layout activeTab = "Finance">
        <div className="min-h-screen">
        <div className="bg-white rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-2xl">Staff Salaries</h1>
                <div className="flex gap-4 items-center">
                  <p className="text-gray-400 text-sm cursor-pointer"
                    onClick={() => navigate("/finance")}
                  >Finance</p>
                  <p className="text-gray-400 text-sm">{">"}</p>
                  <p className="font-medium text-sm">Staff Salaries</p>
                </div>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <button
              className={`py-2 w-max text-gray-900 cursor-pointer ${salHistoryTab && "border-b-2 border-green-500 text-green-500"}`}
              onClick={() => setSalHistoryTab(true)}
              >
                Salary History
              </button>
              <button
              className={`py-2 w-max text-gray-900 cursor-pointer ${!salHistoryTab && "border-b-2 border-green-500 text-green-500"}`}
              onClick={() => setSalHistoryTab(false)}>
                Staff Attendance
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 w-32 text-gray-900 cursor-pointer ml-auto"
                onClick={() => navigate("/finance/staffSalary/paySalary")}
                >
                  Pay Salary
                </button>
            </div>
            <div>
              <div className="flex items-center justify-between py-1 bg-white">
                <div className="relative w-88">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-1 focus:outline-none"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="start-date">Start Date</label>
                  <input
                    type="date"
                    id="start-date"
                    className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="end-date">End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {
              salHistoryTab ? <SalTable /> : <AttendanceTable />
            }

          </div>
        </div>
      </Layout>
    </>
  )
}

