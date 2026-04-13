import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import InvoiceTable from "./InvoiceTable";
import { smsApi } from "../../../services/smsApi";

export default function Invoices() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoices() {
      try {
        const response = await smsApi.listInvoices();
        if (active) {
          setInvoices(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load invoices.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadInvoices();

    return () => {
      active = false;
    };
  }, []);

  const filteredInvoices = useMemo(() => {
    const text = query.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const statusMatches = statusFilter === "all"
        || String(invoice.status || "").toLowerCase() === statusFilter;

      const textMatches = !text
        || [
          invoice.invoiceId,
          invoice.parentName,
          invoice.studentName,
          invoice.paymentFor,
        ].some((value) => String(value || "").toLowerCase().includes(text));

      return statusMatches && textMatches;
    });
  }, [invoices, query, statusFilter]);

  return (
    <Layout activeTab="Finance">
      <div className="min-h-screen">
        <div className="bg-white rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-2xl">Invoices</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-400 text-sm cursor-pointer" onClick={() => navigate("/finance")}>
                Finance
              </p>
              <p className="text-gray-400 text-sm">{">"}</p>
              <p className="font-medium text-sm">Invoices</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between py-1 bg-white">
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 focus:outline-none"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="payment-status">Payment Status</label>
              <select
                className="border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none"
                id="payment-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

          {isLoading ? (
            <div className="py-10 text-sm text-gray-500">Loading invoices...</div>
          ) : (
            <InvoiceTable invoices={filteredInvoices} />
          )}
        </div>
      </div>
    </Layout>
  );
}
