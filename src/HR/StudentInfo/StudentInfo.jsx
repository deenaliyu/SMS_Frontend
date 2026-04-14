import { useState } from "react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Btn, Badge, ModalShell } from "../../components/ui/index.jsx";

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <div className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800">
        {value || "—"}
      </div>
    </div>
  );
}

const STUDENT = {
  admissionNumber: "600", admissionDate: "14/3/2024", class: "SS 1",
  firstName: "Danlami", middleName: "Nil", lastName: "Danjuma",
  dateOfBirth: "01/03/2008", gender: "Male", address: "123 Nassarawa GRA, Kano",
  state: "Kano", email: "danjumadanlami2008@gmail.com", lga: "Nasarawa",
  mobileNumber: "08121345678", previousSchool: "Jubril Memorial School",
};

const PARENT = {
  title: "Mr", firstName: "DanJuma", middleName: "Nil", lastName: "Alfa",
  dateOfBirth: "01/12/1973", gender: "Male", address: "123 Nassarawa GRA, Kano",
  state: "Kano", lga: "Nasarawa", email: "danjumaalfa@gmail.com",
  mobileNumber: "09012345678", educationalQualification: "Msc. Cyber Security",
  occupation: "Civil Servant", annualIncome: "₦2,345,213",
};

export default function AdmissionDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [modal, setModal] = useState(null); // "accept" | "reject" | null

  function handleBack() {
    setModal(null);
    navigate("/hr/admission-management");
  }

  return (
    <Layout activeTab="HR">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <button type="button" onClick={() => navigate("/hr")} className="hover:text-gray-600 cursor-pointer">HR Dashboard</button>
            <span>/</span>
            <button type="button" onClick={() => navigate("/hr/admission-management")} className="hover:text-gray-600 cursor-pointer">Admission</button>
            <span>/</span>
            <span className="text-gray-700 font-medium">Danjuma Danlami</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Danjuma Danlami</h1>
          <p className="text-sm text-gray-500 mt-0.5">Admission No. 600 · SS 1</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="primary" onClick={() => setModal("accept")}>
            <Check className="w-4 h-4" /> Accept
          </Btn>
          <Btn variant="danger" onClick={() => setModal("reject")}>
            <X className="w-4 h-4" /> Reject
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[["student", "Student Info"], ["parent", "Parent / Guardian Info"]].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === key ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Student Info */}
      {activeTab === "student" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Admission Number" value={STUDENT.admissionNumber} />
            <Field label="Admission Date" value={STUDENT.admissionDate} />
            <Field label="Class" value={STUDENT.class} />
            <Field label="First Name" value={STUDENT.firstName} />
            <Field label="Middle Name" value={STUDENT.middleName} />
            <Field label="Last Name" value={STUDENT.lastName} />
            <Field label="Date of Birth" value={STUDENT.dateOfBirth} />
            <Field label="Gender" value={STUDENT.gender} />
            <Field label="State" value={STUDENT.state} />
            <Field label="LGA" value={STUDENT.lga} />
            <Field label="Mobile Number" value={STUDENT.mobileNumber} />
            <Field label="Previous School" value={STUDENT.previousSchool} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Address" value={STUDENT.address} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Email" value={STUDENT.email} />
            </div>
          </div>
        </div>
      )}

      {/* Parent Info */}
      {activeTab === "parent" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Title" value={PARENT.title} />
            <Field label="First Name" value={PARENT.firstName} />
            <Field label="Middle Name" value={PARENT.middleName} />
            <Field label="Last Name" value={PARENT.lastName} />
            <Field label="Date of Birth" value={PARENT.dateOfBirth} />
            <Field label="Gender" value={PARENT.gender} />
            <Field label="State" value={PARENT.state} />
            <Field label="LGA" value={PARENT.lga} />
            <Field label="Mobile Number" value={PARENT.mobileNumber} />
            <Field label="Education" value={PARENT.educationalQualification} />
            <Field label="Occupation" value={PARENT.occupation} />
            <Field label="Annual Income" value={PARENT.annualIncome} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Address" value={PARENT.address} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Email" value={PARENT.email} />
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {modal === "accept" && (
        <ModalShell title="Confirm Acceptance" onClose={() => setModal(null)} size="sm">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Accept Admission</h3>
            <p className="text-sm text-gray-500 mb-6">
              Approving the admission request for <strong>Danjuma Danlami</strong>. A notification will be sent to the applicant and guardian.
            </p>
            <div className="flex gap-3">
              <Btn variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="primary" className="flex-1" onClick={handleBack}>Confirm Acceptance</Btn>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Reject Modal */}
      {modal === "reject" && (
        <ModalShell title="Confirm Rejection" onClose={() => setModal(null)} size="sm">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Reject Admission</h3>
            <p className="text-sm text-gray-500 mb-6">
              Rejecting the admission request for <strong>Danjuma Danlami</strong>. A notification will be sent to the applicant and guardian.
            </p>
            <div className="flex gap-3">
              <Btn variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="danger" className="flex-1" onClick={handleBack}>Confirm Rejection</Btn>
            </div>
          </div>
        </ModalShell>
      )}
    </Layout>
  );
}