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
  X,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isStudentUser } from "../../config/accessControl";
import { getAuthUser } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";

const NAV_ITEMS = [
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

function NavItem({ icon: Icon, label, active, onClick, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={compact ? label : undefined}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left
        transition-all duration-200 cursor-pointer
        ${active
          ? "bg-green-500 text-white shadow-lg shadow-green-900/30"
          : "text-green-100/70 hover:bg-white/10 hover:text-white"
        }
        ${compact ? "justify-center px-2" : ""}
      `}
    >
      {/* Active indicator pill */}
      {active && !compact && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
      )}

      <Icon className={`flex-shrink-0 ${compact ? "w-5 h-5" : "w-4 h-4"}`} />

      {!compact && (
        <span className="text-sm font-medium tracking-wide flex-1">{label}</span>
      )}

      {!compact && active && (
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
      )}

      {/* Tooltip for compact mode */}
      {compact && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md
          opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ isOpen, setIsOpen, activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getAuthUser();
  const studentSession = isStudentUser(authUser);
  const permissions = authUser?.permissions && typeof authUser.permissions === "object"
    ? authUser.permissions
    : {};

  const isMessagePage = location.pathname.startsWith("/messaging");
  const compact = isMessagePage;

  const displayName = authUser?.fullName || authUser?.name || "Admin";
  const displayRole = authUser?.role || "System Admin";
  const avatar = getProfileAvatar(displayName, displayRole);

  const items = studentSession
    ? [{ icon: UserCircle2, label: "My Portal", path: "/student-portal" }]
    : NAV_ITEMS.filter(
        (item) => item.label === "Dashboard" || permissions[item.label] !== false,
      );

  const isActive = (item) =>
    location.pathname === item.path ||
    location.pathname.startsWith(`${item.path}/`) ||
    activeTab === item.label;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          flex flex-col h-screen
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${compact ? "w-16" : "w-64"}
        `}
        style={{
          background: "linear-gradient(160deg, #0d3321 0%, #0a2819 50%, #061a10 100%)",
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${compact ? "justify-center px-2" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <BookOpenCheck className="w-5 h-5 text-white" />
          </div>
          {!compact && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-tight tracking-wide">WiSchool</p>
              <p className="text-green-400/70 text-[10px] uppercase tracking-widest">Admin Portal</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-green-300 hover:text-white ml-auto cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav label */}
        {!compact && (
          <p className="px-4 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-green-400/50">
            Navigation
          </p>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-2 space-y-0.5 ${compact ? "px-1.5" : "px-3"}`}>
          {items.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              compact={compact}
              active={isActive(item)}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            />
          ))}
        </nav>

        {/* Footer: user profile + logout */}
        <div className={`border-t border-white/10 p-3 space-y-2 ${compact ? "px-1.5" : ""}`}>
          {!compact && (
            <div
              className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => navigate("/admin/profile")}
            >
              <img
                src={avatar}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-green-500/50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{displayName}</p>
                <p className="text-green-400/60 text-[11px] truncate">{displayRole}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/logout")}
            className={`
              flex items-center gap-2.5 w-full px-3 py-2 rounded-xl
              text-red-400 hover:bg-red-500/15 hover:text-red-300
              transition-colors cursor-pointer text-sm
              ${compact ? "justify-center" : ""}
            `}
            title={compact ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!compact && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

NavItem.defaultProps = { compact: false };

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  activeTab: PropTypes.string,
};