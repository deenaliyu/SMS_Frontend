import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { smsApi } from "../../services/smsApi";
import { AlertCircle, CheckCircle } from "lucide-react";

const INITIAL = {
  class: "", admissionNumber: "", firstName: "", middleName: "", lastName: "",
  dob: "", gender: "", address: "", state: "", lga: "", mobileNumber: "",
  altMobileNumber: "", username: "", password: "",
};

const REQUIRED = ["class", "admissionNumber", "firstName", "lastName", "gender", "address", "state", "lga", "mobileNumber", "username", "password"];

const STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";
const selectCls = `${inputCls} cursor-pointer`;

export default function StudentRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const missing = REQUIRED.filter((f) => !String(form[f] || "").trim());
    if (missing.length) { setError("Please fill all required fields."); return; }
    if (!/^\d{11}$/.test(form.mobileNumber)) { setError("Mobile number must be exactly 11 digits."); return; }

    setIsSubmitting(true);
    setError("");
    try {
      await smsApi.registerStudent(form);
      setDone(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-5">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your account has been created. You can now log in to the student portal with your username and password.
            </p>
            <button
              type="button"
              onClick={() => navigate("/student-login")}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm cursor-pointer"
            >
              Go to Student Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-500 text-sm">Register your account to access the WiSchool student portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Class" required>
                <select name="class" value={form.class} onChange={handleChange} className={selectCls}>
                  <option value="">Select class</option>
                  {["JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Admission Number" required>
                <input name="admissionNumber" value={form.admissionNumber} onChange={handleChange} placeholder="e.g. ADM/2025/001" className={inputCls} />
              </Field>
              <Field label="First Name" required>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputCls} />
              </Field>
              <Field label="Middle Name">
                <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle name (optional)" className={inputCls} />
              </Field>
              <Field label="Last Name" required>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputCls} />
              </Field>
              <Field label="Date of Birth">
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Gender" required>
                <select name="gender" value={form.gender} onChange={handleChange} className={selectCls}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Address & Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="State" required>
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
              <Field label="Mobile Number" required>
                <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="080XXXXXXXX (11 digits)" className={inputCls} />
              </Field>
              <Field label="Alternative Mobile">
                <input name="altMobileNumber" value={form.altMobileNumber} onChange={handleChange} placeholder="Optional" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Login credentials */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              Login Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Username" required>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" className={inputCls} />
              </Field>
              <Field label="Password" required>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Choose a secure password" className={inputCls} />
              </Field>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 disabled:opacity-60 text-base cursor-pointer transition-colors shadow-lg shadow-green-900/20"
          >
            {isSubmitting ? "Creating Account…" : "Create Student Account →"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <button type="button" onClick={() => navigate("/student-login")} className="text-green-600 font-semibold hover:underline cursor-pointer">
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}