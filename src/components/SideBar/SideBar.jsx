import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  User,
  UserCircle2,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isStudentUser } from "../../config/accessControl";
import { getAuthUser } from "../../utils/authSession";

function SidebarItem({ icon: Icon, label, active, onClick, compact }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-left transition cursor-pointer ${
        active ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"
      } ${compact ? "w-min justify-center" : "w-full"}`}
    >
      <Icon className={`${compact ? "w-5 h-5" : "w-4 h-4"}`} />
      {!compact && <span>{label}</span>}
    </button>
  );
}

export default function Sidebar({ isOpen, setIsOpen, activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getAuthUser();
  const studentSession = isStudentUser(authUser);
  const permissions = authUser?.permissions && typeof authUser.permissions === "object" ? authUser.permissions : {};

  const isMessagePage = location.pathname.startsWith("/messaging");

  const adminItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "HR", path: "/hr" },
    { icon: User, label: "Teachers", path: "/teachers" },
    { icon: User, label: "Parents", path: "/parents" },
    { icon: User, label: "Students", path: "/students" },
    { icon: MessageCircle, label: "Messaging", path: "/messaging" },
    { icon: CalendarDays, label: "Events", path: "/events" },
    { icon: DollarSign, label: "Finance", path: "/finance" },
    { icon: Bell, label: "Notice Board", path: "/notice-board" },
    { icon: ClipboardList, label: "School", path: "/school" },
    { icon: BookOpenCheck, label: "Subjects", path: "/subjects" },
    { icon: Settings, label: "CMS", path: "/cms" },
    { icon: User, label: "Admin Users", path: "/admin-users" },
  ];

  const items = studentSession
    ? [{ icon: UserCircle2, label: "My Portal", path: "/student-portal" }]
    : adminItems.filter((item) => item.label === "Dashboard" || permissions[item.label] !== false);

  const isActive = (item) => {
    const pathMatch =
      location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

    return pathMatch || activeTab === item.label;
  };

  return (
    <aside
      className={`${isOpen ? "block" : "hidden lg:block"} fixed lg:static top-0 left-0 z-50 bg-white border-r min-h-screen p-4 ${
        isMessagePage ? "w-20" : "w-64"
      }`}
    >
      <div className={`flex items-center mb-6 ${isMessagePage ? "justify-center" : "justify-between"}`}>
        {isMessagePage ? <span className="block">SM</span> : <h2 className="text-xl font-bold text-green-600">Wischool</h2>}

        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-black cursor-pointer">
          X
        </button>
      </div>

      <div className="space-y-2 text-sm flex flex-col items-center">
        {items.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            compact={isMessagePage}
            active={isActive(item)}
            onClick={() => navigate(item.path)}
          />
        ))}

        <button onClick={() => navigate("/logout")} className="text-red-500 flex items-center gap-2 mt-8 cursor-pointer">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}


SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

SidebarItem.defaultProps = {
  compact: false,
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  activeTab: PropTypes.string,
};


