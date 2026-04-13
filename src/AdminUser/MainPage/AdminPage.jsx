import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import AdminTable from "./AdminTable";
import { smsApi } from "../../services/smsApi";
import {
  PageHeader,
  SearchBar,
  ModalShell,
  Badge,
  Btn,
  FormField,
  Input,
  Select,
  Spinner,
  EmptyState,
} from "../../components/ui/index.jsx";

const emptyEditState = {
  id: "",
  username: "",
  fullName: "",
  email: "",
  password: "",
  role: "",
  status: "Active",
};

function DetailRow({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium break-words">{value || "—"}</p>
    </div>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default function AdminUser() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [viewAdmin, setViewAdmin] = useState(null);
  const [editAdmin, setEditAdmin] = useState(emptyEditState);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function loadAdmins() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await smsApi.listAdminUsers();
      setAdmins(Array.isArray(response) ? response : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load admin users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadAdmins(); }, []);

  const filteredAdmins = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();
    if (!text) return admins;
    return admins.filter((e) =>
      [e.username, e.fullName, e.email, e.role].some((v) =>
        String(v || "").toLowerCase().includes(text),
      ),
    );
  }, [admins, searchTerm]);

  async function handleView(user) {
    try {
      const fresh = await smsApi.getAdminUser(user.id);
      setViewAdmin(fresh || user);
    } catch {
      setViewAdmin(user);
    }
  }

  function handleEdit(user) {
    setEditAdmin({
      id: user.id,
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
      status: user.status || "Active",
    });
    setIsEditOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditAdmin((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editAdmin.username || !editAdmin.fullName || !editAdmin.email || !editAdmin.role || !editAdmin.status) {
      setErrorMessage("Please fill all fields before saving.");
      return;
    }
    setIsSaving(true);
    setErrorMessage("");
    try {
      const saved = await smsApi.updateAdminUser(editAdmin.id, editAdmin);
      setAdmins((prev) => prev.map((u) => (u.id === (saved?.id ?? editAdmin.id) ? (saved || editAdmin) : u)));
      setIsEditOpen(false);
      setEditAdmin(emptyEditState);
      setSuccessMessage("Admin user updated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to update admin user.");
    } finally {
      setIsSaving(false);
    }
  }

  // Summary counts
  const activeCount = admins.filter((u) => u.status === "Active").length;
  const inactiveCount = admins.filter((u) => u.status === "Inactive").length;

  return (
    <Layout activeTab="Admin Users">
      <PageHeader
        title="Admin Users"
        subtitle="Manage system administrators and their access permissions"
        breadcrumbs={[{ label: "Dashboard", onClick: () => navigate("/dashboard") }, { label: "Admin Users" }]}
        action={
          <Btn onClick={() => navigate("/admin-users/new")} className="gap-1.5">
            <Plus className="w-4 h-4" /> New User
          </Btn>
        }
      />

      {/* Summary pills */}
      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-500">Total:</span>
          <span className="font-bold text-gray-800">{admins.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-500">Active:</span>
          <span className="font-bold text-gray-800">{activeCount}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-gray-500">Inactive:</span>
          <span className="font-bold text-gray-800">{inactiveCount}</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, role…"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{successMessage}</div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Spinner label="Loading admin users…" />
        </div>
      ) : (
        <AdminTable admin={filteredAdmins} onView={handleView} onEdit={handleEdit} />
      )}

      {/* View Modal */}
      {viewAdmin && (
        <ModalShell title="Admin User Details" onClose={() => setViewAdmin(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow label="Username" value={viewAdmin.username} />
            <DetailRow label="Full Name" value={viewAdmin.fullName} />
            <DetailRow label="Email" value={viewAdmin.email} />
            <DetailRow label="Role" value={viewAdmin.role} />
            <DetailRow label="Status" value={viewAdmin.status} />
            <DetailRow
              label="Module Access"
              value={
                Object.entries(viewAdmin.permissions || {})
                  .filter(([, v]) => Boolean(v))
                  .map(([k]) => k)
                  .join(", ") || "No module access"
              }
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setViewAdmin(null)}>Close</Btn>
            <Btn onClick={() => { setViewAdmin(null); handleEdit(viewAdmin); }}>Edit User</Btn>
          </div>
        </ModalShell>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <ModalShell title="Edit Admin User" onClose={() => setIsEditOpen(false)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Username" required>
                <Input name="username" value={editAdmin.username} onChange={handleEditChange} placeholder="Username" />
              </FormField>
              <FormField label="Full Name" required>
                <Input name="fullName" value={editAdmin.fullName} onChange={handleEditChange} placeholder="Full name" />
              </FormField>
              <FormField label="Email" required>
                <Input type="email" name="email" value={editAdmin.email} onChange={handleEditChange} placeholder="Email" />
              </FormField>
              <FormField label="Reset Password">
                <Input type="password" name="password" value={editAdmin.password} onChange={handleEditChange} placeholder="Leave blank to keep current" />
              </FormField>
              <FormField label="Role" required>
                <Input name="role" value={editAdmin.role} onChange={handleEditChange} placeholder="Role" />
              </FormField>
              <FormField label="Status" required>
                <Select name="status" value={editAdmin.status} onChange={handleEditChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormField>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Btn>
              <Btn type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save Changes"}
              </Btn>
            </div>
          </form>
        </ModalShell>
      )}
    </Layout>
  );
}