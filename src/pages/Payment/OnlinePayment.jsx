import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection";
import { useState } from "react";
import { CreditCard, CheckCircle, Search, AlertCircle } from "lucide-react";

const FEE_TYPES = [
  { id: "tuition", label: "Tuition Fee", amount: 85000 },
  { id: "lab", label: "Laboratory Fee", amount: 15000 },
  { id: "ict", label: "ICT / Computer Fee", amount: 10000 },
  { id: "sports", label: "Sports Development Fee", amount: 8000 },
  { id: "exam", label: "Examination Fee (WAEC/NECO)", amount: 35000 },
  { id: "textbook", label: "Textbook & Material Fee", amount: 20000 },
  { id: "uniform", label: "School Uniform (Set)", amount: 12000 },
  { id: "pta", label: "PTA Levy", amount: 5000 },
];

const TERMS = ["1st Term", "2nd Term", "3rd Term"];
const SESSIONS = ["2024/2025", "2025/2026", "2026/2027"];

function fmt(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function OnlinePayment() {
  const [step, setStep] = useState(1); // 1=lookup, 2=select fees, 3=confirm
  const [studentId, setStudentId] = useState("");
  const [session, setSession] = useState("2025/2026");
  const [term, setTerm] = useState("1st Term");
  const [selectedFees, setSelectedFees] = useState([]);
  const [isLooking, setIsLooking] = useState(false);
  const [student, setStudent] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const total = selectedFees.reduce((sum, id) => {
    const fee = FEE_TYPES.find((f) => f.id === id);
    return sum + (fee?.amount || 0);
  }, 0);

  async function handleLookup(e) {
    e.preventDefault();
    if (!studentId.trim()) return;
    setIsLooking(true);
    setLookupError("");

    // Simulate lookup (in production, call smsApi.listStudents() and filter)
    await new Promise((r) => setTimeout(r, 1000));

    if (studentId.toUpperCase().startsWith("STU")) {
      setStudent({
        name: "Yusuf Danladi",
        studentId: studentId.toUpperCase(),
        class: "JSS 2",
        section: "Section A",
      });
      setStep(2);
    } else {
      setLookupError("Student ID not found. Please check the ID and try again.");
    }
    setIsLooking(false);
  }

  function toggleFee(id) {
    setSelectedFees((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  async function handlePayment() {
    if (selectedFees.length === 0) return;
    setIsProcessing(true);
    // In production: initialise Paystack inline
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setPaid(true);
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-5">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-2">
              {fmt(total)} has been received for{" "}
              <span className="font-semibold text-gray-700">{student?.name}</span>.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              A receipt has been sent to the registered email address.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm mb-6 space-y-1">
              <p className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium">{student?.name}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-medium">{student?.studentId}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Session</span><span className="font-medium">{session} — {term}</span></p>
              <p className="flex justify-between border-t border-gray-200 pt-1 mt-1"><span className="font-bold">Total Paid</span><span className="font-bold text-green-700">{fmt(total)}</span></p>
            </div>
            <button
              type="button"
              onClick={() => { setPaid(false); setStep(1); setStudentId(""); setStudent(null); setSelectedFees([]); }}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm cursor-pointer"
            >
              Make Another Payment
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="Online School Fees Payment"
        text="Pay your child's school fees securely online. Instant receipts issued upon payment confirmation."
        image="https://picsum.photos/seed/payment-hero/1600/600"
        compact
      />

      <div className="max-w-2xl mx-auto px-5 py-12">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Student Lookup", "Select Fees", "Confirm & Pay"].map((label, i) => {
            const stepNum = i + 1;
            const done = step > stepNum;
            const current = step === stepNum;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? "bg-green-600 text-white" : current ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-200 text-gray-500"}`}>
                  {done ? "✓" : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${current ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > stepNum ? "bg-green-500" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Step 1: Lookup */}
          {step === 1 && (
            <form onSubmit={handleLookup} className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Find Student</h2>
                <p className="text-sm text-gray-400">Enter your ward's student ID to begin.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setLookupError(""); }}
                    placeholder="e.g. STU001"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                  />
                </div>
                {lookupError && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {lookupError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Session</label>
                  <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
                    {SESSIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Term</label>
                  <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
                    {TERMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLooking || !studentId.trim()}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm cursor-pointer transition-colors"
              >
                {isLooking ? "Looking up…" : "Find Student →"}
              </button>
            </form>
          )}

          {/* Step 2: Select fees */}
          {step === 2 && student && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Select Fees</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
                  <p className="font-semibold text-green-800">{student.name}</p>
                  <p className="text-green-600 text-xs">{student.studentId} · {student.class} · {session} — {term}</p>
                </div>
              </div>

              <div className="space-y-2">
                {FEE_TYPES.map((fee) => {
                  const checked = selectedFees.includes(fee.id);
                  return (
                    <label
                      key={fee.id}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer transition-all ${checked ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFee(fee.id)}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-700">{fee.label}</span>
                      <span className={`text-sm font-bold ${checked ? "text-green-700" : "text-gray-500"}`}>
                        {fmt(fee.amount)}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{selectedFees.length} fee(s) selected</p>
                  <p className="text-2xl font-extrabold text-green-700">{fmt(total)}</p>
                </div>
                <button
                  type="button"
                  disabled={selectedFees.length === 0}
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-40 text-sm cursor-pointer"
                >
                  Continue →
                </button>
              </div>

              <button type="button" onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">← Change student</button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && student && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Confirm Payment</h2>
                <p className="text-sm text-gray-400">Review your order before proceeding.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium">{student.name}</span></p>
                <p className="flex justify-between"><span className="text-gray-500">Class</span><span className="font-medium">{student.class}</span></p>
                <p className="flex justify-between"><span className="text-gray-500">Session</span><span className="font-medium">{session} — {term}</span></p>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {selectedFees.map((id) => {
                    const fee = FEE_TYPES.find((f) => f.id === id);
                    return fee ? (
                      <p key={id} className="flex justify-between text-xs py-1">
                        <span className="text-gray-600">{fee.label}</span>
                        <span>{fmt(fee.amount)}</span>
                      </p>
                    ) : null;
                  })}
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-700 text-base">{fmt(total)}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Payment is powered by Paystack. You will be redirected to a secure payment page. Do not close the window.
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessing ? "Processing…" : `Pay ${fmt(total)} via Paystack`}
              </button>

              <button type="button" onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer w-full text-center">← Back to fee selection</button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 Secured by Paystack · All transactions are encrypted
        </p>
      </div>

      <Footer />
    </div>
  );
}