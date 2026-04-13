import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  DollarSign,
  GraduationCap,
  LogOut,
  User,
  Users,
  TrendingUp,
  ChevronDown,
  Bell,
  Activity,
} from "lucide-react";
import Layout from "../components/Layout/Layout";
import { getAuthUser } from "../utils/authSession";
import { getProfileAvatar } from "../utils/profileAvatar";
import { smsApi } from "../services/smsApi";
import { StatCard } from "../components/ui/index.jsx";

const CHART_DATA = [
  { month: "Jan", Boys: 480, Girls: 230 },
  { month: "Feb", Boys: 320, Girls: 140 },
  { month: "Mar", Boys: 370, Girls: 290 },
  { month: "Apr", Boys: 510, Girls: 380 },
  { month: "May", Boys: 160, Girls: 250 },
  { month: "Jun", Boys: 420, Girls: 340 },
  { month: "Jul", Boys: 400, Girls: 330 },
];

const QUICK_LINKS = [
  { label: "HR Dashboard", path: "/hr", color: "bg-blue-500" },
  { label: "Finance", path: "/finance", color: "bg-emerald-500" },
  { label: "Events", path: "/events", color: "bg-violet-500" },
  { label: "Notice Board", path: "/notice-board", color: "bg-amber-500" },
];

function TopBar({ authUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const displayName = authUser?.fullName || authUser?.name || "Admin";
  const displayRole = authUser?.role || "Admin";
  const avatar = getProfileAvatar(displayName, displayRole);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-gray-400 font-medium">Good morning 👋</p>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-1 ring-white" />
        </button>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer"
          >
            <img src={avatar} alt={displayName} className="w-7 h-7 rounded-lg object-cover" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400">{displayRole}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden">
              <button
                type="button"
                onClick={() => navigate("/admin/profile")}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                type="button"
                onClick={() => navigate("/logout")}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TopBar.propTypes = {
  authUser: PropTypes.object,
};

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: <span>{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [counts, setCounts] = useState({ students: "—", teachers: "—", parents: "—" });

  useEffect(() => {
    let active = true;

    async function loadCounts() {
      try {
        const [students, teachers, parents] = await Promise.all([
          smsApi.listStudents(),
          smsApi.listTeachers(),
          smsApi.listParents(),
        ]);
        if (!active) return;
        setCounts({
          students: Array.isArray(students) ? students.length.toLocaleString() : "—",
          teachers: Array.isArray(teachers) ? teachers.length.toLocaleString() : "—",
          parents: Array.isArray(parents) ? parents.length.toLocaleString() : "—",
        });
      } catch {
        // Silently skip — numbers remain "—"
      }
    }

    loadCounts();
    return () => { active = false; };
  }, []);

  return (
    <Layout activeTab="Dashboard">
      <TopBar authUser={authUser} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={GraduationCap} label="Total Students" value={counts.students} colorIndex={0} onClick={() => navigate("/students")} />
        <StatCard icon={User} label="Teachers" value={counts.teachers} colorIndex={1} onClick={() => navigate("/teachers")} />
        <StatCard icon={Users} label="Parents" value={counts.parents} colorIndex={2} onClick={() => navigate("/parents")} />
        <StatCard icon={DollarSign} label="Total Revenue" value="₦19.3M" delta={{ positive: true, text: "+12% this term" }} colorIndex={3} onClick={() => navigate("/finance")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Student Enrollment</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly breakdown by gender</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.3%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CHART_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Boys" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Girls" fill="#86efac" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-gray-400" />
            <h2 className="text-base font-bold text-gray-900">Quick Access</h2>
          </div>
          <div className="space-y-2">
            {QUICK_LINKS.map(({ label, path, color }) => (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left cursor-pointer group"
              >
                <span className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                <span className="ml-auto text-gray-300 group-hover:text-gray-500">→</span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">System</p>
            <button
              type="button"
              onClick={() => navigate("/admin/profile")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">My Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent activity row */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "New student registrations this week", value: "12", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Pending invoice approvals", value: "4", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Active teachers on duty", value: "38", icon: User, color: "text-green-600", bg: "bg-green-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}