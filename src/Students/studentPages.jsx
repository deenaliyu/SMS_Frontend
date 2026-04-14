// ── StudentsProfile (grid view) ───────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi";
import { getProfileAvatar } from "../utils/profileAvatar";
import { PageHeader, SearchBar, Spinner, EmptyState, Btn } from "../components/ui/index.jsx";
import { GraduationCap, List } from "lucide-react";

export function StudentsProfile() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    smsApi.listStudents()
      .then((res) => { if (active) setStudents(Array.isArray(res) ? res : []); })
      .catch(() => {})
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() =>
    students.filter((s) => String(s.name || "").toLowerCase().includes(search.toLowerCase())),
    [search, students]
  );

  return (
    <Layout activeTab="Students">
      <PageHeader
        title="Students"
        subtitle="Student directory — card view"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => navigate("/students")}><List className="w-4 h-4 mr-1" />List View</Btn>
            <Btn variant="secondary">Export CSV</Btn>
            <Btn onClick={() => navigate("/students/add")}>+ Add Student</Btn>
          </div>
        }
      />
      <div className="mb-5 max-w-xs">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students…" />
      </div>
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students found" description="Add a student or adjust your search." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((s, i) => (
            <div
              key={s.id || i}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-green-200 cursor-pointer transition-all group"
            >
              <img
                src={getProfileAvatar(s.name, "Student")}
                alt={s.name}
                className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover group-hover:scale-105 transition-transform"
              />
              <p className="font-bold text-gray-900 text-sm leading-tight">{s.name}</p>
              <p className="text-green-600 text-xs mt-0.5 font-medium">Student</p>
              {s.className && <p className="text-gray-400 text-xs mt-0.5">{s.className}</p>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

// ── AddStudents (2-step form) ─────────────────────────────────────────────────
import { useState as useState2 } from "react";
import { smsApi as smsApi2 } from "../services/smsApi";
import {
  PageHeader as PH2, FormField as FF2, Btn as Btn2, SuccessModal,
} from "../components/ui/index.jsx";
import { ChevronRight } from "lucide-react";

const DRAFT_KEY = "students-add-draft-v2";

function getDraft() {
  try { return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null") || {}; } catch { return {}; }
}

const INITIAL_FORM = {
  firstName: "", middleName: "", lastName: "", className: "", gender: "",
  dateOfBirth: "", admissionNumber: "", email: "", phone: "", address: "", state: "", lga: "",
  parentFullName: "", parentEmail: "", parentPhone: "", parentAddress: "",
  username: "", password: "", confirmPassword: "",
};

const STEPS = [{ id: "student", label: "Student Details" }, { id: "parent", label: "Parent & Login" }];

const inputCls2 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white placeholder:text-gray-400";

export function AddStudents() {
  const navigate = useNavigate();
  const [step, setStep2] = useState2(0);
  const [form, setForm2] = useState2(() => ({ ...INITIAL_FORM, ...getDraft() }));
  const [isSubmitting, setIsSubmitting2] = useState2(false);
  const [error, setError2] = useState2("");
  const [showSuccess, setShowSuccess2] = useState2(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm2((p) => { const next = { ...p, [name]: value }; window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); return next; });
    if (error) setError2("");
  }

  function validateStep(s) {
    const step0 = ["firstName", "lastName", "className", "gender", "dateOfBirth", "admissionNumber", "phone", "address"];
    const step1 = ["parentFullName", "parentPhone", "username", "password", "confirmPassword"];
    const required = s === 0 ? step0 : step1;
    if (required.some((f) => !String(form[f] || "").trim())) return "Please complete all required fields for this step.";
    if (s === 0 && !/^\d{11}$/.test(form.phone)) return "Student phone must be exactly 11 digits.";
    if (s === 1 && !/^\d{11}$/.test(form.parentPhone)) return "Parent phone must be exactly 11 digits.";
    if (s === 1 && form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  }

  function handleNext() {
    const err = validateStep(0); if (err) { setError2(err); return; }
    setStep2(1); setError2("");
  }

  async function handleSubmit() {
    const err = validateStep(1); if (err) { setError2(err); return; }
    setIsSubmitting2(true); setError2("");
    try {
      await smsApi2.createStudent({
        ...form, id: Date.now(),
        name: [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" "),
        class: form.className,
        email: form.email.trim().toLowerCase(),
        parentEmail: form.parentEmail.trim().toLowerCase(),
      });
      window.localStorage.removeItem(DRAFT_KEY);
      setShowSuccess2(true);
      setForm2(INITIAL_FORM);
      setStep2(0);
    } catch (err) {
      setError2(err.message || "Unable to save student.");
    } finally {
      setIsSubmitting2(false);
    }
  }

  return (
    <Layout activeTab="Students">
      <PH2 title="Add New Student"
        breadcrumbs={[{ label: "Students", onClick: () => navigate("/students") }, { label: "Add Student" }]} />

      {/* Step tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {STEPS.map((s, i) => (
          <button key={s.id} type="button"
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${step === i ? "border-green-500 text-green-700" : "border-transparent text-gray-400"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FF2 label="First Name" required><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputCls2} /></FF2>
            <FF2 label="Middle Name"><input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle name (optional)" className={inputCls2} /></FF2>
            <FF2 label="Last Name" required><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputCls2} /></FF2>
            <FF2 label="Class" required>
              <select name="className" value={form.className} onChange={handleChange} className={inputCls2}>
                <option value="">Select class</option>
                {["JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </FF2>
            <FF2 label="Gender" required>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputCls2}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option>
              </select>
            </FF2>
            <FF2 label="Date of Birth" required><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls2} /></FF2>
            <FF2 label="Admission Number" required><input name="admissionNumber" value={form.admissionNumber} onChange={handleChange} placeholder="ADM/2025/001" className={inputCls2} /></FF2>
            <FF2 label="Email"><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@example.com" className={inputCls2} /></FF2>
            <FF2 label="Phone" required><input name="phone" value={form.phone} onChange={handleChange} placeholder="080XXXXXXXX" className={inputCls2} /></FF2>
            <FF2 label="State"><input name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputCls2} /></FF2>
            <FF2 label="LGA"><input name="lga" value={form.lga} onChange={handleChange} placeholder="LGA" className={inputCls2} /></FF2>
            <div className="sm:col-span-2"><FF2 label="Home Address" required><input name="address" value={form.address} onChange={handleChange} placeholder="Residential address" className={inputCls2} /></FF2></div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FF2 label="Parent Full Name" required><input name="parentFullName" value={form.parentFullName} onChange={handleChange} placeholder="Parent's full name" className={inputCls2} /></FF2>
            <FF2 label="Parent Email"><input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="parent@example.com" className={inputCls2} /></FF2>
            <FF2 label="Parent Phone" required><input name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="080XXXXXXXX" className={inputCls2} /></FF2>
            <FF2 label="Parent Address"><input name="parentAddress" value={form.parentAddress} onChange={handleChange} placeholder="Parent's address" className={inputCls2} /></FF2>
            <FF2 label="Username" required><input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" className={inputCls2} /></FF2>
            <div /> {/* spacer */}
            <FF2 label="Password" required><input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create password" className={inputCls2} /></FF2>
            <FF2 label="Confirm Password" required><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={inputCls2} /></FF2>
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          {step === 0 ? (
            <Btn2 variant="secondary" onClick={() => navigate("/students")}>← Cancel</Btn2>
          ) : (
            <Btn2 variant="secondary" onClick={() => { setStep2(0); setError2(""); }}>← Previous</Btn2>
          )}
          {step === 0 ? (
            <Btn2 onClick={handleNext}>Next: Parent Info →</Btn2>
          ) : (
            <Btn2 onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Student"}</Btn2>
          )}
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Student Saved!"
          message="The student record has been saved successfully."
          buttonLabel="Back to Students"
          onClose={() => { setShowSuccess2(false); navigate("/students"); }}
        />
      )}
    </Layout>
  );
}