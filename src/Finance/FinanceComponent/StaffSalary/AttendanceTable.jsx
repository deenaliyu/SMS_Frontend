import { ArrowDown } from "lucide-react";
import {useState} from "react";

import {teacherAttendance} from "../../data"

export default function AttendanceTable() {


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const numberOfPages = Math.ceil(teacherAttendance.length / itemsPerPage);

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
          <th className="text-center text-xs p-2 font-bold">Teacher ID</th>
          <th className="text-center text-xs p-2 font-bold">Name </th>
          <th className="text-center text-xs p-2 font-bold">Days Present</th>
          <th className="text-center text-xs p-2 font-bold">Days Absent</th>
          <th className="text-center text-xs p-2 font-bold">Leave</th>
        </tr>
      </thead>
      <tbody>
        {teacherAttendance.slice(indexOfFirstItem, indexOfLastItem).map((data, index) => (
          <tr
            key={data.id}
            className={`border ${index % 2 === 0 && "bg-gray-100"}`}
          >
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.id}
            </td>
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.teacherId}
            </td>
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.name}
            </td>
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.daysPresent}
            </td>
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.daysAbsent}
            </td>
            <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white">
              {data.leave}
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

