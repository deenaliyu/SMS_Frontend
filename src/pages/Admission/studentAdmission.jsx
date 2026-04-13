import { useState } from "react";
import AdmissionHeader from "../../components/AdmissionHeader/header";
import InputFields from "../../components/InputFields";
import { smsApi } from "../../services/smsApi";

const initialFormData = {
  admissionNumber: "",
  admissionDate: "",
  class: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "",
  address: "",
  state: "",
  email: "",
  lga: "",
  mobileNumber: "",
  previousSchool: "",
  parentTitle: "",
  parentFirstName: "",
  parentMiddleName: "",
  parentLastName: "",
  parentDob: "",
  parentGender: "",
  parentAddress: "",
  parentState: "",
  parentLga: "",
  parentEmail: "",
  parentMobileNumber: "",
  parentAltMobileNumber: "",
  educationQualification: "",
  occupation: "",
  annualIncome: "",
};

const requiredFields = [
  "admissionNumber",
  "admissionDate",
  "class",
  "firstName",
  "lastName",
  "dob",
  "gender",
  "address",
  "state",
  "email",
  "lga",
  "mobileNumber",
  "previousSchool",
  "parentTitle",
  "parentFirstName",
  "parentLastName",
  "parentDob",
  "parentGender",
  "parentAddress",
  "parentState",
  "parentLga",
  "parentEmail",
  "parentMobileNumber",
  "parentAltMobileNumber",
];

const StudentAdmission = () => {
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
      setErrorMessage("Student mobile number must be exactly 11 digits.");
      return;
    }

    if (!/^\d{11}$/.test(formData.parentMobileNumber)) {
      setErrorMessage("Parent mobile number must be exactly 11 digits.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.submitStudentAdmission(formData);
      setShowSuccessModal(true);
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit admission form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdmissionHeader page="admission" title="Student Registration" />

      <div className="lg:w-[90%] mt-4 flex flex-col px-14 p-6">
        <h2 className="text-[24.5px] font-bold mb-4 text-[#252B42]">Student Info</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <InputFields
            title="Admission Number*"
            name="admissionNumber"
            placeholder="471"
            value={formData.admissionNumber}
            onChange={handleChange}
          />
          <InputFields
            title="Admission Date*"
            name="admissionDate"
            inputType="date"
            value={formData.admissionDate}
            onChange={handleChange}
          />

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

          <InputFields title="First Name*" name="firstName" value={formData.firstName} onChange={handleChange} />
          <InputFields
            title="Middle Name"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
          />
          <InputFields title="Last Name*" name="lastName" value={formData.lastName} onChange={handleChange} />
          <InputFields title="Date of Birth*" name="dob" inputType="date" value={formData.dob} onChange={handleChange} />

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

          <InputFields title="Address*" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />

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

          <InputFields
            title="Email*"
            name="email"
            inputType="email"
            placeholder="Email here"
            value={formData.email}
            onChange={handleChange}
          />

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
            title="Previous School*"
            name="previousSchool"
            inputType="text"
            placeholder="Previous School"
            value={formData.previousSchool}
            onChange={handleChange}
          />

          <div className="col-span-2 pt-4">
            <h2 className="text-[24.5px] font-bold mb-4 text-[#252B42]">Parent Info</h2>
          </div>

          <InputFields
            title="Title*"
            name="parentTitle"
            inputType="text"
            placeholder="Mr"
            value={formData.parentTitle}
            onChange={handleChange}
          />
          <InputFields
            title="First Name*"
            name="parentFirstName"
            placeholder="First Name"
            value={formData.parentFirstName}
            onChange={handleChange}
          />
          <InputFields
            title="Middle Name"
            name="parentMiddleName"
            placeholder="Middle Name"
            value={formData.parentMiddleName}
            onChange={handleChange}
          />
          <InputFields
            title="Last Name*"
            name="parentLastName"
            placeholder="Last Name"
            value={formData.parentLastName}
            onChange={handleChange}
          />
          <InputFields
            title="Date of Birth*"
            name="parentDob"
            inputType="date"
            value={formData.parentDob}
            onChange={handleChange}
          />

          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            Gender*
            <select
              name="parentGender"
              value={formData.parentGender}
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
            name="parentAddress"
            inputType="text"
            placeholder="Address"
            value={formData.parentAddress}
            onChange={handleChange}
          />

          <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
            State*
            <select
              name="parentState"
              value={formData.parentState}
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
              name="parentLga"
              value={formData.parentLga}
              onChange={handleChange}
              className="p-2 border text-[#7B8389] border-[#989E99] mt-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="kano">Kano</option>
              <option value="katsina">Katsina</option>
            </select>
          </label>

          <InputFields
            title="Email*"
            name="parentEmail"
            inputType="email"
            placeholder="Email here"
            value={formData.parentEmail}
            onChange={handleChange}
          />
          <InputFields
            title="Mobile number*"
            name="parentMobileNumber"
            inputType="text"
            placeholder="Mobile number"
            value={formData.parentMobileNumber}
            onChange={handleChange}
          />
          <InputFields
            title="Alternative Mobile number*"
            name="parentAltMobileNumber"
            inputType="text"
            placeholder="Mobile number"
            value={formData.parentAltMobileNumber}
            onChange={handleChange}
          />
          <InputFields
            title="Education Qualification"
            name="educationQualification"
            placeholder="Education Qualification"
            value={formData.educationQualification}
            onChange={handleChange}
          />
          <InputFields
            title="Occupation"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
          <InputFields
            title="Annual Income"
            name="annualIncome"
            placeholder="Annual Income"
            value={formData.annualIncome}
            onChange={handleChange}
          />

          {errorMessage && (
            <p className="col-span-2 text-red-600 text-sm" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-5 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-[480px] text-center shadow-md relative">
            <button
              className="absolute top-4 right-4 text-red-600 rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => setShowSuccessModal(false)}
            >
              <span className="text-[22px] font-bold">&times;</span>
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-2 border-green-500 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-[20px] font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Thank you for completing the admission form! Your application has been received. Please check back later
              to view your admission status.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentAdmission;
