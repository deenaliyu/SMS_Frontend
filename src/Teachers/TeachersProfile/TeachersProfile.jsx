import { useEffect, useMemo, useState } from "react";
import { Search, Grid3X3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getProfileAvatar } from "../../utils/profileAvatar";

export default function TeachersProfile() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachersData, setTeachersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadTeachers() {
      try {
        const response = await smsApi.listTeachers();
        if (!active) {
          return;
        }

        setTeachersData(
          (Array.isArray(response) ? response : []).map((teacher, index) => ({
            id: teacher.id || index + 1,
            name: teacher.name,
            role: "Teacher",
            image: getProfileAvatar(teacher.name, "Teacher")
          }))
        );
      } catch {
        if (active) {
          setTeachersData([]);
        }
      }
    }

    loadTeachers();

    return () => {
      active = false;
    };
  }, []);

  const filteredTeachers = useMemo(
    () => teachersData.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, teachersData]
  );

  return (
    <Layout activeTab="Teachers">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teachers</h1>

          <div className="flex gap-3 relative top-[50px] items-center">
            <button
              onClick={() => navigate("/teachers")}
              className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>

            <button className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">Export CSV</button>

            <button
              onClick={() => navigate("/teachers/add")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            >
              Add New Teacher
            </button>
          </div>
        </div>

        <div className="mb-6 relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => navigate("/teachers/main-profile")}
              className="bg-white border rounded-lg p-4 text-center shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
              />
              <div className="font-medium text-gray-900">{teacher.name}</div>
              <div className="text-green-600 text-sm">{teacher.role}</div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
