import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { smsApi } from "../../services/smsApi";
import { CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

// ── Shared field components ─────────────────────────────────────

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white placeholder:text-gray-400";

const selectCls = `${inputCls} cursor-pointer`;

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Nigerian states ─────────────────────────────────────────────
const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara",
];

const INITIAL = {
  // Student
  admissionNumber: "", admissionDate: "", class: "",
  firstName: "", middleName: "", lastName: "",
  dob: "", gender: "", address: "", state: "", email: "", lga: "",
  mobileNumber: "", previousSchool: "",
  // Parent
  parentTitle: "", parentFirstName: "", parentMiddleName: "", parentLastName: "",
  parentDob: "", parentGender: "", parentAddress: "", parentState: "",
  parentLga: "", parentEmail: "", parentMobileNumber: "", parentAltMobileNumber: "",
  educationQualification: "", occupation: "", annualIncome: "",
};

const REQUIRED_FIELDS = [
  "admissionNumber","admissionDate","class","firstName","lastName","dob","gender",
  "address","state","email","lga","mobileNumber","previousSchool",
  "parentTitle","parentFirstName","parentLastName","parentDob","parentGender",
  "parentAddress","parentState","parentLga","parentEmail","parentMobileNumber","parentAltMobileNumber",
];

// ── Section header inside the card ────────────────────────────

function SectionTitle({ number, title }) {
  return (
    <h2 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </span>
      {title}
    </h2>
  );
}

// ── Progress steps ─────────────────────────────────────────────

function ProgressBar({ step }) {
  const steps = ["Student Info", "Parent / Guardian Info", "Submit"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const done = step > i;
        const current = step === i;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                done ? "bg-green-600 text-white" : current ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${current ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 rounded ${step > i ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function StudentAdmission() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [step, setStep] = useState(0);           // 0 = student, 1 = parent
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  }

  function validateStep(s) {
    const studentRequired = [
      "admissionNumber","admissionDate","class","firstName","lastName",
      "dob","gender","address","state","email","lga","mobileNumber","previousSchool",
    ];
    const parentRequired = [
      "parentTitle","parentFirstName","parentLastName","parentDob","parentGender",
      "parentAddress","parentState","parentLga","parentEmail",
      "parentMobileNumber","parentAltMobileNumber",
    ];
    const fields = s === 0 ? studentRequired : parentRequired;
    const missing = fields.filter((f) => !String(form[f] || "").trim());
    if (missing.length) return "Please fill all required fields before continuing.";
    if (s === 0 && !/^\d{11}$/.test(form.mobileNumber)) return "Student mobile number must be exactly 11 digits.";
    if (s === 1 && !/^\d{11}$/.test(form.parentMobileNumber)) return "Parent mobile number must be exactly 11 digits.";
    if (s === 1 && !/^\d{11}$/.test(form.parentAltMobileNumber)) return "Alternative mobile number must be exactly 11 digits.";
    return "";
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setStep(1);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateStep(1);
    if (err) { setError(err); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await smsApi.submitStudentAdmission(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-5">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Application Received!</h2>
            <p className="text-gray-500 text-sm mb-2 leading-relaxed">
              Thank you, <strong>{form.firstName} {form.lastName}</strong>. Your admission application has been successfully submitted.
            </p>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              You will receive a confirmation email at <span className="font-medium text-gray-600">{form.email}</span> shortly. Check your admission status using your admission number: <span className="font-mono font-bold text-green-700">{form.admissionNumber}</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/admission")}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm cursor-pointer"
              >
                Check Admission Status
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page title */}
      <div className="bg-white border-b border-gray-100 mt-[65px]">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 py-8">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-1">Admissions</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Student Admission Form</h1>
          <p className="text-gray-500 text-sm mt-1">
            Please fill this form carefully and accurately. All fields marked with{" "}
            <span className="text-red-500 font-bold">*</span> are required.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 lg:px-10 py-10">
        <ProgressBar step={step} />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Step 0: Student Info ─────────────────────────── */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <SectionTitle number="1" title="Student Information" />

              {/* Admission meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="Admission Number" required>
                  <input name="admissionNumber" value={form.admissionNumber} onChange={handleChange} placeholder="e.g. ADM001" className={inputCls} />
                </Field>
                <Field label="Admission Date" required>
                  <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Class" required>
                  <select name="class" value={form.class} onChange={handleChange} className={selectCls}>
                    <option value="">Select class</option>
                    {["JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* Personal */}
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Personal Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="First Name" required>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputCls} />
                </Field>
                <Field label="Middle Name">
                  <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle name" className={inputCls} />
                </Field>
                <Field label="Last Name" required>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputCls} />
                </Field>
                <Field label="Date of Birth" required>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Gender" required>
                  <select name="gender" value={form.gender} onChange={handleChange} className={selectCls}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </Field>
                <Field label="Mobile Number" required>
                  <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="080XXXXXXXX" className={inputCls} />
                </Field>
              </div>

              {/* Location */}
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Location & Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="State of Origin" required>
                  <select name="state" value={form.state} onChange={handleChange} className={selectCls}>
                    <option value="">Select state</option>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="LGA" required>
                  <input name="lga" value={form.lga} onChange={handleChange} placeholder="Local Government Area" className={inputCls} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Home Address" required>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Full residential address" className={inputCls} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Email Address" required>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@example.com" className={inputCls} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Previous School" required>
                    <input name="previousSchool" value={form.previousSchool} onChange={handleChange} placeholder="Name of last school attended" className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Parent / Guardian Info ───────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <SectionTitle number="2" title="Parent / Guardian Information" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Title" required>
                  <select name="parentTitle" value={form.parentTitle} onChange={handleChange} className={selectCls}>
                    <option value="">Select title</option>
                    {["Mr","Mrs","Ms","Dr","Prof","Alhaji","Alhaja","Chief"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="First Name" required>
                  <input name="parentFirstName" value={form.parentFirstName} onChange={handleChange} placeholder="First name" className={inputCls} />
                </Field>
                <Field label="Middle Name">
                  <input name="parentMiddleName" value={form.parentMiddleName} onChange={handleChange} placeholder="Middle name" className={inputCls} />
                </Field>
                <Field label="Last Name" required>
                  <input name="parentLastName" value={form.parentLastName} onChange={handleChange} placeholder="Last name" className={inputCls} />
                </Field>
                <Field label="Date of Birth" required>
                  <input type="date" name="parentDob" value={form.parentDob} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Gender" required>
                  <select name="parentGender" value={form.parentGender} onChange={handleChange} className={selectCls}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </Field>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Contact & Location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="State" required>
                  <select name="parentState" value={form.parentState} onChange={handleChange} className={selectCls}>
                    <option value="">Select state</option>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="LGA" required>
                  <input name="parentLga" value={form.parentLga} onChange={handleChange} placeholder="Local Government Area" className={inputCls} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Home Address" required>
                    <input name="parentAddress" value={form.parentAddress} onChange={handleChange} placeholder="Full residential address" className={inputCls} />
                  </Field>
                </div>
                <Field label="Email Address" required>
                  <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="parent@example.com" className={inputCls} />
                </Field>
                <Field label="Mobile Number" required>
                  <input name="parentMobileNumber" value={form.parentMobileNumber} onChange={handleChange} placeholder="080XXXXXXXX (11 digits)" className={inputCls} />
                </Field>
                <Field label="Alternative Mobile" required>
                  <input name="parentAltMobileNumber" value={form.parentAltMobileNumber} onChange={handleChange} placeholder="Another 11-digit number" className={inputCls} />
                </Field>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Professional Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Education Qualification">
                  <input name="educationQualification" value={form.educationQualification} onChange={handleChange} placeholder="e.g. B.Sc, M.Sc" className={inputCls} />
                </Field>
                <Field label="Occupation">
                  <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation" className={inputCls} />
                </Field>
                <Field label="Annual Income">
                  <input name="annualIncome" value={form.annualIncome} onChange={handleChange} placeholder="e.g. ₦2,000,000" className={inputCls} />
                </Field>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            {step === 0 ? (
              <button
                type="button"
                onClick={() => navigate("/admission")}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                ← Back to Admissions
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setStep(0); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                ← Previous
              </button>
            )}

            {step === 0 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 cursor-pointer shadow-sm shadow-green-900/20"
              >
                Next: Parent Info →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 cursor-pointer shadow-sm shadow-green-900/20"
              >
                {isSubmitting ? "Submitting Application…" : "Submit Application →"}
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}