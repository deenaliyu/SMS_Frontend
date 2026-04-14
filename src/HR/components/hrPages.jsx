// ── HR Dashboard ─────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { PageHeader, StatCard, Badge, Table, THead, Th, TBody, Tr, Td } from "../../components/ui/index.jsx";
import { Users, UserCheck, UserX, CalendarDays } from "lucide-react";

const TODAY_REQUESTS = [
  { id: "WS6587", name: "Danjuma Danlami", date: "14/7/2025", type: "Sick Leave", status: "Pending" },
  { id: "WS6588", name: "Aisha Abubakar", date: "14/7/2025", type: "Emergency", status: "Accepted" },
  { id: "WS6589", name: "Grace Johnson", date: "14/7/2025", type: "Overtime", status: "Rejected" },
  { id: "WS6590", name: "Emeka Okafor", date: "14/7/2025", type: "Annual Leave", status: "Pending" },
];

const RECENT_ATTENDANCE = [
  { id: "WS6587", name: "Danjuma Danlami", date: "14/7/2025", status: "Present" },
  { id: "WS6588", name: "Aisha Abubakar", date: "14/7/2025", status: "Absent" },
  { id: "WS6589", name: "Grace Johnson", date: "14/7/2025", status: "Present" },
  { id: "WS6590", name: "Emeka Okafor", date: "14/7/2025", status: "Present" },
  { id: "WS6591", name: "Collins Musa", date: "14/7/2025", status: "Present" },
];

export function HrDashboard() {
  const navigate = useNavigate();
  return (
    <Layout activeTab="HR">
      <PageHeader title="HR Dashboard" subtitle="Human resources management and staff overview" />

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Leave / Permission Requests", path: "/hr/leave-permission" },
          { label: "Staff Attendance", path: "/hr/staff-attendance" },
          { label: "Admission Management", path: "/hr/admission-management" },
        ].map(({ label, path }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400 text-green-700 font-semibold py-4 rounded-2xl cursor-pointer transition-all text-sm"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users}     label="Total Staff"        value="2,250" colorIndex={0} />
        <StatCard icon={UserCheck} label="Present Today"      value="2,000" colorIndex={1} />
        <StatCard icon={UserX}     label="Absent Today"       value="250"   colorIndex={4} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Today's Requests</h2>
            <button type="button" onClick={() => navigate("/hr/leave-permission")} className="text-xs text-green-600 font-medium hover:underline cursor-pointer">View all</button>
          </div>
          <Table>
            <THead><Th>Staff</Th><Th>Type</Th><Th center>Status</Th><Th center>Action</Th></THead>
            <TBody>
              {TODAY_REQUESTS.map((r) => (
                <Tr key={r.id}>
                  <Td>
                    <p className="font-medium text-gray-900 text-xs">{r.name}</p>
                    <p className="text-gray-400 text-xs font-mono">{r.id}</p>
                  </Td>
                  <Td muted>{r.type}</Td>
                  <Td center><Badge label={r.status} /></Td>
                  <Td center>
                    <button type="button" onClick={() => navigate("/hr/leave-permission")} className="text-xs text-green-700 font-semibold hover:underline cursor-pointer">View</button>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        {/* Recent attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Attendance</h2>
            <button type="button" onClick={() => navigate("/hr/staff-attendance")} className="text-xs text-green-600 font-medium hover:underline cursor-pointer">View all</button>
          </div>
          <Table>
            <THead><Th>Staff</Th><Th>Date</Th><Th center>Status</Th></THead>
            <TBody>
              {RECENT_ATTENDANCE.map((r) => (
                <Tr key={r.id}>
                  <Td>
                    <p className="font-medium text-gray-900 text-xs">{r.name}</p>
                    <p className="text-gray-400 text-xs font-mono">{r.id}</p>
                  </Td>
                  <Td muted>{r.date}</Td>
                  <Td center><Badge label={r.status} /></Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}

// ── Leave Permission ──────────────────────────────────────────────────────────
import { useState } from "react";
import { X } from "lucide-react";
import { ModalShell, SearchBar, Btn } from "../../components/ui/index.jsx";

const LEAVE_DATA = [
  { id: "WSB5147", name: "Danjuma Danlami", date: "14/3/2025", title: "Sick Leave",    status: "Accepted" },
  { id: "WSB5148", name: "Aisha Abubakar",  date: "15/3/2025", title: "Overtime",      status: "Rejected" },
  { id: "WSB5149", name: "Grace Johnson",   date: "16/3/2025", title: "Emergency",     status: "Pending" },
  { id: "WSB5150", name: "Emeka Okafor",    date: "17/3/2025", title: "Annual Leave",  status: "Pending" },
  { id: "WSB5151", name: "Collins Musa",    date: "18/3/2025", title: "Compassionate", status: "Accepted" },
];

export function LeavePermission() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(null);

  const filtered = LEAVE_DATA.filter((r) =>
    [r.name, r.title, r.status].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout activeTab="HR">
      <PageHeader
        title="Leave & Permission Requests"
        breadcrumbs={[{ label: "HR Dashboard", onClick: () => navigate("/hr") }, { label: "Leave / Permission" }]}
      />

      <div className="mb-4 max-w-xs">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests…" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <THead>
            <Th>#</Th><Th>Staff ID</Th><Th>Name</Th><Th>Date</Th>
            <Th>Leave Type</Th><Th center>Status</Th><Th center>Actions</Th>
          </THead>
          <TBody>
            {filtered.map((r, i) => (
              <Tr key={r.id}>
                <Td muted>{i + 1}</Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.id}</span></Td>
                <Td><span className="font-medium text-gray-900">{r.name}</span></Td>
                <Td muted>{r.date}</Td>
                <Td muted>{r.title}</Td>
                <Td center><Badge label={r.status} /></Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setViewModal(r)} className="text-xs font-semibold text-green-700 border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50 cursor-pointer">View</button>
                    <button type="button" disabled={r.status !== "Pending"} className="text-xs font-semibold text-green-700 border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">Accept</button>
                    <button type="button" disabled={r.status !== "Pending"} className="text-xs font-semibold text-red-600 border border-red-300 rounded-lg px-3 py-1 hover:bg-red-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">Reject</button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      {viewModal && (
        <ModalShell title="Leave Request Details" onClose={() => setViewModal(null)} size="sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{viewModal.name}</p>
                <p className="text-xs text-green-600 font-medium">Teaching Staff</p>
              </div>
              <Badge label={viewModal.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Staff ID", viewModal.id], ["Leave Type", viewModal.title], ["Date of Request", viewModal.date], ["Duration", "15 Days"]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                  <p className="font-semibold text-gray-800">{val}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Reason for Leave</p>
              <p className="text-sm text-gray-600 leading-relaxed">I am requesting this leave to attend to a personal family matter that requires my presence outside the city for approximately two weeks.</p>
            </div>
            {viewModal.status === "Pending" && (
              <div className="flex gap-3 pt-2">
                <Btn className="flex-1" onClick={() => setViewModal(null)}>Accept</Btn>
                <Btn variant="danger" className="flex-1" onClick={() => setViewModal(null)}>Reject</Btn>
              </div>
            )}
          </div>
        </ModalShell>
      )}
    </Layout>
  );
}

// ── Staff Attendance ──────────────────────────────────────────────────────────
const ATTENDANCE_DATA = [
  { id: "WS6587", name: "Danjuma Danlami", date: "14/7/2025", status: "Present", timeIn: "8:55 AM",  timeOut: "5:00 PM", hours: "8h 5m" },
  { id: "WS6588", name: "Aisha Abubakar",  date: "14/7/2025", status: "Absent",  timeIn: "—",        timeOut: "—",       hours: "—" },
  { id: "WS6589", name: "Grace Johnson",   date: "14/7/2025", status: "Present", timeIn: "9:00 AM",  timeOut: "5:00 PM", hours: "8h 0m" },
  { id: "WS6590", name: "Emeka Okafor",    date: "14/7/2025", status: "Present", timeIn: "8:45 AM",  timeOut: "5:10 PM", hours: "8h 25m" },
  { id: "WS6591", name: "Collins Musa",    date: "14/7/2025", status: "Present", timeIn: "9:10 AM",  timeOut: "5:00 PM", hours: "7h 50m" },
  { id: "WS6592", name: "Fatima Sani",     date: "14/7/2025", status: "Absent",  timeIn: "—",        timeOut: "—",       hours: "—" },
];

export function StaffAttendance() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = ATTENDANCE_DATA.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout activeTab="HR">
      <PageHeader
        title="Staff Attendance"
        breadcrumbs={[{ label: "HR Dashboard", onClick: () => navigate("/hr") }, { label: "Staff Attendance" }]}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          ["Present", ATTENDANCE_DATA.filter((r) => r.status === "Present").length, "bg-green-50 text-green-700"],
          ["Absent",  ATTENDANCE_DATA.filter((r) => r.status === "Absent").length,  "bg-red-50 text-red-600"],
          ["Total",   ATTENDANCE_DATA.length, "bg-blue-50 text-blue-700"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`rounded-2xl border border-gray-100 p-4 text-center shadow-sm ${cls}`}>
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[180px] max-w-xs">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff…" />
        </div>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <THead>
            <Th>#</Th><Th>Staff ID</Th><Th>Name</Th><Th>Date</Th>
            <Th center>Status</Th><Th>Check In</Th><Th>Check Out</Th><Th>Work Hours</Th>
          </THead>
          <TBody>
            {filtered.map((r, i) => (
              <Tr key={r.id}>
                <Td muted>{i + 1}</Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.id}</span></Td>
                <Td><span className="font-medium text-gray-900">{r.name}</span></Td>
                <Td muted>{r.date}</Td>
                <Td center><Badge label={r.status} /></Td>
                <Td muted>{r.timeIn}</Td>
                <Td muted>{r.timeOut}</Td>
                <Td muted>{r.hours}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </Layout>
  );
}

// ── Admission Management ──────────────────────────────────────────────────────
const ADMISSIONS = [
  { id: "559", name: "Aisha Abubakar",  class: "SS 1",  date: "14/3/2025", status: "Rejected" },
  { id: "558", name: "Danjuma Danlami", class: "SS 1",  date: "14/3/2025", status: "Pending" },
  { id: "557", name: "Grace Johnson",   class: "JSS 1", date: "13/3/2025", status: "Accepted" },
  { id: "556", name: "Emeka Okafor",    class: "SS 1",  date: "12/3/2025", status: "Accepted" },
  { id: "555", name: "Fatima Sani",     class: "JSS 1", date: "11/3/2025", status: "Accepted" },
  { id: "554", name: "Collins Musa",    class: "JSS 1", date: "10/3/2025", status: "Accepted" },
  { id: "553", name: "Mary Effiong",    class: "SS 1",  date: "09/3/2025", status: "Pending" },
  { id: "552", name: "Samuel Edet",     class: "JSS 1", date: "08/3/2025", status: "Rejected" },
];

export function AdmissionManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = ADMISSIONS.filter((r) =>
    [r.name, r.id].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout activeTab="HR">
      <PageHeader
        title="Admission Management"
        breadcrumbs={[{ label: "HR Dashboard", onClick: () => navigate("/hr") }, { label: "Admissions" }]}
      />

      {/* Summary */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          ["Total", ADMISSIONS.length, "text-blue-700 bg-blue-50"],
          ["Accepted", ADMISSIONS.filter((a) => a.status === "Accepted").length, "text-green-700 bg-green-50"],
          ["Pending",  ADMISSIONS.filter((a) => a.status === "Pending").length,  "text-amber-700 bg-amber-50"],
          ["Rejected", ADMISSIONS.filter((a) => a.status === "Rejected").length, "text-red-600 bg-red-50"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm ${cls}`}>
            <span className="font-semibold">{label}:</span><span className="font-bold">{val}</span>
          </div>
        ))}
      </div>

      <div className="mb-4 max-w-xs">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID…" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <THead>
            <Th>#</Th><Th>Admission No.</Th><Th>Name</Th><Th>Class</Th>
            <Th>Date</Th><Th center>Status</Th><Th center>Action</Th>
          </THead>
          <TBody>
            {filtered.map((r, i) => (
              <Tr key={r.id}>
                <Td muted>{i + 1}</Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.id}</span></Td>
                <Td><span className="font-medium text-gray-900">{r.name}</span></Td>
                <Td muted>{r.class}</Td>
                <Td muted>{r.date}</Td>
                <Td center><Badge label={r.status} /></Td>
                <Td center>
                  <button type="button" onClick={() => navigate("/hr/student-info")} className="text-xs font-semibold text-green-700 border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50 cursor-pointer">View</button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </Layout>
  );
}