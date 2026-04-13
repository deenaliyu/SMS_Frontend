import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { getParentDraft, saveParentDraft } from "../../utils/parentDraft";
import PropTypes from "prop-types";

const titleOptions = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const genderOptions = ["Male", "Female", "Other"];

const getInitialFormData = () => {
  const draft = getParentDraft();

  return {
    title: draft.title || "Mr",
    firstName: draft.firstName || "",
    middleName: draft.middleName || "",
    lastName: draft.lastName || "",
    dateOfBirth: draft.dateOfBirth || "",
    gender: draft.gender || "",
    mobileNumber: draft.mobileNumber || "",
    email: draft.email || "",
    educationalQualification: draft.educationalQualification || "",
    occupation: draft.occupation || "",
    annualIncome: draft.annualIncome || "",
  };
};

export default function AddNewParent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData);
  const [dropdowns, setDropdowns] = useState({ title: false, gender: false });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const selectOption = (dropdown, value) => {
    handleInputChange(dropdown, value);
    setDropdowns((prev) => ({ ...prev, [dropdown]: false }));
  };

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.mobileNumber || !formData.email) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!/^\d{11}$/.test(formData.mobileNumber)) {
      setErrorMessage("Mobile number must be exactly 11 digits.");
      return;
    }

    saveParentDraft(formData);
    navigate("/parents/new/address");
  };

  return (
    <Layout activeTab="Parents">
      <div className="p-4 sm:p-6 w-full">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate("/parents")}
            className="hover:text-gray-700 cursor-pointer transition-colors"
          >
            Parents
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Basic Details</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Parent</h1>
          <button
            onClick={() => navigate("/parents")}
            className="text-sm text-green-600 hover:text-green-700 transition-colors cursor-pointer"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("title")}
                  className="w-full px-4 py-2 border rounded-md text-left cursor-pointer"
                >
                  {formData.title || "Select--"}
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                </button>
                {dropdowns.title && (
                  <div className="absolute mt-1 w-full bg-white border rounded-md shadow z-10">
                    {titleOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => selectOption("title", opt)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Field label="First Name*">
              <input
                type="text"
                value={formData.firstName}
                onChange={(event) => handleInputChange("firstName", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="First Name"
              />
            </Field>

            <Field label="Middle Name">
              <input
                type="text"
                value={formData.middleName}
                onChange={(event) => handleInputChange("middleName", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Middle Name"
              />
            </Field>

            <Field label="Last Name*">
              <input
                type="text"
                value={formData.lastName}
                onChange={(event) => handleInputChange("lastName", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Last Name"
              />
            </Field>

            <Field label="Date of Birth">
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) => handleInputChange("dateOfBirth", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </Field>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("gender")}
                  className="w-full px-4 py-2 border rounded-md text-left cursor-pointer"
                >
                  {formData.gender || "Select--"}
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                </button>
                {dropdowns.gender && (
                  <div className="absolute mt-1 w-full bg-white border rounded-md shadow z-10">
                    {genderOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => selectOption("gender", opt)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Field label="Mobile Number*">
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(event) => handleInputChange("mobileNumber", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="0801xxxxxxx"
              />
            </Field>

            <Field label="Email*">
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleInputChange("email", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="example@mail.com"
              />
            </Field>

            <Field label="Education">
              <input
                type="text"
                value={formData.educationalQualification}
                onChange={(event) => handleInputChange("educationalQualification", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="B.Sc, M.Sc etc"
              />
            </Field>

            <Field label="Occupation">
              <input
                type="text"
                value={formData.occupation}
                onChange={(event) => handleInputChange("occupation", event.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Occupation"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Annual Income">
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(event) => handleInputChange("annualIncome", event.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="e.g. 1,000,000"
                />
              </Field>
            </div>
          </div>

          {errorMessage && <p className="text-red-600 text-sm mt-5">{errorMessage}</p>}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/parents")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}


Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};




