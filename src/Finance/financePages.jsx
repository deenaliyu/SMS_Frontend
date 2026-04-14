// ── Payment History ───────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { paymentData } from "./data";
import {
  PageHeader, SearchBar, Badge, Table, THead, Th, TBody, Tr, Td,
  Pagination, Select, EmptyState,
} from "../components/ui/index.jsx";
import { Receipt } from "lucide-react";

export function PaymentHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return paymentData.filter((d) => {
      const statusMatch = statusFilter === "all" || String(d.status || "").toLowerCase() === statusFilter;
      const textMatch = !text || [d.name, d.studentId, d.class].some((v) => String(v || "").toLowerCase().includes(text));
      return statusMatch && textMatch;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout activeTab="Finance">
      <PageHeader
        title="Payment History"
        breadcrumbs={[{ label: "Finance", onClick: () => navigate("/finance") }, { label: "Payment History" }]}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search student, ID…" />
        </div>
        <div className="w-44">
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </Select>
        </div>
        <div className="w-44">
          <Select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
            <option value="all">All Sessions</option>
            <option value="2024-2025">2024/2025</option>
            <option value="2025-2026">2025/2026</option>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <THead>
            <Th>#</Th><Th>Student ID</Th><Th>Name</Th><Th>Class</Th>
            <Th>Payment Date</Th><Th>Amount</Th><Th>Method</Th><Th center>Status</Th>
          </THead>
          <TBody>
            {paged.length === 0 ? (
              <tr><td colSpan={8}><EmptyState icon={Receipt} title="No payment records" description="Adjust filters to see results." /></td></tr>
            ) : paged.map((d, i) => (
              <Tr key={d.id}>
                <Td muted>{(page - 1) * PER_PAGE + i + 1}</Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{d.studentId}</span></Td>
                <Td><span className="font-medium text-gray-900">{d.name}</span></Td>
                <Td muted>{d.class}</Td>
                <Td muted>{d.paymentDate}</Td>
                <Td><span className="font-semibold text-gray-900">₦{Number(d.amountPaid).toLocaleString("en-NG")}</span></Td>
                <Td muted>{d.paymentMethod}</Td>
                <Td center><Badge label={d.status} /></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>
    </Layout>
  );
}

// ── Staff Salary (tabbed) ─────────────────────────────────────────────────────
import { useEffect, useState as useState2, useMemo as useMemo2 } from "react";
import { smsApi } from "../services/smsApi";
import { teacherPayments, teacherAttendance } from "./data";
import { Badge as Badge2, Table as T2, THead as TH2, Th as Th2, TBody as TB2, Tr as Tr2, Td as Td2, Pagination as Pg2 } from "../components/ui/index.jsx";

export function StaffSalary() {
  const navigate = useNavigate();
  const [tab, setTab] = useState2(0); // 0=history, 1=attendance
  const [payments, setPayments2] = useState2(teacherPayments);
  const [page2, setPage2] = useState2(1);
  const PER_PAGE2 = 9;

  useEffect(() => {
    let active = true;
    smsApi.listFinancePayments()
      .then((res) => { if (active && Array.isArray(res) && res.length > 0) setPayments2(res); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const salaryPages = Math.max(1, Math.ceil(payments.length / PER_PAGE2));
  const salaryPaged = payments.slice((page2 - 1) * PER_PAGE2, page2 * PER_PAGE2);
  const attendPages = Math.max(1, Math.ceil(teacherAttendance.length / PER_PAGE2));
  const attendPaged = teacherAttendance.slice((page2 - 1) * PER_PAGE2, page2 * PER_PAGE2);

  return (
    <Layout activeTab="Finance">
      <PageHeader
        title="Staff Salaries"
        breadcrumbs={[{ label: "Finance", onClick: () => navigate("/finance") }, { label: "Staff Salaries" }]}
        action={<button type="button" onClick={() => navigate("/finance/staff-salary/pay")} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 cursor-pointer">Pay Salary</button>}
      />

      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {["Salary History", "Staff Attendance"].map((label, i) => (
          <button key={label} type="button" onClick={() => { setTab(i); setPage2(1); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${tab === i ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <T2>
            <TH2><Th2>#</Th2><Th2>Teacher ID</Th2><Th2>Name</Th2><Th2>Payment Date</Th2><Th2>Gross</Th2><Th2>Deductions</Th2><Th2>Net Salary</Th2><Th2 center>Status</Th2></TH2>
            <TB2>
              {salaryPaged.map((d, i) => (
                <Tr2 key={`${d.id}-${i}`}>
                  <Td2 muted>{(page2 - 1) * PER_PAGE2 + i + 1}</Td2>
                  <Td2><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{d.teacherId}</span></Td2>
                  <Td2><span className="font-medium text-gray-900">{d.name}</span></Td2>
                  <Td2 muted>{d.paymentDate}</Td2>
                  <Td2 muted>₦{Number(d.grossAmount).toLocaleString("en-NG")}</Td2>
                  <Td2 muted>₦{Number(d.deductions).toLocaleString("en-NG")}</Td2>
                  <Td2><span className="font-semibold text-gray-900">₦{Number(d.netSalary).toLocaleString("en-NG")}</span></Td2>
                  <Td2 center><Badge2 label={d.status || "Paid"} /></Td2>
                </Tr2>
              ))}
            </TB2>
          </T2>
          <Pg2 currentPage={page2} totalPages={salaryPages} onPrev={() => setPage2((p) => p - 1)} onNext={() => setPage2((p) => p + 1)} />
        </div>
      )}

      {tab === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <T2>
            <TH2><Th2>#</Th2><Th2>Teacher ID</Th2><Th2>Name</Th2><Th2>Days Present</Th2><Th2>Days Absent</Th2><Th2>Leave Days</Th2></TH2>
            <TB2>
              {attendPaged.map((d, i) => (
                <Tr2 key={d.id}>
                  <Td2 muted>{(page2 - 1) * PER_PAGE2 + i + 1}</Td2>
                  <Td2><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{d.teacherId}</span></Td2>
                  <Td2><span className="font-medium text-gray-900">{d.name}</span></Td2>
                  <Td2><span className="font-semibold text-green-700">{d.daysPresent}</span></Td2>
                  <Td2><span className="font-semibold text-red-500">{d.daysAbsent}</span></Td2>
                  <Td2 muted>{d.leave}</Td2>
                </Tr2>
              ))}
            </TB2>
          </T2>
          <Pg2 currentPage={page2} totalPages={attendPages} onPrev={() => setPage2((p) => p - 1)} onNext={() => setPage2((p) => p + 1)} />
        </div>
      )}
    </Layout>
  );
}

// ── Pay Salary ────────────────────────────────────────────────────────────────
import { useState as useState3, useEffect as useEffect3, useMemo as useMemo3 } from "react";
import { smsApi as smsApi3 } from "../services/smsApi";
import { teacherPayments as tpSeed } from "./data";
import { FormField, Btn } from "../components/ui/index.jsx";

export function PaySalary() {
  const navigate = useNavigate();
  const [form3, setForm3] = useState3({ teacherId: "", staffName: "", payDay: "", grossSalary: "", deductions: "", netSalary: "" });
  const [savedTeachers, setSaved3] = useState3([]);
  const [error3, setError3] = useState3("");
  const [success3, setSuccess3] = useState3("");
  const [isSaving3, setIsSaving3] = useState3(false);

  useEffect3(() => {
    let active = true;
    smsApi3.listTeachers().then((res) => { if (active) setSaved3(Array.isArray(res) ? res : []); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const staffOptions = useMemo3(() => {
    const map = new Map();
    tpSeed.forEach((t) => { if (!map.has(t.teacherId)) map.set(t.teacherId, t); });
    savedTeachers.forEach((t) => { if (t.teacherId && !map.has(t.teacherId)) map.set(t.teacherId, { teacherId: t.teacherId, name: t.name, grossAmount: "", deductions: "", netSalary: "" }); });
    return Array.from(map.values());
  }, [savedTeachers]);

  function handleSelect(id) {
    const sel = staffOptions.find((t) => t.teacherId === id);
    if (!sel) return;
    setForm3((p) => ({
      ...p,
      teacherId: sel.teacherId,
      staffName: sel.name,
      grossSalary: sel.grossAmount !== "" ? String(sel.grossAmount) : p.grossSalary,
      deductions: sel.deductions !== "" ? String(sel.deductions) : p.deductions,
      netSalary: sel.netSalary !== "" ? String(sel.netSalary) : p.netSalary,
    }));
  }

  async function handleProcess() {
    if (!form3.teacherId || !form3.payDay || !form3.grossSalary || !form3.netSalary) {
      setError3("Please complete all required fields."); return;
    }
    setIsSaving3(true); setError3(""); setSuccess3("");
    try {
      await smsApi3.createFinancePayment({
        id: Date.now(), teacherId: form3.teacherId, name: form3.staffName,
        paymentDate: form3.payDay, grossAmount: Number(form3.grossSalary) || 0,
        deductions: Number(form3.deductions) || 0, netSalary: Number(form3.netSalary) || 0, status: "Paid",
      });
      setSuccess3("Salary processed and saved successfully.");
      setForm3({ teacherId: "", staffName: "", payDay: "", grossSalary: "", deductions: "", netSalary: "" });
    } catch (err) {
      setError3(err.message || "Unable to process salary.");
    } finally {
      setIsSaving3(false);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  return (
    <Layout activeTab="Finance">
      <PageHeader
        title="Pay Salary"
        breadcrumbs={[{ label: "Finance", onClick: () => navigate("/finance") }, { label: "Staff Salaries", onClick: () => navigate("/finance/staff-salary") }, { label: "Pay Salary" }]}
      />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <h2 className="font-bold text-gray-900 mb-5">Process Staff Salary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <FormField label="Staff Name" required>
            <select value={form3.teacherId} onChange={(e) => handleSelect(e.target.value)} className={inputCls}>
              <option value="">Select staff member</option>
              {staffOptions.map((t) => <option key={t.teacherId} value={t.teacherId}>{t.name}</option>)}
            </select>
          </FormField>
          <FormField label="Payment Date" required>
            <input type="date" value={form3.payDay} onChange={(e) => setForm3((p) => ({ ...p, payDay: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Gross Salary (₦)" required>
            <input type="number" value={form3.grossSalary} onChange={(e) => setForm3((p) => ({ ...p, grossSalary: e.target.value }))} placeholder="0.00" className={inputCls} />
          </FormField>
          <FormField label="Deductions (₦)">
            <input type="number" value={form3.deductions} onChange={(e) => setForm3((p) => ({ ...p, deductions: e.target.value }))} placeholder="0.00" className={inputCls} />
          </FormField>
          <FormField label="Net Salary (₦)" required>
            <input type="number" value={form3.netSalary} onChange={(e) => setForm3((p) => ({ ...p, netSalary: e.target.value }))} placeholder="0.00" className={inputCls} />
          </FormField>
        </div>
        {error3 && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error3}</div>}
        {success3 && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success3}</div>}
        <div className="flex gap-3">
          <Btn variant="secondary" onClick={() => navigate("/finance/staff-salary")}>Cancel</Btn>
          <Btn onClick={handleProcess} disabled={isSaving3}>{isSaving3 ? "Processing…" : "Process Salary"}</Btn>
        </div>
      </div>
    </Layout>
  );
}

// ── Generate Invoice ──────────────────────────────────────────────────────────
import { useState as useState4, useEffect as useEffect4, useMemo as useMemo4 } from "react";
import { smsApi as smsApi4 } from "../services/smsApi";
import { FormField as FF4, Btn as Btn4, SuccessModal as SM4 } from "../components/ui/index.jsx";

const INIT_INV = { parentName: "", studentName: "", studentId: "", paymentFor: "", session: "", term: "", amount: "", dueDate: "", status: "Unpaid" };

export function GenerateInvoice() {
  const navigate = useNavigate();
  const [form4, setForm4] = useState4(INIT_INV);
  const [parents4, setParents4] = useState4([]);
  const [students4, setStudents4] = useState4([]);
  const [isSaving4, setIsSaving4] = useState4(false);
  const [error4, setError4] = useState4("");
  const [showSuccess4, setShowSuccess4] = useState4(false);

  useEffect4(() => {
    let active = true;
    Promise.all([smsApi4.listParents(), smsApi4.listStudents()]).then(([p, s]) => {
      if (active) { setParents4(Array.isArray(p) ? p : []); setStudents4(Array.isArray(s) ? s : []); }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  function handleChange4(e) {
    const { name, value } = e.target;
    setForm4((p) => ({ ...p, [name]: value }));
    if (error4) setError4("");
  }

  async function handleSubmit4(e) {
    e.preventDefault();
    if (!form4.parentName || !form4.studentName || !form4.paymentFor || !form4.amount) {
      setError4("Parent, student, payment item, and amount are required."); return;
    }
    setIsSaving4(true); setError4("");
    try {
      await smsApi4.createInvoice({ ...form4, invoiceId: `INV-${Date.now()}`, name: form4.parentName, title: form4.paymentFor, createdOn: new Date().toISOString() });
      setShowSuccess4(true);
      setForm4(INIT_INV);
    } catch (err) {
      setError4(err.message || "Unable to create invoice.");
    } finally {
      setIsSaving4(false);
    }
  }

  const inputCls4 = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white";

  return (
    <Layout activeTab="Finance">
      <PageHeader
        title="Generate Invoice"
        breadcrumbs={[{ label: "Finance", onClick: () => navigate("/finance") }, { label: "Generate Invoice" }]}
        action={<button type="button" onClick={() => navigate("/finance/invoices")} className="text-sm text-green-600 font-semibold hover:underline cursor-pointer">Open Invoices →</button>}
      />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSubmit4} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FF4 label="Parent Name" required>
              <select name="parentName" value={form4.parentName} onChange={handleChange4} className={inputCls4}>
                <option value="">Select parent</option>
                {parents4.map((p) => <option key={p.id || p.parentId} value={p.name || p.parentName}>{p.name || p.parentName}</option>)}
              </select>
            </FF4>
            <FF4 label="Student Name" required>
              <select name="studentName" value={form4.studentName} onChange={handleChange4} className={inputCls4}>
                <option value="">Select student</option>
                {students4.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </FF4>
            <FF4 label="Student ID">
              <input name="studentId" value={form4.studentId} onChange={handleChange4} placeholder="Auto-filled or enter manually" className={inputCls4} />
            </FF4>
            <FF4 label="Payment For" required>
              <input name="paymentFor" value={form4.paymentFor} onChange={handleChange4} placeholder="e.g. Tuition Fee" className={inputCls4} />
            </FF4>
            <FF4 label="Session">
              <select name="session" value={form4.session} onChange={handleChange4} className={inputCls4}>
                <option value="">Select session</option>
                {["2024/2025","2025/2026","2026/2027"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FF4>
            <FF4 label="Term">
              <select name="term" value={form4.term} onChange={handleChange4} className={inputCls4}>
                <option value="">Select term</option>
                {["1st Term","2nd Term","3rd Term"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </FF4>
            <FF4 label="Amount (₦)" required>
              <input type="number" name="amount" value={form4.amount} onChange={handleChange4} placeholder="0.00" className={inputCls4} />
            </FF4>
            <FF4 label="Due Date">
              <input type="date" name="dueDate" value={form4.dueDate} onChange={handleChange4} className={inputCls4} />
            </FF4>
          </div>

          {error4 && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error4}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <Btn4 variant="secondary" type="button" onClick={() => navigate("/finance")}>Cancel</Btn4>
            <Btn4 type="submit" disabled={isSaving4}>{isSaving4 ? "Generating…" : "Generate Invoice"}</Btn4>
          </div>
        </form>
      </div>

      {showSuccess4 && (
        <SM4
          title="Invoice Generated!"
          message="The invoice has been created and saved. You can view it in the Invoices section."
          buttonLabel="Open Invoices"
          onClose={() => { setShowSuccess4(false); navigate("/finance/invoices"); }}
        />
      )}
    </Layout>
  );
}