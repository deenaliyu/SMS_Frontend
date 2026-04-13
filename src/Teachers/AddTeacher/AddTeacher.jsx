import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import PropTypes from "prop-types";

const steps = [
  { id: "basic", label: "Basic Details" },
  { id: "residential", label: "Residential/Login Details" },
  { id: "assign-class", label: "Assign Class" },
  { id: "assign-subject", label: "Assign Subject" },
];

const initialFormData = {
  teacherName: "",
  gender: "",
  dateOfBirth: "",
  dateOfEmployment: "",
  mobileNumber: "",
  qualification: "",
  yearsOfExperience: "",
  state: "",
  lga: "",
  address: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
  assignedClass: "",
  assignedSubject: "",
};

export default function AddTeachers() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("Teacher added successfully.");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isLastStep = useMemo(() => currentStep === steps.length - 1, [currentStep]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateRequiredFields = () => {
    const required = [
      "teacherName",
      "gender",
      "dateOfBirth",
      "dateOfEmployment",
      "mobileNumber",
      "qualification",
      "yearsOfExperience",
      "state",
      "lga",
      "address",
      "username",
      "email",
      "password",
      "repeatPassword",
      "assignedClass",
      "assignedSubject",
    ];

    const missing = required.filter((field) => !String(formData[field] || "").trim());

    if (missing.length > 0) {
      return "Please complete all required fields before adding teacher.";
    }

    if (!/^\d{11}$/.test(formData.mobileNumber)) {
      return "Mobile number must be exactly 11 digits.";
    }

    if (formData.password !== formData.repeatPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const buildPayload = () => ({
    id: Date.now(),
    teacherName: formData.teacherName.trim(),
    name: formData.teacherName.trim(),
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth,
    dateOfEmployment: formData.dateOfEmployment,
    mobileNumber: formData.mobileNumber.trim(),
    mobile: formData.mobileNumber.trim(),
    qualification: formData.qualification.trim(),
    yearsOfExperience: formData.yearsOfExperience.trim(),
    state: formData.state.trim(),
    lga: formData.lga.trim(),
    address: formData.address.trim(),
    username: formData.username.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    repeatPassword: formData.repeatPassword,
    assignedClass: formData.assignedClass,
    class: formData.assignedClass,
    assignedSubject: formData.assignedSubject,
    subject: formData.assignedSubject,
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const handleNext = async () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const validationError = validateRequiredFields();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = buildPayload();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createTeacher(payload);
      setSuccessMessage("Teacher added and saved successfully.");
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      setErrorMessage(error.message || "Unable to add teacher to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Layout activeTab="Teachers">
      <div className="p-4 sm:p-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate("/teachers")} className="hover:text-gray-700">
            Teachers
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Add Teachers</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{steps[currentStep].label}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 sm:gap-8 px-4 sm:px-6 py-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    index === currentStep
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {currentStep === 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Teacher's Name*">
                    <input
                      type="text"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleInputChange}
                      placeholder="Name here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Gender*">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Date of Birth*">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Date of Employment*">
                    <input
                      type="date"
                      name="dateOfEmployment"
                      value={formData.dateOfEmployment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Mobile Number*">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Number here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Qualification*">
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="Qualification here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Years of Experience*">
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder="Experience here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Residential/Login Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="State*">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="LGA*">
                    <input
                      type="text"
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      placeholder="LGA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Address*">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address here"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md"
                      />
                    </Field>
                  </div>

                  <Field label="Username*">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Email*">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Password*">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>

                  <Field label="Repeat Password*">
                    <input
                      type="password"
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Assign Class</h3>
                <Field label="Class*">
                  <select
                    name="assignedClass"
                    value={formData.assignedClass}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select class</option>
                    <option value="Grade 10A">Grade 10A</option>
                    <option value="Grade 10B">Grade 10B</option>
                    <option value="Grade 11A">Grade 11A</option>
                  </select>
                </Field>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Assign Subject</h3>
                <Field label="Subject*">
                  <select
                    name="assignedSubject"
                    value={formData.assignedSubject}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </Field>
              </div>
            )}

            {errorMessage && <p className="text-red-600 text-sm mt-5">{errorMessage}</p>}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastStep ? (isSubmitting ? "Adding Teacher..." : "Add Teacher") : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Teacher saved!</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{successMessage}</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setErrorMessage("");
                navigate("/teachers");
              }}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition font-medium"
            >
              Back To Teachers List
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
