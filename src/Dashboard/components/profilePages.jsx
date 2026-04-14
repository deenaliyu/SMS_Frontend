// ═══════════════════════════════════════════════════════════════
// AdminProfile.jsx
// ═══════════════════════════════════════════════════════════════
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getAuthToken, getAuthUser, setAuthSession } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";
import { PageHeader, Btn, FormField, Input, Select, Spinner } from "../../components/ui/index.jsx";

const PROFILE_TABS = [
  { key: "profile", label: "Profile Overview", path: "/admin/profile" },
  { key: "access", label: "Access Permissions", path: "/admin/access-permission" },
  { key: "activity", label: "Activity Log", path: "/admin/activity-log" },
  { key: "settings", label: "Settings", path: "/admin/settings" },
];

export function ProfileTabs({ active }) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
      {PROFILE_TABS.map(({ key, label, path }) => (
        <button
          key={key}
          type="button"
          onClick={() => navigate(path)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${active === key ? "border-green-500 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

ProfileTabs.propTypes = { active: PropTypes.string.isRequired };

const EMPTY_FORM = { fullName: "", username: "", email: "", role: "", phone: "", status: "Active" };

export function AdminProfile() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await smsApi.me();
        const user = res?.user || authUser || {};
        if (active) {
          setForm({
            fullName: user.fullName || user.name || "",
            username: user.username || "",
            email: user.email || "",
            role: user.role || "",
            phone: user.twilioPhoneNumber || "",
            status: user.status || "Active",
          });
        }
      } catch {
        if (active && authUser) {
          setForm({ fullName: authUser.fullName || "", username: authUser.username || "", email: authUser.email || "", role: authUser.role || "", phone: "", status: authUser.status || "Active" });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errorMessage) setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) { setErrorMessage("Full name and email are required."); return; }
    setIsSaving(true);
    setErrorMessage("");
    try {
      const res = await smsApi.updateProfile({ fullName: form.fullName, username: form.username, email: form.email, role: form.role, status: form.status, twilioPhoneNumber: form.phone });
      setAuthSession({ token: getAuthToken(), user: res?.user, emailFallback: form.email });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  const displayName = form.fullName || authUser?.fullName || "Admin";
  const avatar = useMemo(() => getProfileAvatar(displayName, form.role || "Admin"), [displayName, form.role]);

  return (
    <Layout activeTab="Dashboard">
      <PageHeader title="My Profile" breadcrumbs={[{ label: "Dashboard", onClick: () => navigate("/dashboard") }, { label: "Profile" }]} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Profile banner */}
        <div className="h-20 bg-gradient-to-r from-green-600 to-green-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
            <img src={avatar} alt={displayName} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md" />
            <div className="mb-1">
              <p className="font-bold text-gray-900 text-xl">{displayName}</p>
              <p className="text-sm text-gray-500">{form.role || "Admin"}</p>
            </div>
          </div>

          <ProfileTabs active="profile" />

          {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errorMessage}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{successMessage}</div>}

          {isLoading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {[["Full Name", "fullName", "text"], ["Username", "username", "text"], ["Email Address", "email", "email"], ["Phone Number", "phone", "text"], ["Role", "role", "text"]].map(([label, name, type]) => (
                  <FormField key={name} label={label}>
                    <Input type={type} name={name} value={form[name]} onChange={handleChange} />
                  </FormField>
                ))}
                <FormField label="Status">
                  <Select name="status" value={form.status} onChange={handleChange}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </FormField>
              </div>
              <Btn type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save Profile"}</Btn>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════
// AccessPermission.jsx
// ═══════════════════════════════════════════════════════════════
import { useMemo as useMemo2 } from "react";
import { ACCESS_MODULES } from "../../config/accessControl";
import { Badge } from "../../components/ui/index.jsx";

export function AccessPermission() {
  const navigate = useNavigate();
  const currentUser = getAuthUser();

  const rows = useMemo2(() => {
    const perms = currentUser?.permissions || {};
    return ACCESS_MODULES.map((mod) => ({ mod, enabled: perms[mod] !== false }));
  }, [currentUser]);

  return (
    <Layout activeTab="Dashboard">
      <PageHeader title="My Profile" breadcrumbs={[{ label: "Dashboard", onClick: () => navigate("/dashboard") }, { label: "Access Permissions" }]} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ProfileTabs active="access" />

        <div className="mb-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">{currentUser?.role || "System Admin"}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Module</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Access Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(({ mod, enabled }) => (
                <tr key={mod} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium text-gray-800">{mod}</td>
                  <td className="px-4 py-3 text-gray-500">{enabled ? "Full Access (View, Edit, Delete)" : "No Access"}</td>
                  <td className="px-4 py-3"><Badge label={enabled ? "Active" : "Inactive"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════
// ActivityLog.jsx
// ═══════════════════════════════════════════════════════════════
import { useState as useState2 } from "react";

const ACTIVITY_DATA = [
  { id: 1, time: "2025-04-13 08:45:00", action: "Login", type: "Authentication", ip: "192.168.1.1" },
  { id: 2, time: "2025-04-13 09:12:00", action: "Admin user created", type: "Admin Management", ip: "192.168.1.1" },
  { id: 3, time: "2025-04-13 10:05:00", action: "Teacher record updated", type: "Staff Management", ip: "192.168.1.1" },
  { id: 4, time: "2025-04-13 11:20:00", action: "Invoice generated", type: "Finance", ip: "192.168.1.1" },
  { id: 5, time: "2025-04-13 14:00:00", action: "Event created", type: "Events", ip: "192.168.1.1" },
  { id: 6, time: "2025-04-13 15:30:00", action: "Notice board item added", type: "Notice Board", ip: "192.168.1.1" },
  { id: 7, time: "2025-04-12 09:00:00", action: "Login", type: "Authentication", ip: "192.168.1.1" },
  { id: 8, time: "2025-04-12 11:00:00", action: "Parent record added", type: "Parents", ip: "192.168.1.1" },
];

export function ActivityLog() {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const [currentPage, setCurrentPage2] = useState2(1);
  const PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(ACTIVITY_DATA.length / PER_PAGE));
  const shown = ACTIVITY_DATA.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <Layout activeTab="Dashboard">
      <PageHeader title="My Profile" breadcrumbs={[{ label: "Dashboard", onClick: () => navigate("/dashboard") }, { label: "Activity Log" }]} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ProfileTabs active="activity" />

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">S/N</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shown.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400">{(currentPage - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.time}</td>
                  <td className="px-4 py-3 text-gray-800">{item.action}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{item.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Btn variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage2((p) => p - 1)}>← Previous</Btn>
          <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
          <Btn variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage2((p) => p + 1)}>Next →</Btn>
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════
// DashboardSettings.jsx
// ═══════════════════════════════════════════════════════════════
import { useState as useState3 } from "react";

export function DashboardSettings() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState3("");
  const [newPassword, setNewPassword] = useState3("");
  const [confirmPassword, setConfirmPassword] = useState3("");
  const [isSaving, setIsSaving] = useState3(false);
  const [errorMessage, setErrorMessage] = useState3("");
  const [successMessage, setSuccessMessage] = useState3("");

  async function handleSave() {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) { setErrorMessage("Fill all password fields."); return; }
    if (newPassword !== confirmPassword) { setErrorMessage("New password and confirm password must match."); return; }
    setIsSaving(true);
    setErrorMessage("");
    try {
      await smsApi.updatePassword({ currentPassword, newPassword });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setSuccessMessage("Password updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Unable to update password.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="Dashboard">
      <PageHeader title="My Profile" breadcrumbs={[{ label: "Dashboard", onClick: () => navigate("/dashboard") }, { label: "Settings" }]} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ProfileTabs active="settings" />

        <div className="max-w-lg">
          <h2 className="font-bold text-gray-900 mb-1">Change Password</h2>
          <p className="text-sm text-gray-500 mb-5">Choose a strong password to keep your account secure.</p>

          {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errorMessage}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{successMessage}</div>}

          <div className="space-y-4 mb-6">
            <FormField label="Current Password" required>
              <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </FormField>
            <FormField label="New Password" required>
              <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </FormField>
            <FormField label="Confirm New Password" required>
              <Input type="password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormField>
          </div>

          <Btn onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving…" : "Save New Password"}</Btn>
        </div>
      </div>
    </Layout>
  );
}