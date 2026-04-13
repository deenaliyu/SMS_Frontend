import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Landmark, UserRoundCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { smsApi } from "../../services/smsApi";

function StatCard({ label, value, color = "text-gray-900" }) {
  return (
    <div className="border border-gray-200 rounded-md bg-white p-4">
      <div className="flex flex-col gap-2">
        <Landmark className="w-9 h-9 p-2 border-2 border-purple-700 rounded-full text-purple-700" />
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`font-bold text-xl ${color}`}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

function QuickLink({ label, onClick }) {
  return (
    <div
      className="flex-1 border border-green-400 rounded-sm p-3 cursor-pointer hover:bg-green-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center justify-center">
        <UserRoundCheck className="w-9 h-9 bg-green-200 p-2 border-2 border-green-600 rounded-full text-green-600" />
        <p className="text-gray-800 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const [invoices, payments] = await Promise.all([
          smsApi.listInvoices(),
          smsApi.listFinancePayments(),
        ]);

        if (!active) return;

        const paidInvoices = invoices.filter(
          (i) => String(i.status || "").toLowerCase() === "paid",
        );
        const unpaidInvoices = invoices.filter(
          (i) => String(i.status || "").toLowerCase() === "unpaid",
        );
        const cancelledInvoices = invoices.filter(
          (i) => String(i.status || "").toLowerCase() === "cancelled",
        );

        const totalRevenue = paidInvoices.reduce((sum, i) => {
          const amount = parseFloat(String(i.amount || "0").replace(/[^0-9.]/g, ""));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const upcomingPayroll = payments.reduce((sum, p) => {
          const net = parseFloat(String(p.netSalary || "0").replace(/[^0-9.]/g, ""));
          return sum + (isNaN(net) ? 0 : net);
        }, 0);

        const pendingPayment = unpaidInvoices.reduce((sum, i) => {
          const amount = parseFloat(String(i.amount || "0").replace(/[^0-9.]/g, ""));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        setStats({
          totalRevenue,
          pendingPayment,
          upcomingPayroll,
          allInvoices: invoices.length,
          paidInvoices: paidInvoices.length,
          unpaidInvoices: unpaidInvoices.length,
          cancelledInvoices: cancelledInvoices.length,
          expenses: upcomingPayroll,
        });
      } catch {
        // Stats not critical; silently fail
      }
    }

    loadStats();
    return () => { active = false; };
  }, []);

  function fmt(amount) {
    if (amount == null) return "—";
    return `₦${Number(amount).toLocaleString("en-NG")}`;
  }

  const overview = stats
    ? [
        { label: "Total Revenue", value: fmt(stats.totalRevenue) },
        { label: "Expenses", value: fmt(stats.expenses) },
        { label: "Pending Payment", value: fmt(stats.pendingPayment) },
        { label: "Upcoming Payroll", value: fmt(stats.upcomingPayroll) },
        { label: "All Invoices", value: stats.allInvoices },
        { label: "Paid Invoices", value: stats.paidInvoices },
        { label: "Unpaid Invoices", value: stats.unpaidInvoices },
        { label: "Cancelled Invoices", value: stats.cancelledInvoices },
      ]
    : [];

  return (
    <Layout activeTab="Finance">
      <div className="min-h-screen space-y-6">
        {/* Header */}
        <div className="bg-white flex justify-between items-center p-4 rounded-md">
          <h1 className="text-2xl font-bold">Financial Management</h1>
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-gray-800 font-medium cursor-pointer"
            onClick={() => navigate("/finance/generate-invoice")}
          >
            Generate Invoice
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-4 rounded-md">
          <h2 className="font-semibold text-gray-700 mb-3">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <QuickLink label="Payment History" onClick={() => navigate("/finance/payment-history")} />
            <QuickLink label="Staff Salaries" onClick={() => navigate("/finance/staff-salary")} />
            <QuickLink label="Invoices" onClick={() => navigate("/finance/invoices")} />
            <QuickLink label="Generate Invoice" onClick={() => navigate("/finance/generate-invoice")} />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Overview Stats */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Overview</h2>
          {overview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {overview.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Total Revenue", "Expenses", "Pending Payment", "Upcoming Payroll", "All Invoices", "Paid Invoices", "Unpaid Invoices", "Cancelled Invoices"].map((label) => (
                <StatCard key={label} label={label} value="Loading..." />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}