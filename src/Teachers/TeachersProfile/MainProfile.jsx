import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Contact2 as IdCard,
} from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { getProfileAvatar } from "../../utils/profileAvatar";

export default function TeachersProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <Layout activeTab="Teachers">
      <div className="p-4 sm:p-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate("/TeachersDashboard")}
            className="hover:text-gray-700 cursor-pointer transition-colors"
          >
            Teachers
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Teachers Profile</span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={getProfileAvatar("Danjuma Danlami", "Teacher")}
                    alt="Danjuma Danlami"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Danjuma Danlami</h2>
                  <p className="text-gray-600">Teacher - 5 Years Experience</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                  Send Message
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">
                  Delete Profile
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 sm:px-6">
              {["overview", "class", "subject"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                    activeTab === tab
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab === "overview"
                    ? "Profile Overview"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <InfoCard icon={IdCard} iconColor="text-green-600" iconBg="bg-green-100" label="Teacher ID" value="WISCH547" />
                  <InfoCard icon={Mail} iconColor="text-blue-600" iconBg="bg-blue-100" label="Email" value="danjumadanlami@gmail.com" />
                  <InfoCard icon={Phone} iconColor="text-purple-600" iconBg="bg-purple-100" label="Phone Number" value="09132328374" />
                  <InfoCard icon={MapPin} iconColor="text-red-600" iconBg="bg-red-100" label="Address" value="123 quarters, Nassarawa GRA Kano" />
                  <InfoCard icon={Calendar} iconColor="text-orange-600" iconBg="bg-orange-100" label="Date of Birth" value="12 Jun 1995" />
                  <InfoCard icon={UserCheck} iconColor="text-indigo-600" iconBg="bg-indigo-100" label="Gender" value="Male" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Bio</h4>
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <p className="text-gray-700 leading-relaxed">
                      Danjuma Danlami is a dedicated and passionate science teacher with over a decade of experience in
                      the field of education. He holds a Bachelor&apos;s degree in Education, specializing in Science Education,
                      from Ahmadu Bello University...
                    </p>
                  </div>
                </div>
              </>
            )}

          {activeTab === "class" && (
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Class Information</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer max-w-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div className="relative z-10">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                        <circle cx="9" cy="7" r="2" fill="currentColor"/>
                        <circle cx="15" cy="7" r="2" fill="currentColor"/>
                        <circle cx="12" cy="7" r="2" fill="currentColor"/>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M3 21v-2a4 4 0 0 1 3-3.87" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Class: Grade 10 a</h4>
                  <p className="text-gray-600 font-medium">No. Students 100</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "subject" && (
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                      <div className="relative z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8 7h8" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 11h8" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 15h5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Subject Physics</h4>
                    <p className="text-gray-600 font-medium">No. Students 500</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                      <div className="relative z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8 7h8" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 11h8" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 15h5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Subject Biology</h4>
                    <p className="text-gray-600 font-medium">No. Students 500</p>
                  </div>
                </div>
              </div>
            </div>
          )}          
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ✅ InfoCard component
function InfoCard({ icon: Icon, iconColor, iconBg, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-sm text-gray-900 break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};


