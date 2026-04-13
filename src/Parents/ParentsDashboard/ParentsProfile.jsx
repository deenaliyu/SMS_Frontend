import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, Mail, MapPin, Phone, User } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { getProfileAvatar } from "../../utils/profileAvatar";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-green-50">
          <Icon className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-sm text-gray-900 break-words">{value || "-"}</p>
        </div>
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string
};

InfoCard.defaultProps = {
  value: ""
};

export default function ParentProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const parentData = useMemo(() => location.state?.parent || null, [location.state]);

  if (!parentData) {
    return (
      <Layout activeTab="Parents">
        <div className="p-6">
          <p className="text-gray-700">Parent not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="Parents">
      <div className="p-4 sm:p-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate("/parents")} className="hover:text-gray-700">
            Parents
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Parent Profile</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={parentData.image || getProfileAvatar(parentData.name, "Parent")}
                  alt={parentData.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{parentData.name}</h2>
                  <p className="text-gray-600">{parentData.students} Student/Ward</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => navigate("/messaging", { state: { contactName: parentData.name } })}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Overview
              </button>
              <button
                onClick={() => setActiveTab("child")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "child"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Child/Ward
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payment"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment History
              </button>
            </nav>
          </div>

          {activeTab === "overview" && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <InfoCard icon={Mail} label="Email" value={parentData.email} />
                <InfoCard icon={Phone} label="Phone Number" value={parentData.mobile} />
                <InfoCard icon={MapPin} label="Address" value={parentData.address} />
                <InfoCard icon={Calendar} label="Date of Birth" value={parentData.dateOfBirth} />
                <InfoCard icon={User} label="Gender" value={parentData.gender} />
                <InfoCard icon={User} label="Parent ID" value={parentData.parentId} />
              </div>
            </div>
          )}

          {activeTab === "child" && (
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Child/Ward</h3>
              <p className="text-gray-700">Linked Student IDs: {parentData.linkedStudentIds?.join(", ") || "Not linked yet"}</p>
              <p className="text-gray-700 mt-2">Total Students/Wards: {parentData.students || 0}</p>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Payment History</h3>
              <p className="text-gray-600">Payment history for this parent will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
