import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";

const DRAFT_KEY = "students-add-draft";

function getDraft() {
  const raw = window.localStorage.getItem(DRAFT_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initialFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  className: "",
  gender: "",
  dateOfBirth: "",
  admissionNumber: "",
  email: "",
  phone: "",
  address: "",
  state: "",
  lga: "",
  parentFullName: "",
  parentEmail: "",
  parentPhone: "",
  parentAddress: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const steps = [
  { id: "student", label: "Student Details" },
  { id: "parent", label: "Parent & Login" },
];

function buildPayload(formData) {
  return {
    id: Date.now(),
    firstName: formData.firstName.trim(),
    middleName: formData.middleName.trim(),
    lastName: formData.lastName.trim(),
    name: [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" "),
    className: formData.className,
    class: formData.className,
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth,
    admissionNumber: formData.admissionNumber.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    state: formData.state.trim(),
    lga: formData.lga.trim(),
    parentFullName: formData.parentFullName.trim(),
    parentEmail: formData.parentEmail.trim().toLowerCase(),
    parentPhone: formData.parentPhone.trim(),
    parentAddress: formData.parentAddress.trim(),
    username: formData.username.trim(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };
}

export default function AddStudents() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => getDraft() || initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const saveDraft = (nextData) => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(nextData));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      saveDraft(next);
      return next;
    });

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateStep = () => {
    const requiredByStep = {
      0: [
        "firstName",
        "lastName",
        "className",
        "gender",
        "dateOfBirth",
        "admissionNumber",
        "phone",
        "address",
      ],
      1: ["parentFullName", "parentPhone", "username", "password", "confirmPassword"],
    };

    const requiredFields = requiredByStep[step];
    const missing = requiredFields.filter((field) => !String(formData[field] || "").trim());

    if (missing.length > 0) {
      return "Please complete all required fields for this step.";
    }

    if (step === 0 && !/^\d{11}$/.test(formData.phone)) {
      return "Student phone number must be exactly 11 digits.";
    }

    if (step === 1 && !/^\d{11}$/.test(formData.parentPhone)) {
      return "Parent phone number must be exactly 11 digits.";
    }

    if (step === 1 && formData.password !== formData.confirmPassword) {
      return "Password and confirm password do not match.";
    }

    return "";
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const resetForm = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setStep(0);
  };

  const handleSubmit = async () => {
    const validationError = validateStep();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = buildPayload(formData);

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createStudent(payload);
      resetForm();
      setSuccessMessage("Student record saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save student to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeTab="Students">
      <div className="p-4 sm:p-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate("/students")} className="hover:text-gray-700">
            Students
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Add New Student</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 sm:px-6 py-3">
            <div className="flex gap-6">
              {steps.map((item, index) => (
                <button
                  key={item.id}
                  className={`text-sm font-medium pb-2 border-b-2 ${
                    index === step ? "border-green-500 text-green-600" : "border-transparent text-gray-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="First Name*" name="firstName" value={formData.firstName} onChange={handleChange} />
                <Field label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                <Field label="Last Name*" name="lastName" value={formData.lastName} onChange={handleChange} />

                <SelectField
                  label="Class*"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  options={["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]}
                />

                <SelectField
                  label="Gender*"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={["Male", "Female"]}
                />

                <Field
                  label="Date of Birth*"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <Field
                  label="Admission Number*"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                />
                <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <Field label="Phone*" name="phone" value={formData.phone} onChange={handleChange} />
                <Field label="State" name="state" value={formData.state} onChange={handleChange} />
                <Field label="LGA" name="lga" value={formData.lga} onChange={handleChange} />
                <Field
                  label="Address*"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="md:col-span-2"
                />
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Parent Full Name*"
                  name="parentFullName"
                  value={formData.parentFullName}
                  onChange={handleChange}
                />
                <Field label="Parent Email" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} />
                <Field label="Parent Phone*" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                <Field
                  label="Parent Address"
                  name="parentAddress"
                  value={formData.parentAddress}
                  onChange={handleChange}
                />
                <Field label="Username*" name="username" value={formData.username} onChange={handleChange} />
                <Field
                  label="Password*"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Field
                  label="Confirm Password*"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}

            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                onClick={handlePrevious}
                disabled={step === 0 || isSubmitting}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Student"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, name, value, onChange, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
};

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
