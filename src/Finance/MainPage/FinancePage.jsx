import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { PageHeader, StatCard, Spinner } from "../../components/ui/index.jsx";
import { Landmark, Receipt, Clock, TrendingUp, FileCheck, FileX, FileMinus, Wallet } from "lucide-react";

const QUICK_LINKS = [
  { label: "Payment History", path: "/finance/payment-history" },
  { label: "Staff Salaries",  path: "/finance/staff-salary" },
  { label: "Invoices",        path: "/finance/invoices" },
  { label: "Generate Invoice",path: "/finance/generate-invoice" },
];

const STAT_META = [
  { key: "totalRevenue",      label: "Total Revenue",      icon: TrendingUp, colorIndex: 0, isMoney: true },
  { key: "expenses",          label: "Total Expenses",     icon: Wallet,     colorIndex: 4, isMoney: true },
  { key: "pendingPayment",    label: "Pending Payments",   icon: Clock,      colorIndex: 2, isMoney: true },
  { key: "upcomingPayroll",   label: "Upcoming Payroll",   icon: Landmark,   colorIndex: 1, isMoney: true },
  { key: "allInvoices",       label: "All Invoices",       icon: Receipt,    colorIndex: 3, isMoney: false },
  { key: "paidInvoices",      label: "Paid Invoices",      icon: FileCheck,  colorIndex: 0, isMoney: false },
  { key: "unpaidInvoices",    label: "Unpaid Invoices",    icon: FileMinus,  colorIndex: 2, isMoney: false },
  { key: "cancelledInvoices", label: "Cancelled Invoices", icon: FileX,      colorIndex: 4, isMoney: false },
];

function fmt(amount) { return "\u20A6" + Number(amount).toLocaleString("en-NG"); }

export default function FinancePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [invoices, payments] = await Promise.all([
          smsApi.listInvoices(),
          smsApi.listFinancePayments(),
        ]);
        if (!active) return;
        const byStatus = (s) => invoices.filter((i) => String(i.status || "").toLowerCase() === s);
        const sum = (list, field) => list.reduce((acc, item) => {
          const n = parseFloat(String(item[field] || "0").replace(/[^0-9.]/g, ""));
          return acc + (isNaN(n) ? 0 : n);
        }, 0);
        const paidList = byStatus("paid");
        const unpaidList = byStatus("unpaid");
        const upcomingPayroll = sum(payments, "netSalary");
        setStats({
          totalRevenue:      sum(paidList, "amount"),
          expenses:          upcomingPayroll,
          pendingPayment:    sum(unpaidList, "amount"),
          upcomingPayroll,
          allInvoices:       invoices.length,
          paidInvoices:      paidList.length,
          unpaidInvoices:    unpaidList.length,
          cancelledInvoices: byStatus("cancelled").length,
        });
      } catch { /* stats not critical */ }
      finally { if (active) setIsLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <Layout activeTab="Finance">
      <PageHeader
        title="Financial Management"
        subtitle="Revenue, invoices and payroll overview"
        action={
          <button type="button" onClick={() => navigate("/finance/generate-invoice")}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 cursor-pointer">
            + Generate Invoice
          </button>
        }
      />

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {QUICK_LINKS.map(({ label, path }) => (
          <button key={path} type="button" onClick={() => navigate(path)}
            className="border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400 text-green-700 font-semibold py-3.5 rounded-2xl cursor-pointer transition-all text-sm">
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div>
      ) : (
        <>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Revenue & Expenses</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_META.filter((m) => m.isMoney).map((m) => (
              <StatCard key={m.key} icon={m.icon} label={m.label} value={stats ? fmt(stats[m.key]) : "—"} colorIndex={m.colorIndex} />
            ))}
          </div>

          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Invoice Summary</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_META.filter((m) => !m.isMoney).map((m) => (
              <StatCard key={m.key} icon={m.icon} label={m.label} value={stats ? stats[m.key] : "—"} colorIndex={m.colorIndex} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}