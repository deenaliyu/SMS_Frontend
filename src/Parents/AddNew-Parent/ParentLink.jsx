import { useState } from "react";
import { Bell, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { clearParentDraft, getParentDraft, saveParentDraft } from "../../utils/parentDraft";
import { getProfileAvatar } from "../../utils/profileAvatar";

const studentOptions = [
  "1 Student",
  "2 Students",
  "3 Students",
  "4 Students",
  "5 Students",
  "6 Students",
  "7 Students",
  "8 Students",
  "9 Students",
  "10+ Students",
];

const getInitialFormData = () => {
  const draft = getParentDraft();

  return {
    numberOfStudents: draft.numberOfStudents || "",
    linkedStudentIds: Array.isArray(draft.linkedStudentIds) ? draft.linkedStudentIds : [],
  };
};

function buildParentPayload(draft) {
  const numberOfStudents = String(draft.numberOfStudents || "").trim();
  const studentCountMatch = numberOfStudents.match(/\d+/);
  const students = studentCountMatch ? Number(studentCountMatch[0]) : 0;

  return {
    id: draft.id || Date.now(),
    title: draft.title,
    firstName: draft.firstName,
    middleName: draft.middleName,
    lastName: draft.lastName,
    name: [draft.title, draft.firstName, draft.middleName, draft.lastName].filter(Boolean).join(" "),
    dateOfBirth: draft.dateOfBirth,
    gender: draft.gender,
    mobileNumber: draft.mobileNumber,
    mobile: draft.mobileNumber,
    email: String(draft.email || "").trim().toLowerCase(),
    educationalQualification: draft.educationalQualification,
    occupation: draft.occupation,
    annualIncome: draft.annualIncome,
    state: draft.state,
    lga: draft.lga,
    address: draft.address,
    username: draft.username,
    password: draft.password,
    repeatPassword: draft.repeatPassword,
    numberOfStudents,
    students,
    linkedStudentIds: Array.isArray(draft.linkedStudentIds) ? draft.linkedStudentIds : [],
  };
}

const StudentWardDetails = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [formData, setFormData] = useState(getInitialFormData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("Parent added successfully.");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const selectOption = (value) => {
    handleInputChange("numberOfStudents", value);
    setDropdownOpen(false);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setStudentId("");
  };

  const handleLinkStudentSubmit = () => {
    const trimmed = studentId.trim();

    if (!trimmed) {
      return;
    }

    const nextIds = Array.from(new Set([...formData.linkedStudentIds, trimmed]));
    setFormData((prev) => ({ ...prev, linkedStudentIds: nextIds }));
    handleCloseLinkModal();
  };

  const handleNext = async () => {
    if (!formData.numberOfStudents) {
      setErrorMessage("Please select number of students/wards.");
      return;
    }

    const draft = saveParentDraft(formData);
    const payload = buildParentPayload(draft);

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createParent(payload);
      clearParentDraft();
      setSuccessMessage("Parent added and saved successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.message || "Unable to add parent to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeTab="Parents">
      <div className="flex min-h-screen bg-gray-50">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 lg:ml-0 ${showLinkModal || showSuccessModal ? "blur-sm" : ""}`}>
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                  <div className="w-5 h-5 flex flex-col justify-between">
                    <div className="w-full h-0.5 bg-gray-600"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                  </div>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Parent</h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1">
                  <img src={getProfileAvatar("School Admin", "Admin")} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  <div className="text-sm hidden sm:block">
                    <div className="font-medium text-gray-900">Danlomi Sule</div>
                    <div className="text-gray-500">Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span className="text-gray-900 font-medium">Add New Parent</span>
            </nav>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Student/Ward Details</h3>

                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">How Many Students/Wards Do you have?</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDropdownOpen((prev) => !prev)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
                        >
                          <span className={formData.numberOfStudents ? "text-gray-900" : "text-gray-500"}>
                            {formData.numberOfStudents || "Select--"}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {dropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {studentOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => selectOption(option)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:ml-4">
                      <button
                        onClick={() => setShowLinkModal(true)}
                        className="w-full lg:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Link Student/Ward
                      </button>
                    </div>
                  </div>

                  {formData.linkedStudentIds.length > 0 && (
                    <div className="p-3 border rounded-md bg-gray-50">
                      <p className="text-sm text-gray-700 font-medium">Linked Student IDs:</p>
                      <p className="text-sm text-gray-600">{formData.linkedStudentIds.join(", ")}</p>
                    </div>
                  )}
                </div>

                {errorMessage && <p className="text-red-600 text-sm mt-5">{errorMessage}</p>}

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/parents/new/login")}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : "Finish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Input Student ID Number</h2>
                <button onClick={handleCloseLinkModal} className="p-1 rounded-md hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Id Number</label>
                  <input
                    type="text"
                    placeholder="Id Number"
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  onClick={handleLinkStudentSubmit}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Link Student
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">Parent saved!</h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{successMessage}</p>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setErrorMessage("");
                  navigate("/parents");
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
              >
                Back To Parent List
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentWardDetails;
