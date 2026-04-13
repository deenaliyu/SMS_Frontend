import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, LogOut, User, Users } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { getAuthUser } from "../utils/authSession";
import { getProfileAvatar } from "../utils/profileAvatar";

const data = [
  { month: "Jan", Boys: 500, Girls: 250 },
  { month: "Feb", Boys: 330, Girls: 120 },
  { month: "Mar", Boys: 330, Girls: 280 },
  { month: "Apr", Boys: 490, Girls: 370 },
  { month: "May", Boys: 150, Girls: 230 },
  { month: "Jun", Boys: 400, Girls: 330 },
  { month: "Jul", Boys: 390, Girls: 320 },
];

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const displayName = authUser?.fullName || authUser?.name || "School Admin";
  const displayRole = authUser?.role || "Admin";
  const profileImage = getProfileAvatar(displayName, displayRole);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout activeTab="Dashboard">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-4 py-4 shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <img src={profileImage} alt={displayName} className="w-10 h-10 rounded-full object-cover" />

              <div className="text-left hidden sm:block">
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-gray-500">{displayRole}</p>
              </div>

              <svg
                className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg z-50 p-3 space-y-2">
                <button
                  onClick={() => navigate("/Adminprofile")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>

                <button
                  onClick={() => navigate("/logout")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 rounded text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} label="Total Students" value="150000" />
            <StatCard icon={User} label="Teachers" value="2250" />
            <StatCard icon={User} label="Parents" value="5690" />
            <StatCard icon={DollarSign} label="Earnings" value="N19,300,000" />
          </div>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-md font-semibold mb-2">Number of Students</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Boys" fill="#22c55e" />
                  <Bar dataKey="Girls" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4 rounded-lg">
        <Icon className="w-8 h-8 text-green-500" />
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
