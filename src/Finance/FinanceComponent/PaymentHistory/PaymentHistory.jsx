import Layout from "../../../components/Layout/Layout";
import { Search} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "./Table";

export default function PaymentHistory() {

  const navigate = useNavigate();

  return(
    <>
      <Layout activeTab = "Finance">
        <div className="min-h-screen">
          <div className="bg-white rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-2xl">Payment History</h1>
                <div className="flex gap-4 items-center">
                  <p className="text-gray-400 text-sm cursor-pointer"
                    onClick={() => navigate("/finance")}
                  >Finance</p>
                  <p className="text-gray-400 text-sm">{">"}</p>
                  <p className="font-medium text-sm">Payment History</p>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between py-1 bg-white">
                  <div className="relative w-80">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-1 focus:outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="session">Session</label>
                    <select className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none" id="session">
                      <option value="2024-2025">2024 / 2025</option>
                      <option value="2025-2026">2025 / 2026</option>
                      <option value="2026-2027">2026 / 2027</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="term">Term</label>
                    <select className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none" id="term">
                      <option value="1st">1st Term</option>
                      <option value="2nd">2nd Term</option>
                      <option value="3rd">3rd Term</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="Payment-status">Payment Status</label>
                    <select className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none" id="Payment-status">
                      <option value="all">All</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
            </div>
            <Table />
          </div>
        </div>
      </Layout>
    </>
  )
}

