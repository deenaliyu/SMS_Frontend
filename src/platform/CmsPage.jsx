import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { FileText, Globe, LayoutPanelTop, Pencil, Plus, Search, X } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi";

const initialFormState = {
  id: "",
  title: "",
  slug: "",
  status: "Draft",
  content: "",
};

export default function CmsPage() {
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  async function loadPages() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await smsApi.listCmsPages();
      setPages(Array.isArray(response) ? response : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load CMS pages.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  const filteredPages = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return pages;
    }

    return pages.filter((page) =>
      [page.title, page.slug, page.status].some((value) => String(value || "").toLowerCase().includes(text))
    );
  }, [pages, query]);

  const publishedCount = useMemo(
    () => pages.filter((page) => String(page.status || "").toLowerCase() === "published").length,
    [pages]
  );

  function openCreateModal() {
    setFormData(initialFormState);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  }

  function openEditModal(page) {
    setFormData({
      id: page.id || "",
      title: page.title || "",
      slug: page.slug || "",
      status: page.status || "Draft",
      content: page.content || "",
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim()) {
      setErrorMessage("Page title and slug are required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      id: formData.id || undefined,
      name: formData.title,
      title: formData.title,
      slug: formData.slug,
      status: formData.status,
      content: formData.content,
      updatedAt: new Date().toISOString(),
    };

    try {
      const saved = formData.id
        ? await smsApi.updateCmsPage(formData.id, payload)
        : await smsApi.createCmsPage(payload);

      setPages((prev) => {
        if (formData.id) {
          return prev.map((entry) => (entry.id === saved.id ? saved : entry));
        }

        return [saved, ...prev];
      });

      setSuccessMessage(formData.id ? "CMS page updated successfully." : "CMS page created successfully.");
      setFormData(initialFormState);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Unable to save CMS page.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="CMS">
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Content Management</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">CMS Pages</h1>
            <p className="text-sm text-gray-600 mt-1">Manage website pages and public communication content.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Page
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat title="Total Pages" value={String(pages.length)} icon={LayoutPanelTop} />
          <Stat title="Published" value={String(publishedCount)} icon={Globe} />
          <Stat title="Drafts" value={String(Math.max(0, pages.length - publishedCount))} icon={FileText} />
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Website Pages</h2>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages"
                className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600 mb-4">{successMessage}</p>}

          {isLoading ? (
            <div className="py-10 text-sm text-gray-500">Loading CMS pages...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-sm text-center text-gray-500">
                        No CMS pages found.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{page.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{page.slug}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              String(page.status || "").toLowerCase() === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {page.status || "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => openEditModal(page)}
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
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {formData.id ? "Edit CMS Page" : "Create CMS Page"}
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
                  <InputField label="Page Title" name="title" value={formData.title} onChange={handleChange} />
                  <InputField label="Slug" name="slug" value={formData.slug} onChange={handleChange} />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none min-h-[180px]"
                    placeholder="Page content"
                  />
                </div>

                <div className="flex justify-end gap-3">
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
                    {isSaving ? "Saving..." : formData.id ? "Save Changes" : "Create Page"}
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

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="inline-flex items-center gap-2 text-sm text-gray-600">
        <Icon className="w-4 h-4" />
        {title}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}

Stat.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
