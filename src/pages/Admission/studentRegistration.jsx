import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionHeader from "../../components/AdmissionHeader/header";
import InputFields from "../../components/InputFields";
import { smsApi } from "../../services/smsApi";

const initialFormData = {
  class: "",
  admissionNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "",
  address: "",
  state: "",
  lga: "",
  mobileNumber: "",
  altMobileNumber: "",
  username: "",
  password: "",
};

const requiredFields = [
  "class",
  "admissionNumber",
  "firstName",
  "lastName",
  "gender",
  "address",
  "state",
  "lga",
  "mobileNumber",
  "username",
  "password",
];

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || String(formData[field]).trim() === "",
    );

    if (missingFields.length > 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!/^\d{11}$/.test(formData.mobileNumber)) {
      setErrorMessage("Mobile number must be exactly 11 digits.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.registerStudent(formData);
      setShowSuccessModal(true);
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(error.message || "Unable to register student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdmissionHeader page="admission" title="Student Registration" />
      <div className="lg:w-[90%] mt-4 flex flex-col px-14 p-6">
        <h2 className="text-[24.5px] font-bold mb-4 text-[#252B42]">Student Info</h2>

        <form onSubmit={handleSubmit} className="lg:grid md:grid grid-cols-2 gap-4">
          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            Class*
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="p-2 border text-[#7B8389] border-[#989E99] mt-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
              <option value="class3">Class 3</option>
            </select>
          </label>

          <InputFields
            title="Admission Number*"
            name="admissionNumber"
            placeholder="471"
            value={formData.admissionNumber}
            onChange={handleChange}
          />
          <InputFields
            title="First Name*"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <InputFields
            title="Middle Name"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
          />
          <InputFields
            title="Last Name*"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputFields
            title="Date of Birth"
            name="dob"
            inputType="date"
            value={formData.dob}
            onChange={handleChange}
          />

          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            Gender*
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 border text-[#7B8389] border-[#989E99] mt-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <InputFields
            title="Address*"
            name="address"
            inputType="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            State*
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="p-2 border text-[#7B8389] border-[#989E99] mt-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="kano">Kano</option>
              <option value="katsina">Katsina</option>
            </select>
          </label>

          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            LGA*
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              className="p-2 border text-[#7B8389] border-[#989E99] mt-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="kano">Kano</option>
              <option value="katsina">Katsina</option>
            </select>
          </label>

          <InputFields
            title="Mobile number*"
            name="mobileNumber"
            inputType="text"
            placeholder="Mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
          <InputFields
            title="Alternative Mobile number"
            name="altMobileNumber"
            inputType="text"
            placeholder="Mobile number"
            value={formData.altMobileNumber}
            onChange={handleChange}
          />
          <InputFields
            title="User Name*"
            name="username"
            inputType="text"
            placeholder="User Name"
            value={formData.username}
            onChange={handleChange}
          />
          <InputFields
            title="Password*"
            name="password"
            inputType="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errorMessage && (
            <p className="col-span-2 text-red-600 text-sm" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#09B451] w-[40%] text-[#001B07] p-1 py-2 rounded disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-red-500 text-xl font-bold"
              onClick={() => setShowSuccessModal(false)}
            >
              &times;
            </button>
            <div className="flex justify-center mb-4">
              <div className="bg-green-300 border border-green-500 p-3 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">
              You have successfully registered. Please log in to access your account and explore our resources.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/student-login");
              }}
              className="bg-[#09B451] text-white py-2 w-full rounded hover:bg-green-600 transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentRegistration;
