// ── TeachersProfile (grid view) ───────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getProfileAvatar } from "../../utils/profileAvatar";
import { PageHeader, SearchBar, Spinner, EmptyState, Btn } from "../../components/ui/index.jsx";
import { Users } from "lucide-react";

export function TeachersProfile() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    smsApi.listTeachers()
      .then((res) => { if (active) setTeachers(Array.isArray(res) ? res : []); })
      .catch(() => { if (active) setTeachers([]); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() =>
    teachers.filter((t) => String(t.name || "").toLowerCase().includes(search.toLowerCase())),
    [search, teachers]
  );

  return (
    <Layout activeTab="Teachers">
      <PageHeader
        title="Teachers"
        subtitle="Staff directory — card view"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => navigate("/teachers")}>List View</Btn>
            <Btn onClick={() => navigate("/teachers/add")}>+ Add Teacher</Btn>
          </div>
        }
      />
      <div className="mb-5 max-w-xs">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers…" />
      </div>
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No teachers found" description="Add a teacher or adjust your search." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((t) => (
            <div
              key={t.id || t.teacherId}
              onClick={() => navigate("/teachers/main-profile")}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-green-200 cursor-pointer transition-all group"
            >
              <img
                src={getProfileAvatar(t.name, "Teacher")}
                alt={t.name}
                className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover group-hover:scale-105 transition-transform"
              />
              <p className="font-bold text-gray-900 text-sm leading-tight">{t.name}</p>
              <p className="text-green-600 text-xs mt-0.5 font-medium">Teacher</p>
              {t.subject && <p className="text-gray-400 text-xs mt-0.5">{t.subject}</p>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

// ── MainProfile (single teacher profile) ─────────────────────────────────────
import { useState as useState2 } from "react";
import { ChevronRight, Mail, Phone, MapPin, Calendar, UserCheck, BookOpenCheck, Users as UsersIcon } from "lucide-react";
import { getProfileAvatar as getProfileAvatar2 } from "../../utils/profileAvatar";
import { Btn as Btn2 } from "../../components/ui/index.jsx";

function InfoCard({ icon: Icon, label, value, colorBg = "bg-green-50", colorIcon = "text-green-600" }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorBg}`}>
          <Icon className={`w-4 h-4 ${colorIcon}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
          <p className="text-sm text-gray-800 font-medium break-words">{value || "—"}</p>
        </div>
      </div>
    </div>
  );
}

const PROFILE_TABS = ["Profile Overview", "Class", "Subject"];

export function MainProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab2] = useState2(0);

  return (
    <Layout activeTab="Teachers">
      <PageHeader
        title="Teacher Profile"
        breadcrumbs={[{ label: "Teachers", onClick: () => navigate("/teachers") }, { label: "Danjuma Danlami" }]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-green-600 to-green-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
            <div className="relative">
              <img
                src={getProfileAvatar2("Danjuma Danlami", "Teacher")}
                alt="Danjuma Danlami"
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="mb-1 flex-1">
              <p className="font-bold text-gray-900 text-xl">Danjuma Danlami</p>
              <p className="text-sm text-gray-500">Senior Science Teacher · 5 Years Experience</p>
            </div>
            <div className="flex gap-2">
              <Btn2 size="sm">Send Message</Btn2>
              <Btn2 size="sm" variant="secondary">Edit Profile</Btn2>
              <Btn2 size="sm" variant="danger">Delete</Btn2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-6">
            {PROFILE_TABS.map((tab, i) => (
              <button key={tab} type="button" onClick={() => setActiveTab2(i)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${activeTab === i ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <>
              <h3 className="font-bold text-gray-900 mb-4">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <InfoCard icon={UserCheck}    label="Teacher ID"    value="WISCH547" />
                <InfoCard icon={Mail}         label="Email"         value="danjumadanlami@gmail.com" colorBg="bg-blue-50" colorIcon="text-blue-600" />
                <InfoCard icon={Phone}        label="Phone"         value="09132328374" colorBg="bg-purple-50" colorIcon="text-purple-600" />
                <InfoCard icon={MapPin}       label="Address"       value="123 Nassarawa GRA, Kano" colorBg="bg-red-50" colorIcon="text-red-500" />
                <InfoCard icon={Calendar}     label="Date of Birth" value="12 Jun 1995" colorBg="bg-amber-50" colorIcon="text-amber-600" />
                <InfoCard icon={UserCheck}    label="Gender"        value="Male" colorBg="bg-indigo-50" colorIcon="text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Bio</h4>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">Danjuma Danlami is a dedicated and passionate science teacher with over 5 years of experience. He holds a Bachelor's degree in Education (Science) from Ahmadu Bello University, Zaria, and is known for innovative, student-centred teaching methodologies that inspire curiosity and academic excellence.</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Assigned Class</h3>
              <div className="inline-flex flex-col items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                  <UsersIcon className="w-7 h-7 text-white" />
                </div>
                <p className="font-bold text-gray-900">Grade 10A</p>
                <p className="text-sm text-gray-500 mt-0.5">100 Students</p>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Assigned Subjects</h3>
              <div className="flex flex-wrap gap-4">
                {[["Physics", 500], ["Biology", 480]].map(([subject, students]) => (
                  <div key={subject} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center w-40">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <BookOpenCheck className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Subject: {subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{students} Students</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ── AddTeacher (4-step form) ──────────────────────────────────────────────────
import { useState as useState3, useMemo as useMemo3 } from "react";
import { smsApi as smsApi3 } from "../../services/smsApi";
import { PageHeader as PageHeader3, FormField as FormField3, Input as Input3, Select as Select3, Btn as Btn3, SuccessModal } from "../../components/ui/index.jsx";

const STEPS = ["Basic Details", "Residential & Login", "Assign Class", "Assign Subject"];
const INITIAL = {
  teacherName: "", gender: "", dateOfBirth: "", dateOfEmployment: "", mobileNumber: "",
  qualification: "", yearsOfExperience: "", state: "", lga: "", address: "",
  username: "", email: "", password: "", repeatPassword: "",
  assignedClass: "", assignedSubject: "",
};

export function AddTeacher() {
  const navigate = useNavigate();
  const [step, setStep3] = useState3(0);
  const [form, setForm3] = useState3(INITIAL);
  const [error, setError3] = useState3("");
  const [isSubmitting, setIsSubmitting3] = useState3(false);
  const [showSuccess, setShowSuccess3] = useState3(false);

  const isLast = step === STEPS.length - 1;

  function handleChange3(e) {
    const { name, value } = e.target;
    setForm3((p) => ({ ...p, [name]: value }));
    if (error) setError3("");
  }

  function validate3() {
    const required = [
      "teacherName","gender","dateOfBirth","dateOfEmployment","mobileNumber","qualification","yearsOfExperience",
      "state","lga","address","username","email","password","repeatPassword","assignedClass","assignedSubject",
    ];
    const missing = required.filter((f) => !String(form[f] || "").trim());
    if (missing.length) return "Please complete all required fields before adding teacher.";
    if (!/^\d{11}$/.test(form.mobileNumber)) return "Mobile number must be exactly 11 digits.";
    if (form.password !== form.repeatPassword) return "Passwords do not match.";
    return "";
  }

  async function handleNext3() {
    if (!isLast) { setStep3((p) => p + 1); return; }
    const err = validate3();
    if (err) { setError3(err); return; }
    setIsSubmitting3(true);
    try {
      await smsApi3.createTeacher({ ...form, id: Date.now(), name: form.teacherName });
      setShowSuccess3(true);
      setForm3(INITIAL);
      setStep3(0);
    } catch (err) {
      setError3(err.message || "Unable to add teacher.");
    } finally {
      setIsSubmitting3(false);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  return (
    <Layout activeTab="Teachers">
      <PageHeader3 title="Add Teacher" breadcrumbs={[{ label: "Teachers", onClick: () => navigate("/teachers") }, { label: "Add Teacher" }]} />

      {/* Step tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button key={s} type="button" onClick={() => setStep3(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${step === i ? "border-green-500 text-green-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField3 label="Teacher's Name" required><input name="teacherName" value={form.teacherName} onChange={handleChange3} placeholder="Full name" className={inputCls} /></FormField3>
            <FormField3 label="Gender" required><select name="gender" value={form.gender} onChange={handleChange3} className={inputCls}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></FormField3>
            <FormField3 label="Date of Birth" required><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange3} className={inputCls} /></FormField3>
            <FormField3 label="Date of Employment" required><input type="date" name="dateOfEmployment" value={form.dateOfEmployment} onChange={handleChange3} className={inputCls} /></FormField3>
            <FormField3 label="Mobile Number" required><input name="mobileNumber" value={form.mobileNumber} onChange={handleChange3} placeholder="080XXXXXXXX" className={inputCls} /></FormField3>
            <FormField3 label="Qualification" required><input name="qualification" value={form.qualification} onChange={handleChange3} placeholder="e.g. B.Ed, M.Sc" className={inputCls} /></FormField3>
            <FormField3 label="Years of Experience" required><input name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange3} placeholder="e.g. 5" className={inputCls} /></FormField3>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField3 label="State" required><input name="state" value={form.state} onChange={handleChange3} placeholder="State" className={inputCls} /></FormField3>
            <FormField3 label="LGA" required><input name="lga" value={form.lga} onChange={handleChange3} placeholder="LGA" className={inputCls} /></FormField3>
            <div className="sm:col-span-2"><FormField3 label="Address" required><input name="address" value={form.address} onChange={handleChange3} placeholder="Residential address" className={inputCls} /></FormField3></div>
            <FormField3 label="Username" required><input name="username" value={form.username} onChange={handleChange3} placeholder="Username" className={inputCls} /></FormField3>
            <FormField3 label="Email" required><input type="email" name="email" value={form.email} onChange={handleChange3} placeholder="Email address" className={inputCls} /></FormField3>
            <FormField3 label="Password" required><input type="password" name="password" value={form.password} onChange={handleChange3} placeholder="Password" className={inputCls} /></FormField3>
            <FormField3 label="Repeat Password" required><input type="password" name="repeatPassword" value={form.repeatPassword} onChange={handleChange3} placeholder="Repeat password" className={inputCls} /></FormField3>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-sm">
            <FormField3 label="Assign Class" required>
              <select name="assignedClass" value={form.assignedClass} onChange={handleChange3} className={inputCls}>
                <option value="">Select class</option>
                {["JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3","Grade 10A","Grade 10B","Grade 11A"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField3>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-sm">
            <FormField3 label="Assign Subject" required>
              <select name="assignedSubject" value={form.assignedSubject} onChange={handleChange3} className={inputCls}>
                <option value="">Select subject</option>
                {["Mathematics","English Language","Physics","Chemistry","Biology","Government","Economics","ICT","Geography"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField3>
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn3 variant="secondary" disabled={step === 0} onClick={() => setStep3((p) => p - 1)}>← Previous</Btn3>
          <Btn3 onClick={handleNext3} disabled={isSubmitting}>
            {isLast ? (isSubmitting ? "Adding Teacher…" : "Add Teacher") : "Next →"}
          </Btn3>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Teacher Added!"
          message="The teacher has been successfully added and saved to the system."
          buttonLabel="Back to Teachers"
          onClose={() => { setShowSuccess3(false); navigate("/teachers"); }}
        />
      )}
    </Layout>
  );
}