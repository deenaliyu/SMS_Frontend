import Layout from "../../components/Layout/Layout";
import { UserRoundCheck, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinancePage() {

  const navigate = useNavigate();

  const financeShortCut = [
    "Total Revenue", "Expenses", "Pending Payment", "Upcoming Payroll", "All Invoices", "Paid Invoices",
    "Unpaid Invoices", "Cancelled Invoices"
  ]

  return(
    <>
      <Layout activeTab = "Finance">
        <div className="min-h-screen">
          <div className="bg-white flex justify-between items-center p-3 mb-5">
              <div className="text-3xl font-bold">
                Financial Management
              </div>
              <div>
                <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 w-full text-gray-800 font-medium cursor-pointer"
                onClick={() => navigate("/finance/generateInvoice")}
                >
                  Generate Invoice
                </button>
              </div>
          </div>
          <div className="bg-white p-3">
            <h2 className="font-medium mb-3">Quick Links</h2>
            <div className="flex gap-3">
            <div className="flex-1 border border-green-400 rounded-sm p-3 cursor-pointer"
            onClick={() => navigate("/finance/paymentHistory")}
            >
                <div className="flex gap-2 items-center justify-center">
                  <UserRoundCheck className="w-9 h-9 bg-green-200 p-2 border-2 border-green-600 rounded-full text-green-600"/>
                  <p className="text-gray-800">Payment History</p>
                </div>
              </div>

              <div className="flex-1 border border-green-400 rounded-sm p-3 cursor-pointer"
              onClick={() => navigate("/finance/staffSalary")}>
                <div className="flex gap-2 items-center justify-center">
                  <UserRoundCheck className="w-9 h-9 bg-green-200 p-2 border-2 border-green-600 rounded-full text-green-600"/>
                  <p className="text-gray-800">Staff Salaries</p>
                </div>
              </div>
              <div className="flex-1 border border-green-400 rounded-sm p-3 cursor-pointer"
              onClick={() => navigate("/finance/invoice")}
              >
                <div className="flex gap-2 items-center justify-center">
                  <UserRoundCheck className="w-9 h-9 bg-green-200 p-2 border-2 border-green-600 rounded-full text-green-600"/>
                  <p className="text-gray-800">Invoices</p>
                </div>
              </div>
              <div className="flex-1 border border-green-400 rounded-sm p-3">
                <div className="flex gap-2 items-center justify-center">
                  <UserRoundCheck className="w-9 h-9 bg-green-200 p-2 border-2 border-green-600 rounded-full text-green-600"/>
                  <p className="text-gray-800">Fee Structure</p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-5 border border-gray-300"></div>

          <div>
            <h2 className="font-medium text-gray-800 mb-4">Overview</h2>
            <div className="grid grid-cols-4 gap-3">

            {
                financeShortCut.map((data, index) => (
                  <div className="border border-gray-200 rounded-md bg-white p-4" key={index}>
                    <div className="flex flex-col gap-2">
                      <Landmark className="w-9 h-9 bg-purle-100 p-2 border-2 border-purple-700 rounded-full" />
                      <p className="font-sm font-medium text-gray-600">{data}</p>
                      <p className="font-medium text-gray-900 text-xl">#130, 3000, 3000</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

