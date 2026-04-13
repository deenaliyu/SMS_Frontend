import { ArrowDown, SquarePen } from "lucide-react";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

export default function AdminTable({ admin, onView, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const numberOfPages = Math.max(1, Math.ceil(admin.length / itemsPerPage));

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return admin.slice(indexOfFirstItem, indexOfLastItem);
  }, [admin, currentPage]);

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
    <div className="border border-gray-100 p-1 bg-white rounded-t-md mt-4">
      <table className="w-full border-collapse border border-gray-100 m-0 rounded-t-md">
        <thead>
          <tr className="border border-gray-100">
            <th className="text-left p-2">
              <div className="text-xs font-bold flex items-center gap-1">
                <p>S/N </p>
                <ArrowDown className="w-4 h-4" />
              </div>
            </th>
            <th className="text-center text-xs p-2 font-bold">User Name</th>
            <th className="text-center text-xs p-2 font-bold">Full Name</th>
            <th className="text-center text-xs p-2 font-bold">Email</th>
            <th className="text-center text-xs p-2 font-bold">Role</th>
            <th className="text-center text-xs p-2 font-bold">Status</th>
            <th className="text-center text-xs p-2 font-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-10 text-sm text-center text-gray-500">
                No admin users found.
              </td>
            </tr>
          ) : (
            currentItems.map((adminItem, index) => (
              <tr key={adminItem.id} className="border even:bg-gray-100">
                <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white border-l-gray-100">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white">{adminItem.username}</td>

                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{adminItem.fullName}</td>

                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{adminItem.email}</td>

                <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">{adminItem.role}</td>

                <td className="border border-white text-center text-xs">
                  <span
                    className={`px-2 py-1 rounded-xl ${
                      adminItem.status === "Active"
                        ? "text-green-500 bg-green-100"
                        : "text-red-500 bg-red-100"
                    }`}
                  >
                    {adminItem.status}
                  </span>
                </td>

                <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white border-r-gray-100">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      type="button"
                      className="text-gray-700 hover:text-green-600 cursor-pointer"
                      onClick={() => onEdit(adminItem)}
                    >
                      <SquarePen className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="text-green-500 border border-green-500 rounded-md hover:bg-green-500 hover:text-white py-1 px-4 cursor-pointer"
                      onClick={() => onView(adminItem)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="border border-gray-100 m-0 p-1 rounded-b-md flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <button
            className="py-1 px-4 text-green-500 border border-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer disabled:opacity-50"
            onClick={handlePreviousClick}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="py-1 px-4 text-green-500 border border-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer disabled:opacity-50"
            onClick={handleNextClick}
            disabled={currentPage === numberOfPages}
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

AdminTable.propTypes = {
  admin: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      username: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
