import PropTypes from "prop-types";
import { ArrowDown } from "lucide-react";
import { useMemo, useState } from "react";

export default function InvoiceTable({ invoices }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const numberOfPages = Math.max(1, Math.ceil(invoices.length / itemsPerPage));

  const paginatedInvoices = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return invoices.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, invoices]);

  function handleNextClick() {
    if (currentPage < numberOfPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function handlePreviousClick() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  return (
    <div className="mt-5">
      <table className="w-full border-collapse border border-gray-100 m-0 rounded-t-md">
        <thead>
          <tr className="border border-gray-100">
            <th className="text-left p-2">
              <div className="text-xs font-bold flex items-center gap-1">
                <p>S/N</p>
                <ArrowDown className="w-4 h-4" />
              </div>
            </th>
            <th className="text-center text-xs p-2 font-bold">Invoice ID</th>
            <th className="text-center text-xs p-2 font-bold">Invoiced To (Parent)</th>
            <th className="text-center text-xs p-2 font-bold">Student</th>
            <th className="text-center text-xs p-2 font-bold">Due Date</th>
            <th className="text-center text-xs p-2 font-bold">Amount</th>
            <th className="text-center text-xs p-2 font-bold">Created On</th>
            <th className="text-center text-xs p-2 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                No invoices found.
              </td>
            </tr>
          ) : (
            paginatedInvoices.map((data, index) => (
              <tr key={data.id || data.invoiceId || index} className={`border ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white border-l-gray-100">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white">
                  {data.invoiceId || "-"}
                </td>
                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                  {data.parentName || data.name || "-"}
                </td>
                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                  {data.studentName || "-"}
                </td>
                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                  {data.dueDate ? new Date(data.dueDate).toLocaleDateString() : "-"}
                </td>
                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                  {data.amount || "-"}
                </td>
                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                  {data.createdOn ? new Date(data.createdOn).toLocaleDateString() : "-"}
                </td>
                <td className="border border-white text-center text-xs">
                  <span
                    className={`px-2 py-1 rounded-xl ${
                      String(data.status || "").toLowerCase() === "paid" && "text-green-500 bg-green-100"
                    } ${
                      String(data.status || "").toLowerCase() === "overdue" && "text-yellow-600 bg-yellow-100"
                    } ${
                      String(data.status || "").toLowerCase() === "cancelled" && "text-red-500 bg-red-100"
                    } ${
                      String(data.status || "").toLowerCase() === "unpaid" && "text-blue-500 bg-blue-100"
                    }`}
                  >
                    {data.status || "Unpaid"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="border border-gray-100 m-0 rounded-b-md flex items-center justify-between p-5">
        <div className="flex gap-3 items-center">
          <button
            className="py-1 text-sm px-3 text-green-500 border border-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer"
            onClick={handlePreviousClick}
          >
            Previous
          </button>
          <button
            className="py-1 text-sm px-3 text-green-500 border border-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
        <div>
          <p className="text-gray-500 text-xs">{`page ${currentPage} of ${numberOfPages}`}</p>
        </div>
      </div>
    </div>
  );
}

InvoiceTable.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
};
