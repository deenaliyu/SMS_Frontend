import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { teacherPayments } from "../../data";
import { smsApi } from "../../../services/smsApi";

export default function SalTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [payments, setPayments] = useState(teacherPayments);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        const response = await smsApi.listFinancePayments();
        if (active) {
          setPayments(Array.isArray(response) && response.length > 0 ? response : teacherPayments);
        }
      } catch {
        if (active) {
          setPayments(teacherPayments);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  const numberOfPages = Math.max(1, Math.ceil(payments.length / itemsPerPage));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
            <th className="text-center text-xs p-2 font-bold">Teacher ID</th>
            <th className="text-center text-xs p-2 font-bold">Name</th>
            <th className="text-center text-xs p-2 font-bold">Payment Date</th>
            <th className="text-center text-xs p-2 font-bold">Gross Amount</th>
            <th className="text-center text-xs p-2 font-bold">Deductions</th>
            <th className="text-center text-xs p-2 font-bold">Net Salary</th>
            <th className="text-center text-xs p-2 font-bold">Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.slice(indexOfFirstItem, indexOfLastItem).map((data, index) => (
            <tr key={`${data.id}-${index}`} className={`border ${index % 2 === 0 ? "bg-gray-100" : ""}`}>
              <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white border-l-gray-100">{indexOfFirstItem + index + 1}</td>
              <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white">{data.teacherId}</td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{data.name}</td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{data.paymentDate}</td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{data.grossAmount}</td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{data.deductions}</td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{data.netSalary}</td>
              <td className="border border-white text-center text-xs">
                <span
                  className={`px-2 py-1 rounded-xl ${
                    data.status === "Paid"
                      ? "text-green-500 bg-green-100"
                      : data.status === "Unpaid"
                        ? "text-red-500 bg-red-100"
                        : "text-yellow-500 bg-yellow-100"
                  }`}
                >
                  {data.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border border-gray-100 m-0 p-1 rounded-b-md flex items-center justify-between">
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
