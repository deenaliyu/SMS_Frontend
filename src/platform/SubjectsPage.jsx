import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Pencil, Plus, Search, X } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi";

const initialFormState = {
  id: "",
  code: "",
  name: "",
  department: "",
  classes: "",
  teachers: "0",
};

export default function SubjectsPage() {
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  async function loadSubjects() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await smsApi.listSubjects();
      setSubjects(Array.isArray(response) ? response : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load subjects.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return subjects;

    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(text) ||
        subject.code.toLowerCase().includes(text) ||
        subject.department.toLowerCase().includes(text),
    );
  }, [query, subjects]);

  function openCreateModal() {
    setFormData(initialFormState);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  }

  function openEditModal(subject) {
    setFormData({
      id: subject.id,
      code: subject.code || "",
      name: subject.name || "",
      department: subject.department || "",
      classes: subject.classes || "",
      teachers: String(subject.teachers ?? 0),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.code || !formData.name || !formData.department || !formData.classes) {
      setErrorMessage("Fill all required subject fields before saving.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      teachers: Number(formData.teachers || 0),
    };

    try {
      const saved = formData.id
        ? await smsApi.updateSubject(formData.id, payload)
        : await smsApi.createSubject(payload);

      setSubjects((prev) => {
        if (formData.id) {
          return prev.map((entry) => (entry.id === saved.id ? saved : entry));
        }

        return [saved, ...prev];
      });

      setSuccessMessage(formData.id ? "Subject updated successfully." : "Subject added successfully.");
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      setErrorMessage(error.message || "Unable to save subject.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="Subjects">
      <div className="space-y-6 relative">
        <section className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Academic Catalog</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Subjects</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage all subjects for your school platform.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="relative w-full md:w-96 mb-5">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subject"
              className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600 mb-4">{successMessage}</p>}

          {isLoading ? (
            <div className="py-10 text-sm text-gray-500">Loading subjects...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Classes</th>
                    <th className="px-4 py-3">Teachers</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-sm text-center text-gray-500">
                        No subjects found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center gap-2">
                            <BookOpenCheck className="w-4 h-4 text-green-600" />
                            {subject.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subject.code}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subject.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subject.classes}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subject.teachers}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => openEditModal(subject)}
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {formData.id ? "Edit Subject" : "Add Subject"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Subject Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Subject name"
                  />
                  <InputField
                    label="Code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="MTH101"
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Science"
                  />
                  <InputField
                    label="Classes"
                    name="classes"
                    value={formData.classes}
                    onChange={handleChange}
                    placeholder="JSS1 - SSS3"
                  />
                  <InputField
                    label="Teachers"
                    name="teachers"
                    type="number"
                    value={formData.teachers}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : formData.id ? "Save Changes" : "Add Subject"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
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

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};
