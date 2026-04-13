import { useEffect, useMemo, useState } from "react";
import { Bell, Search, Grid3X3, List, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getProfileAvatar } from "../../utils/profileAvatar";

export default function TeachersDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [teachersData, setTeachersData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadTeachers() {
      try {
        const response = await smsApi.listTeachers();
        if (active) {
          setTeachersData(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load teachers.");
        }
      }
    }

    loadTeachers();

    return () => {
      active = false;
    };
  }, []);

  const filteredTeachers = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    if (!text) {
      return teachersData;
    }

    return teachersData.filter((teacher) => {
      const name = String(teacher.name || "").toLowerCase();
      const teacherId = String(teacher.teacherId || "").toLowerCase();
      const email = String(teacher.email || "").toLowerCase();

      return name.includes(text) || teacherId.includes(text) || email.includes(text);
    });
  }, [searchTerm, teachersData]);

  return (
    <Layout activeTab="Teachers">
      <main className="w-full">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="flex items-center gap-2">
                <img src={getProfileAvatar("School Admin", "Admin")} alt="Profile" className="w-8 h-8 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Danlomi Sule</div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Teachers</h2>
            </div>

            <div className="px-6 py-4 border-b flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${viewMode === "table" ? "bg-gray-100" : ""} cursor-pointer`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/teachers/profile")}
                    className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  Export CSV
                </button>
                <button
                  onClick={() => navigate("/teachers/add")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  Add New Teacher
                </button>
              </div>
            </div>

            {errorMessage && <p className="px-6 pt-4 text-sm text-red-600">{errorMessage}</p>}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">S/N</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Teacher ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher.id || teacher.teacherId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.teacherId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.gender}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.mobile}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.class}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{teacher.address}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                          <ExternalLink className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td colSpan="10" className="px-6 py-8 text-center text-sm text-gray-500">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-500">Page {currentPage} of 1</div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
