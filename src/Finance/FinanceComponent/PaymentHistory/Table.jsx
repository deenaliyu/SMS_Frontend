import { ArrowDown } from "lucide-react";
import {useState} from "react";

import {paymentData} from "../../data"

export default function Table() {


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const numberOfPages = Math.ceil(paymentData.length / itemsPerPage);

  function handleNextClick() {
    if(currentPage < numberOfPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }
  function handlePreviousClick() {
    if(currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }


  return(
    <>
    <div className="mt-5">
      <table className="w-full border-collapse border border-gray-100 m-0 rounded-t-md">
        <thead>
          <tr className="border border-gray-100">
            <th className="text-left p-2">
              <div className="text-xs font-bold flex items-center gap-1">
                <p>S/N </p>
                <ArrowDown className="w-4 h-4"/>
              </div>
            </th>
            <th className="text-center text-xs  p-2 font-bold">Student Id</th>
            <th className="text-center text-xs  p-2 font-bold">Student Name</th>
            <th className="text-center text-xs  p-2 font-bold">Class</th>
            <th className="text-center text-xs  p-2 font-bold">Payment Date</th>
            <th className="text-center text-xs  p-2 font-bold">Amount</th>
            <th className="text-center text-xs  p-2 font-bold">Payment Method</th>
            <th className="text-center text-xs  p-2 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.slice(indexOfFirstItem, indexOfLastItem).map((data, index) => (
            <tr
              key={data.id}
              className={`border ${
                index % 2 === 0 && "bg-gray-100"
              }`}
            >
              <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white border-l-gray-100">
                {data.id}
              </td>
              <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white">
                {data.studentId}
              </td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                {data.name}
              </td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                {data.class}
              </td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                {data.paymentDate}
              </td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                {data.amountPaid}
              </td>
              <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                {data.paymentMethod}
              </td>
              <td className={`border border-white text-center text-xs

              `}>
                <span className={`px-2 py-1 rounded-xl
                                ${data.status === "Paid" && "text-green-500 bg-green-100"}
                                ${data.status === "Unpaid" && "text-red-500 bg-red-100"}`}>
                  {data.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border border-gray-100 m-0 p-1 rounded-b-md flex items-center justify-between" >
        <div className="flex gap-3 items-center">
          <button className="py-1 text-sm px-3 text-green-500 border border-green-500 rounded-md  hover:bg-green-500 hover:text-white cursor-pointer" onClick={handlePreviousClick}>Previous</button>
          <button className="py-1 text-sm px-3 text-green-500 border border-green-500 rounded-md  hover:bg-green-500 hover:text-white cursor-pointer" onClick={handleNextClick}>Next</button>
        </div>
        <div>
          <p className="text-gray-500 text-xs">{`page ${currentPage} of ${numberOfPages}`}</p>
        </div>
      </div>
      </div>
    </>
  )
}

