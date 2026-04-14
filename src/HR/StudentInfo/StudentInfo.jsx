import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { PageHeader, Badge, Btn, ModalShell } from "../../components/ui/index.jsx";
import { Check, X } from "lucide-react";

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

function Field({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value || "—"}</p>
    </div>
  );
}

const TABS = ["Student Info", "Parent Info"];

export default function AdmissionDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState(null); // "accept" | "reject" | null

  return (
    <Layout activeTab="HR">
      <PageHeader
        title="Admission Detail"
        subtitle={`Admission #${STUDENT.admissionNumber}`}
        breadcrumbs={[
          { label: "HR Dashboard", onClick: () => navigate("/hr") },
          { label: "Admission Management", onClick: () => navigate("/hr/admission-management") },
          { label: STUDENT.firstName + " " + STUDENT.lastName },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Badge label="Pending" />
            <Btn onClick={() => setModal("accept")}>
              <Check className="w-4 h-4 mr-1" /> Accept
            </Btn>
            <Btn variant="danger" onClick={() => setModal("reject")}>
              <X className="w-4 h-4 mr-1" /> Reject
            </Btn>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab, i) => (
          <button key={tab} type="button" onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors
              ${activeTab === i ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {activeTab === 0 && (
          <>
            <h3 className="font-bold text-gray-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <Field label="Admission No."   value={STUDENT.admissionNumber} />
              <Field label="Admission Date"  value={STUDENT.admissionDate} />
              <Field label="Class"           value={STUDENT.class} />
              <Field label="First Name"      value={STUDENT.firstName} />
              <Field label="Middle Name"     value={STUDENT.middleName} />
              <Field label="Last Name"       value={STUDENT.lastName} />
              <Field label="Date of Birth"   value={STUDENT.dateOfBirth} />
              <Field label="Gender"          value={STUDENT.gender} />
              <Field label="State"           value={STUDENT.state} />
              <Field label="LGA"             value={STUDENT.lga} />
              <Field label="Mobile Number"   value={STUDENT.mobileNumber} />
              <Field label="Email"           value={STUDENT.email} />
              <Field label="Previous School" value={STUDENT.previousSchool} />
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <Field label="Address" value={STUDENT.address} />
              </div>
            </div>
          </>
        )}

        {activeTab === 1 && (
          <>
            <h3 className="font-bold text-gray-900 mb-4">Parent / Guardian Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <Field label="Title"           value={PARENT.title} />
              <Field label="First Name"      value={PARENT.firstName} />
              <Field label="Middle Name"     value={PARENT.middleName} />
              <Field label="Last Name"       value={PARENT.lastName} />
              <Field label="Date of Birth"   value={PARENT.dateOfBirth} />
              <Field label="Gender"          value={PARENT.gender} />
              <Field label="State"           value={PARENT.state} />
              <Field label="LGA"             value={PARENT.lga} />
              <Field label="Mobile Number"   value={PARENT.mobileNumber} />
              <Field label="Email"           value={PARENT.email} />
              <Field label="Qualification"   value={PARENT.educationalQualification} />
              <Field label="Occupation"      value={PARENT.occupation} />
              <Field label="Annual Income"   value={PARENT.annualIncome} />
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <Field label="Address" value={PARENT.address} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm modals */}
      {modal === "accept" && (
        <ModalShell title="Accept Admission" onClose={() => setModal(null)} size="sm">
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to <span className="font-semibold text-green-700">accept</span> the admission for{" "}
            <span className="font-semibold">{STUDENT.firstName} {STUDENT.lastName}</span>?
            This will send a confirmation email to the parent.
          </p>
          <div className="flex justify-end gap-3">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => { setModal(null); navigate("/hr/admission-management"); }}>
              <Check className="w-4 h-4 mr-1" /> Yes, Accept
            </Btn>
          </div>
        </ModalShell>
      )}

      {modal === "reject" && (
        <ModalShell title="Reject Admission" onClose={() => setModal(null)} size="sm">
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to <span className="font-semibold text-red-600">reject</span> the admission for{" "}
            <span className="font-semibold">{STUDENT.firstName} {STUDENT.lastName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => { setModal(null); navigate("/hr/admission-management"); }}>
              <X className="w-4 h-4 mr-1" /> Yes, Reject
            </Btn>
          </div>
        </ModalShell>
      )}
    </Layout>
  );
}