import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection";
import {
  Search, CheckCircle, FileText, GraduationCap,
  ArrowRight, Clock, AlertCircle, Mail, Phone,
} from "lucide-react";
import { smsApi } from "../../services/smsApi";

// ── How to apply steps ─────────────────────────────────────────
const HOW_STEPS = [
  { n: "01", title: "Fill Application Form", desc: "Complete the online student admission form with accurate personal and academic details." },
  { n: "02", title: "Submit Documents", desc: "Upload required documents — birth certificate, passport photo, previous school report card." },
  { n: "03", title: "Entrance Assessment", desc: "Eligible applicants are invited for a brief entrance assessment appropriate to their class level." },
  { n: "04", title: "Admission Decision", desc: "Results are communicated within 5 working days via email and SMS to the provided contacts." },
];

// ── Requirements ───────────────────────────────────────────────
const REQUIREMENTS = [
  "Completed admission application form",
  "Recent passport photograph (white background)",
  "Certified copy of birth certificate",
  "Last two terms' school report cards",
  "Transfer certificate from previous school (JSS & SSS applicants)",
  "Medical fitness certificate (not older than 3 months)",
];

// ── Status badge helpers ───────────────────────────────────────
const STATUS_STYLES = {
  accepted: { bg: "bg-green-50 border-green-200", dot: "bg-green-500", text: "text-green-700", label: "Accepted" },
  pending:  { bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500", text: "text-amber-700", label: "Pending Review" },
  rejected: { bg: "bg-red-50 border-red-200", dot: "bg-red-400", text: "text-red-700", label: "Not Successful" },
};

// Simulate local lookup against saved students / fixed demo IDs
function simulateLookup(id) {
  const idUpper = id.trim().toUpperCase();
  if (idUpper === "ADM001" || idUpper === "WS001") return { status: "accepted", name: "Amina Bello", class: "JSS 1" };
  if (idUpper === "ADM002" || idUpper === "WS002") return { status: "pending",  name: "Yusuf Danladi", class: "JSS 2" };
  if (idUpper.startsWith("ADM") || idUpper.startsWith("WS")) return { status: "rejected", name: "Applicant", class: "—" };
  return null;
}

export default function Admission() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);   // { status, name, class } | null
  const [notFound, setNotFound] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    const id = admissionNo.trim();
    if (!id) return;

    setIsChecking(true);
    setResult(null);
    setNotFound(false);

    // Brief delay for UX
    await new Promise((r) => setTimeout(r, 700));

    // Try real API first, fall back to local simulation
    try {
      const students = await smsApi.listStudents();
      const match = Array.isArray(students)
        ? students.find((s) =>
            String(s.admissionNumber || "").toUpperCase() === id.toUpperCase() ||
            String(s.studentId || "").toUpperCase() === id.toUpperCase(),
          )
        : null;

      if (match) {
        setResult({ status: "accepted", name: match.name, class: match.className || match.class });
      } else {
        // Fallback to demo lookup
        const demo = simulateLookup(id);
        if (demo) setResult(demo);
        else setNotFound(true);
      }
    } catch {
      const demo = simulateLookup(id);
      if (demo) setResult(demo);
      else setNotFound(true);
    } finally {
      setIsChecking(false);
    }
  }

  const statusStyle = result ? (STATUS_STYLES[result.status] || STATUS_STYLES.pending) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="Admissions"
        text="Join the WiSchool family. We welcome applications from students who are eager to learn, grow, and make a difference in their communities."
        image="https://picsum.photos/seed/admission-hero/1600/600"
        btn
      />

      {/* Check Admission Status */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Check Admission Status</h2>
                <p className="text-xs text-gray-400 mt-0.5">Enter your admission number or student ID</p>
              </div>
            </div>

            <form onSubmit={handleCheck}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={admissionNo}
                  onChange={(e) => { setAdmissionNo(e.target.value); setResult(null); setNotFound(false); }}
                  placeholder="e.g. ADM001 or WS001"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                />
                <button
                  type="submit"
                  disabled={isChecking || !admissionNo.trim()}
                  className="px-6 py-3 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 disabled:opacity-50 cursor-pointer transition-colors flex-shrink-0"
                >
                  {isChecking ? "Checking…" : "Check Status"}
                </button>
              </div>
            </form>

            {/* Result */}
            {result && statusStyle && (
              <div className={`mt-5 border rounded-2xl p-5 ${statusStyle.bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`} />
                  <span className={`font-bold text-sm ${statusStyle.text}`}>{statusStyle.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">Applicant Name</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">Class Applied</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{result.class}</p>
                  </div>
                </div>
                {result.status === "accepted" && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-green-700 text-xs font-medium">
                      🎉 Congratulations! Please visit the school office with your acceptance letter and required documents to complete enrolment.
                    </p>
                  </div>
                )}
                {result.status === "pending" && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-amber-700 text-xs font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Your application is currently under review. Results are communicated within 5 working days.
                    </p>
                  </div>
                )}
                {result.status === "rejected" && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-red-600 text-xs font-medium">
                      We regret to inform you that your application was unsuccessful at this time. Please contact the admissions office for guidance.
                    </p>
                  </div>
                )}
              </div>
            )}

            {notFound && (
              <div className="mt-5 border border-gray-200 rounded-2xl p-5 bg-gray-50 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Admission number not found</p>
                  <p className="text-xs text-gray-500 mt-0.5">Please double-check your number or contact the admissions office.</p>
                </div>
              </div>
            )}

            {/* Demo hint */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              Demo: try <code className="bg-gray-100 px-1 rounded">ADM001</code> (accepted), <code className="bg-gray-100 px-1 rounded">ADM002</code> (pending)
            </p>
          </div>
        </div>
      </div>

      {/* Apply CTA cards */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Get Started</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Ready to Apply?</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Choose the pathway that applies to you below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* New student */}
            <div className="border-2 border-green-200 rounded-2xl p-6 bg-green-50 hover:border-green-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4 shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">New Student Admission</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                For prospective students applying to WiSchool for the first time. Complete the full admission form with student and parent details.
              </p>
              <Link
                to="/student-admission"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Apply for Admission <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Already enrolled */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white hover:border-green-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Student Registration</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                For students who have already received an admission offer. Create your student portal account to access school resources.
              </p>
              <Link
                to="/student-registration"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-300 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Register Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How to Apply */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14">
        <div className="text-center mb-10">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Process</p>
          <h2 className="text-2xl font-extrabold text-gray-900">How to Apply</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_STEPS.map(({ n, title, desc }) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative">
              <span className="absolute top-5 right-5 text-3xl font-black text-gray-100">{n}</span>
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold mb-4 shadow-sm">
                {n.replace("0", "")}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-3">What You Need</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Admission Requirements</h2>
              <ul className="space-y-3">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact block */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7">
              <h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-5">Our admissions team is available Monday to Friday, 8:00 AM – 4:00 PM.</p>

              <div className="space-y-4">
                {[
                  { Icon: Phone, label: "Phone", value: "+234 801 234 5678" },
                  { Icon: Mail, label: "Email", value: "admissions@wischool.edu.ng" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-green-300 text-green-700 font-semibold text-sm rounded-xl hover:bg-green-50 transition-colors"
                >
                  Send Us a Message <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}