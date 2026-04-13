import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminTable from "./AdminTable";
import { smsApi } from "../../services/smsApi";

const emptyEditState = {
  id: "",
  username: "",
  fullName: "",
  email: "",
  password: "",
  role: "",
  status: "Active",
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

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    if (!text) {
      return admins;
    }

    return admins.filter((entry) => {
      const username = String(entry.username || "").toLowerCase();
      const fullName = String(entry.fullName || "").toLowerCase();
      const email = String(entry.email || "").toLowerCase();
      const role = String(entry.role || "").toLowerCase();

      return (
        username.includes(text) || fullName.includes(text) || email.includes(text) || role.includes(text)
      );
    });
  }, [admins, searchTerm]);

  async function handleView(adminUser) {
    setErrorMessage("");

    try {
      const fresh = await smsApi.getAdminUser(adminUser.id);
      setViewAdmin(fresh);
    } catch {
      setViewAdmin(adminUser);
    }
  }

  function handleEdit(adminUser) {
    setEditAdmin({
      id: adminUser.id,
      username: adminUser.username || "",
      fullName: adminUser.fullName || "",
      email: adminUser.email || "",
      password: "",
      role: adminUser.role || "",
      status: adminUser.status || "Active",
    });
    setIsEditOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!editAdmin.username || !editAdmin.fullName || !editAdmin.email || !editAdmin.role || !editAdmin.status) {
      setErrorMessage("Fill all admin user fields before saving.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const saved = await smsApi.updateAdminUser(editAdmin.id, editAdmin);

      setAdmins((prev) => prev.map((entry) => (entry.id === saved.id ? saved : entry)));
      setIsEditOpen(false);
      setEditAdmin(emptyEditState);
      setSuccessMessage("Admin user updated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to update admin user.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="Admin Users">
      <div className="min-h-screen relative">
        <div className="p-3 bg-white border border-gray-100">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">ADMIN USER</h1>
          </div>

          <div className="border-b border-gray-400 my-4" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-1">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-5 pr-10 py-1 rounded border border-gray-300 focus:outline-none"
              />
              <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer" />
            </div>

            <div>
              <button
                className="px-8 py-2 bg-green-600 rounded hover:bg-green-500 w-full text-gray-800 cursor-pointer"
                onClick={() => navigate("/admin-users/new")}
              >
                + New User
              </button>
            </div>
          </div>

          {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600 mt-4">{successMessage}</p>}
          {isLoading ? (
            <div className="py-10 text-sm text-gray-500">Loading admin users...</div>
          ) : (
            <AdminTable admin={filteredAdmins} onView={handleView} onEdit={handleEdit} />
          )}
        </div>

        {viewAdmin && (
          <ModalShell title="Admin User Details" onClose={() => setViewAdmin(null)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <Detail label="Username" value={viewAdmin.username} />
              <Detail label="Full Name" value={viewAdmin.fullName} />
              <Detail label="Email" value={viewAdmin.email} />
              <Detail label="Role" value={viewAdmin.role} />
              <Detail label="Status" value={viewAdmin.status} />
              <Detail
                label="Modules"
                value={Object.entries(viewAdmin.permissions || {})
                  .filter(([, allowed]) => Boolean(allowed))
                  .map(([moduleName]) => moduleName)
                  .join(", ") || "No module access"}
              />
            </div>
          </ModalShell>
        )}

        {isEditOpen && (
          <ModalShell title="Edit Admin User" onClose={() => setIsEditOpen(false)}>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="User Name"
                  name="username"
                  value={editAdmin.username}
                  onChange={handleEditChange}
                  placeholder="User name"
                />
                <Field
                  label="Full Name"
                  name="fullName"
                  value={editAdmin.fullName}
                  onChange={handleEditChange}
                  placeholder="Full name"
                />
                <Field
                  label="Email"
                  name="email"
                  value={editAdmin.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  type="email"
                />
                <Field
                  label="Reset Password"
                  name="password"
                  value={editAdmin.password}
                  onChange={handleEditChange}
                  placeholder="Leave blank to keep current password"
                  type="password"
                />
                <Field
                  label="Role"
                  name="role"
                  value={editAdmin.role}
                  onChange={handleEditChange}
                  placeholder="Role"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={editAdmin.status}
                  onChange={handleEditChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </div>
    </Layout>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

ModalShell.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};

function Detail({ label, value }) {
  return (
    <div className="rounded-md border border-gray-200 px-4 py-3 bg-gray-50">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900 break-words">{value || "-"}</p>
    </div>
  );
}

Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

Detail.defaultProps = {
  value: "",
};
