import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { clearParentDraft, getParentDraft, saveParentDraft } from "../../utils/parentDraft";
import { PageHeader, Btn, SuccessModal, ModalShell, FormField } from "../../components/ui/index.jsx";

const STUDENT_OPTIONS = [
  "1 Student","2 Students","3 Students","4 Students","5 Students",
  "6 Students","7 Students","8 Students","9 Students","10+ Students",
];

function buildParentPayload(draft) {
  const match = String(draft.numberOfStudents || "").match(/\d+/);
  const students = match ? Number(match[0]) : 0;
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
    numberOfStudents: draft.numberOfStudents,
    students,
    linkedStudentIds: Array.isArray(draft.linkedStudentIds) ? draft.linkedStudentIds : [],
  };
}

function getInitialFormData() {
  const draft = getParentDraft();
  return {
    numberOfStudents: draft.numberOfStudents || "",
    linkedStudentIds: Array.isArray(draft.linkedStudentIds) ? draft.linkedStudentIds : [],
  };
}

export default function StudentWardDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleInputChange(field, value) {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errorMessage) setErrorMessage("");
  }

  function handleLinkStudentSubmit() {
    const trimmed = studentId.trim();
    if (!trimmed) return;
    const nextIds = Array.from(new Set([...formData.linkedStudentIds, trimmed]));
    setFormData((p) => ({ ...p, linkedStudentIds: nextIds }));
    setShowLinkModal(false);
    setStudentId("");
  }

  function removeLinked(id) {
    setFormData((p) => ({ ...p, linkedStudentIds: p.linkedStudentIds.filter((i) => i !== id) }));
  }

  async function handleFinish() {
    if (!formData.numberOfStudents) {
      setErrorMessage("Please select the number of students/wards.");
      return;
    }
    const draft = saveParentDraft(formData);
    const payload = buildParentPayload(draft);
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await smsApi.createParent(payload);
      clearParentDraft();
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.message || "Unable to add parent.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout activeTab="Parents">
      <PageHeader
        title="Add New Parent"
        subtitle="Step 4 of 4 — Student / Ward Details"
        breadcrumbs={[
          { label: "Parents", onClick: () => navigate("/parents") },
          { label: "Add New", onClick: () => navigate("/parents/new") },
          { label: "Ward Details" },
        ]}
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {["Basic Info", "Address", "Login", "Wards"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-green-600 text-white" : "bg-green-600 text-white ring-4 ring-green-100"}`}>
              {i < 3 ? "✓" : 4}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === 3 ? "text-gray-900" : "text-gray-400"}`}>{step}</span>
            {i < 3 && <div className="w-8 h-0.5 bg-green-500 rounded" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <h2 className="font-bold text-gray-900 mb-5">Student / Ward Details</h2>

        <div className="space-y-5">
          {/* Number of students */}
          <FormField label="How many students/wards do you have?" required>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between bg-white cursor-pointer"
              >
                <span className={formData.numberOfStudents ? "text-gray-800" : "text-gray-400"}>
                  {formData.numberOfStudents || "Select…"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                  {STUDENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { handleInputChange("numberOfStudents", opt); setDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left hover:bg-green-50 cursor-pointer ${formData.numberOfStudents === opt ? "bg-green-50 text-green-700 font-medium" : ""}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {/* Link student */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Linked Student IDs</p>
              <Btn size="sm" variant="ghost" onClick={() => setShowLinkModal(true)}>+ Link Student</Btn>
            </div>
            {formData.linkedStudentIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.linkedStudentIds.map((id) => (
                  <div key={id} className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                    <span className="font-mono text-xs">{id}</span>
                    <button type="button" onClick={() => removeLinked(id)} className="text-green-500 hover:text-green-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No students linked yet.</p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{errorMessage}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn variant="secondary" onClick={() => navigate("/parents/new/login")}>← Previous</Btn>
          <Btn disabled={isSubmitting} onClick={handleFinish}>
            {isSubmitting ? "Saving…" : "Finish & Save Parent"}
          </Btn>
        </div>
      </div>

      {/* Link modal */}
      {showLinkModal && (
        <ModalShell title="Link Student" onClose={() => setShowLinkModal(false)} size="sm">
          <FormField label="Student ID Number" required>
            <input
              type="text"
              placeholder="e.g. STU001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkStudentSubmit()}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
            />
          </FormField>
          <div className="flex gap-3 mt-4">
            <Btn variant="secondary" className="flex-1" onClick={() => setShowLinkModal(false)}>Cancel</Btn>
            <Btn className="flex-1" onClick={handleLinkStudentSubmit} disabled={!studentId.trim()}>Link Student</Btn>
          </div>
        </ModalShell>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Parent Saved!"
          message="The parent record has been saved successfully. You can now view them in the Parents list."
          buttonLabel="Back to Parents"
          onClose={() => navigate("/parents")}
        />
      )}
    </Layout>
  );
}