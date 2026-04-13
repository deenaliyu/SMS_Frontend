import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Grid3X3, List, Pencil, Search, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getAuthUser } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";

const initialEditForm = {
  name: "",
  gender: "",
  mobile: "",
  email: "",
  students: ""
};

export default function ParentsDashboard() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [editingParent, setEditingParent] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadParents() {
      try {
        const response = await smsApi.listParents();
        if (active) {
          setParents(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load parents.");
        }
      }
    }

    loadParents();

    return () => {
      active = false;
    };
  }, []);

  const welcomeName = authUser?.fullName || authUser?.username || "Parent";

  const filteredParents = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    if (!text) {
      return parents;
    }

    return parents.filter((parent) => {
      const name = String(parent.name || "").toLowerCase();
      const parentId = String(parent.parentId || "").toLowerCase();
      const email = String(parent.email || "").toLowerCase();

      return name.includes(text) || parentId.includes(text) || email.includes(text);
    });
  }, [parents, searchTerm]);

  const openEditModal = (parent) => {
    setEditingParent(parent);
    setEditForm({
      name: parent.name || "",
      gender: parent.gender || "",
      mobile: parent.mobile || "",
      email: parent.email || "",
      students: String(parent.students || "")
    });
    setErrorMessage("");
  };

  const closeEditModal = () => {
    setEditingParent(null);
    setEditForm(initialEditForm);
    setErrorMessage("");
  };

  const handleEditSubmit = async () => {
    if (!editingParent) {
      return;
    }

    if (!editForm.name.trim() || !editForm.mobile.trim() || !editForm.email.trim()) {
      setErrorMessage("Name, mobile and email are required.");
      return;
    }

    if (!/^\d{11}$/.test(editForm.mobile.trim())) {
      setErrorMessage("Mobile number must be exactly 11 digits.");
      return;
    }

    try {
      const updated = await smsApi.updateParent(editingParent.id, {
        ...editingParent,
        name: editForm.name.trim(),
        gender: editForm.gender,
        mobile: editForm.mobile.trim(),
        mobileNumber: editForm.mobile.trim(),
        email: editForm.email.trim().toLowerCase(),
        students: Number(editForm.students) || 0,
        numberOfStudents: `${Number(editForm.students) || 0} Students`
      });

      setParents((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
      closeEditModal();
    } catch (error) {
      setErrorMessage(error.message || "Unable to update parent.");
    }
  };

  const handleDeleteParent = async (parent) => {
    const shouldDelete = window.confirm(`Delete parent ${parent.name}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await smsApi.deleteParent(parent.id);
      setParents((prev) => prev.filter((entry) => entry.id !== parent.id));
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete parent.");
    }
  };

  const handleViewParent = (parent) => {
    navigate("/parents/profile", {
      state: {
        parent: parent
      }
    });
  };

  return (
    <Layout activeTab="Parents">
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Parents</h1>
          <p className="text-gray-600">Welcome, {welcomeName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 cursor-pointer ${viewMode === "table" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 cursor-pointer ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => navigate("/parents/new")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add New Parent
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}

            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">S/N</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Parent ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">No. Of Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParents.map((parent, index) => (
                      <tr key={parent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.parentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.gender}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.mobile}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{parent.students}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleViewParent(parent)}
                            >
                              <ExternalLink className="w-4 h-4" /> View
                            </button>
                            <button
                              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700"
                              onClick={() => openEditModal(parent)}
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteParent(parent)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredParents.map((parent) => (
                  <div key={parent.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                    <button className="w-full text-center" onClick={() => handleViewParent(parent)}>
                      <div className="flex flex-col items-center">
                        <img
                          src={parent.image || getProfileAvatar(parent.name, "Parent")}
                          alt={parent.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">{parent.name}</h3>
                        <span className="text-sm text-green-600 font-medium">Parent</span>
                      </div>
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button className="text-amber-600 hover:text-amber-700" onClick={() => openEditModal(parent)}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700" onClick={() => handleDeleteParent(parent)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredParents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">No parents found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingParent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Parent</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, gender: event.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Mobile</label>
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, mobile: event.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">No. Of Students</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.students}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, students: event.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {errorMessage && <p className="text-red-600 text-sm mt-3">{errorMessage}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded-md" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
