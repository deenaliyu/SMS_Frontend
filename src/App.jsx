/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Admission from "./pages/Admission/Admission";
import StudentAdmission from "./pages/Admission/studentAdmission";
import StudentRegistration from "./pages/Admission/studentRegistration";
import OnlinePayment from "./pages/Payment/OnlinePayment";
import Gallery from "./pages/Gallery/Gallery";
import NewsOrEvent from "./pages/News/Event/News-event";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/Blog/BlogDetail";
import Contact from "./pages/Contact/Contact";
import AdminLogin from "./pages/Login/AdminLogin";
import StudentLogin from "./pages/Login/StudentLogin";
import Logout from "./pages/Logout/Logout";
import Academics from "./pages/Academics/Academics";
import StudentPortal from "./pages/StudentPortal/StudentPortal";

import Dashboard from "./Dashboard/dashboard";
import AdminProfile from "./Dashboard/Profile/AdminProfile";
import AccessPermission from "./Dashboard/AP/AccessPermission";
import ActivityLog from "./Dashboard/ActivityLog/ActivityLog";
import DashboardSettings from "./Dashboard/DashboardSettings/DashboardSettings";

import HrDashboard from "./HR/HrDashboard/HrDashboard";
import Leavepermission from "./HR/Leavepermission/Leavepermission";
import StaffAttendance from "./HR/StaffAttendance/StaffAttendance";
import AdmissionManagement from "./HR/AdmissionManagement/AdmissionManagement";
import StudentInfo from "./HR/StudentInfo/StudentInfo";

import TeachersDashboard from "./Teachers/TeachersDashboard/TeachersDashboard";
import TeachersProfile from "./Teachers/TeachersProfile/TeachersProfile";
import MainProfile from "./Teachers/TeachersProfile/MainProfile";
import AddTeacher from "./Teachers/AddTeacher/AddTeacher";

import ParentsDashboard from "./Parents/ParentsDashboard/ParentsDashboard";
import AddNewParent from "./Parents/AddNew-Parent/AddNewParent";
import ResidentialAddress from "./Parents/AddNew-Parent/ResidentialAddress";
import ParentPass from "./Parents/AddNew-Parent/ParentPass";
import ParentLink from "./Parents/AddNew-Parent/ParentLink";
import ParentsProfile from "./Parents/ParentsDashboard/ParentsProfile";

import StudentsDashboard from "./Students/StudentsDashboard/StudentsDashboard";
import StudentsProfile from "./Students/StudentsProfile/StudentsProfile";
import AddStudents from "./Students/AddStudent/AddStudents";

import MessagePage from "./Messaging/MessagePage/MessagePage";

import EventPage from "./Events/EventPage/EventPage";
import AddEventPage from "./Events/EventComponent/AddEvent/AddEvent";
import EventCalender from "./Events/EventComponent/EventCalender/EventCalender";

import FinancePage from "./Finance/MainPage/FinancePage";
import PaymentHistory from "./Finance/FinanceComponent/PaymentHistory/PaymentHistory";
import StaffSalary from "./Finance/FinanceComponent/StaffSalary/StaffSalary";
import PaySalary from "./Finance/FinanceComponent/StaffSalary/PaySalary";
import GenerateInvoice from "./Finance/FinanceComponent/Invoices/GenerateInvoice";
import Invoice from "./Finance/FinanceComponent/Invoices/Invoices";

import NoticeBoard from "./noticeBoard/MainPage/NoticeBoard";
import NewItem from "./noticeBoard/NoticeBoardComponent/NewItem";

import AdminUser from "./AdminUser/MainPage/AdminPage";
import AddAdminUser from "./AdminUser/Components/AddAdminUser";

import SchoolPage from "./platform/SchoolPage";
import SubjectsPage from "./platform/SubjectsPage";
import CmsPage from "./platform/CmsPage";

const hiddenLayoutPaths = new Set([
  "/portal/login",
  "/admin-login",
  "/student-login",
  "/logout",
  "/student-portal",
  "/dashboard",
  "/admin/profile",
  "/admin/access-permission",
  "/admin/activity-log",
  "/admin/settings",

  "/hr",
  "/hr/leave-permission",
  "/hr/staff-attendance",
  "/hr/admission-management",
  "/hr/student-info",

  "/teachers",
  "/teachers/profile",
  "/teachers/main-profile",
  "/teachers/add",

  "/parents",
  "/parents/new",
  "/parents/new/address",
  "/parents/new/login",
  "/parents/new/link",
  "/parents/profile",

  "/students",
  "/students/profile",
  "/students/add",

  "/messaging",
  "/events",
  "/events/add",
  "/events/calendar",

  "/finance",
  "/finance/payment-history",
  "/finance/staff-salary",
  "/finance/staff-salary/pay",
  "/finance/generate-invoice",
  "/finance/invoices",

  "/notice-board",
  "/notice-board/new",
  "/school",
  "/subjects",
  "/cms",

  "/admin-users",
  "/admin-users/new",
]);

const App = () => {
  const location = useLocation();
  const shouldHideLayout = hiddenLayoutPaths.has(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<Home />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/about" element={<About />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/student-admission" element={<StudentAdmission />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="/payment" element={<OnlinePayment />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news-event" element={<NewsOrEvent />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Login / Auth routes ── */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/portal/login" element={<Navigate to="/student-login" replace />} />
        <Route path="/login" element={<Navigate to="/student-login" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/student-portal" element={<ProtectedRoute portal="student"><StudentPortal /></ProtectedRoute>} />

        {/* ── Protected: Admin dashboard ── */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/access-permission" element={<ProtectedRoute><AccessPermission /></ProtectedRoute>} />
        <Route path="/admin/activity-log" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />

        {/* ── Protected: HR ── */}
        <Route path="/hr" element={<ProtectedRoute><HrDashboard /></ProtectedRoute>} />
        <Route path="/hr/leave-permission" element={<ProtectedRoute><Leavepermission /></ProtectedRoute>} />
        <Route path="/hr/staff-attendance" element={<ProtectedRoute><StaffAttendance /></ProtectedRoute>} />
        <Route path="/hr/admission-management" element={<ProtectedRoute><AdmissionManagement /></ProtectedRoute>} />
        <Route path="/hr/student-info" element={<ProtectedRoute><StudentInfo /></ProtectedRoute>} />

        {/* ── Protected: Teachers ── */}
        <Route path="/teachers" element={<ProtectedRoute><TeachersDashboard /></ProtectedRoute>} />
        <Route path="/teachers/profile" element={<ProtectedRoute><TeachersProfile /></ProtectedRoute>} />
        <Route path="/teachers/main-profile" element={<ProtectedRoute><MainProfile /></ProtectedRoute>} />
        <Route path="/teachers/add" element={<ProtectedRoute><AddTeacher /></ProtectedRoute>} />

        {/* ── Protected: Parents ── */}
        <Route path="/parents" element={<ProtectedRoute><ParentsDashboard /></ProtectedRoute>} />
        <Route path="/parents/new" element={<ProtectedRoute><AddNewParent /></ProtectedRoute>} />
        <Route path="/parents/new/address" element={<ProtectedRoute><ResidentialAddress /></ProtectedRoute>} />
        <Route path="/parents/new/login" element={<ProtectedRoute><ParentPass /></ProtectedRoute>} />
        <Route path="/parents/new/link" element={<ProtectedRoute><ParentLink /></ProtectedRoute>} />
        <Route path="/parents/profile" element={<ProtectedRoute><ParentsProfile /></ProtectedRoute>} />

        {/* ── Protected: Students ── */}
        <Route path="/students" element={<ProtectedRoute><StudentsDashboard /></ProtectedRoute>} />
        <Route path="/students/profile" element={<ProtectedRoute><StudentsProfile /></ProtectedRoute>} />
        <Route path="/students/add" element={<ProtectedRoute><AddStudents /></ProtectedRoute>} />

        {/* ── Protected: Messaging ── */}
        <Route path="/messaging" element={<ProtectedRoute><MessagePage /></ProtectedRoute>} />

        {/* ── Protected: Events ── */}
        <Route path="/events" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
        <Route path="/events/add" element={<ProtectedRoute><AddEventPage /></ProtectedRoute>} />
        <Route path="/events/calendar" element={<ProtectedRoute><EventCalender /></ProtectedRoute>} />

        {/* ── Protected: Finance ── */}
        <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
        <Route path="/finance/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/finance/staff-salary" element={<ProtectedRoute><StaffSalary /></ProtectedRoute>} />
        <Route path="/finance/staff-salary/pay" element={<ProtectedRoute><PaySalary /></ProtectedRoute>} />
        <Route path="/finance/generate-invoice" element={<ProtectedRoute><GenerateInvoice /></ProtectedRoute>} />
        <Route path="/finance/invoices" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

        {/* ── Protected: Notice Board / Platform ── */}
        <Route path="/notice-board" element={<ProtectedRoute><NoticeBoard /></ProtectedRoute>} />
        <Route path="/notice-board/new" element={<ProtectedRoute><NewItem /></ProtectedRoute>} />
        <Route path="/school" element={<ProtectedRoute><SchoolPage /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
        <Route path="/cms" element={<ProtectedRoute><CmsPage /></ProtectedRoute>} />

        {/* ── Protected: Admin Users ── */}
        <Route path="/admin-users" element={<ProtectedRoute><AdminUser /></ProtectedRoute>} />
        <Route path="/admin-users/new" element={<ProtectedRoute><AddAdminUser /></ProtectedRoute>} />

        {/* ── Backward compatibility redirects ── */}
        <Route path="/Adminprofile" element={<Navigate to="/admin/profile" replace />} />
        <Route path="/AccessPermission" element={<Navigate to="/admin/access-permission" replace />} />
        <Route path="/ActivityLog" element={<Navigate to="/admin/activity-log" replace />} />
        <Route path="/DashboardSettings" element={<Navigate to="/admin/settings" replace />} />

        <Route path="/HrDashboard" element={<Navigate to="/hr" replace />} />
        <Route path="/Leavepermission" element={<Navigate to="/hr/leave-permission" replace />} />
        <Route path="/StaffAttendance" element={<Navigate to="/hr/staff-attendance" replace />} />
        <Route path="/AdmissionManagement" element={<Navigate to="/hr/admission-management" replace />} />
        <Route path="/StudentInfo" element={<Navigate to="/hr/student-info" replace />} />

        <Route path="/TeachersDashboard" element={<Navigate to="/teachers" replace />} />
        <Route path="/TeachersProfile" element={<Navigate to="/teachers/profile" replace />} />
        <Route path="/MainProfile" element={<Navigate to="/teachers/main-profile" replace />} />
        <Route path="/AddTeacher" element={<Navigate to="/teachers/add" replace />} />

        <Route path="/ParentsDashboard" element={<Navigate to="/parents" replace />} />
        <Route path="/AddNewParent" element={<Navigate to="/parents/new" replace />} />
        <Route path="/ResidentialAddress" element={<Navigate to="/parents/new/address" replace />} />
        <Route path="/ParentPass" element={<Navigate to="/parents/new/login" replace />} />
        <Route path="/ParentLink" element={<Navigate to="/parents/new/link" replace />} />
        <Route path="/ParentsProfile" element={<Navigate to="/parents/profile" replace />} />

        <Route path="/StudentsDashboard" element={<Navigate to="/students" replace />} />
        <Route path="/StudentsProfile" element={<Navigate to="/students/profile" replace />} />
        <Route path="/AddStudents" element={<Navigate to="/students/add" replace />} />

        <Route path="/Events" element={<Navigate to="/events" replace />} />
        <Route path="/Events/add" element={<Navigate to="/events/add" replace />} />
        <Route path="/Events/calendar" element={<Navigate to="/events/calendar" replace />} />

        <Route path="/finance/paymentHistory" element={<Navigate to="/finance/payment-history" replace />} />
        <Route path="/finance/staffSalary" element={<Navigate to="/finance/staff-salary" replace />} />
        <Route path="/finance/staffSalary/paySalary" element={<Navigate to="/finance/staff-salary/pay" replace />} />
        <Route path="/finance/generateInvoice" element={<Navigate to="/finance/generate-invoice" replace />} />
        <Route path="/finance/invoice" element={<Navigate to="/finance/invoices" replace />} />

        <Route path="/notice-board/newItem" element={<Navigate to="/notice-board/new" replace />} />
        <Route path="/add-admin-users" element={<Navigate to="/admin-users/new" replace />} />
        <Route path="/calendar" element={<Navigate to="/school" replace />} />

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default App;
