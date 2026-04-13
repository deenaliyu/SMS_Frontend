import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { SquarePen } from "lucide-react";
import { Badge, Table, THead, Th, TBody, Tr, Td, Pagination, EmptyState } from "../../components/ui/index.jsx";
import { Users } from "lucide-react";

export default function AdminTable({ admin, onView, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const numberOfPages = Math.max(1, Math.ceil(admin.length / itemsPerPage));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return admin.slice(start, start + itemsPerPage);
  }, [admin, currentPage]);

  return (
    <div className="mt-4 rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
      <Table>
        <THead>
          <Th>#</Th>
          <Th>Username</Th>
          <Th>Full Name</Th>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th center>Status</Th>
          <Th center>Actions</Th>
        </THead>
        <TBody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <EmptyState icon={Users} title="No admin users found" description="Try adjusting your search query." />
              </td>
            </tr>
          ) : (
            currentItems.map((user, index) => (
              <Tr key={user.id}>
                <Td muted>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                <Td>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{user.username}</span>
                </Td>
                <Td>
                  <span className="font-medium text-gray-900">{user.fullName}</span>
                </Td>
                <Td muted>{user.email}</Td>
                <Td>
                  <span className="text-xs text-gray-600">{user.role}</span>
                </Td>
                <Td center>
                  <Badge label={user.status} />
                </Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="px-3 py-1 text-xs font-semibold text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={numberOfPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(numberOfPages, p + 1))}
      />
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