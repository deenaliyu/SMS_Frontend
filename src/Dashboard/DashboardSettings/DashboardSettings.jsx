import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getAuthUser } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";
import { smsApi } from "../../services/smsApi";

export default function DashboardSettings() {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const displayName = currentUser?.fullName || currentUser?.name || "School Admin";
  const displayRole = currentUser?.role || "System Admin";
  const profileImage = useMemo(() => getProfileAvatar(displayName, displayRole), [displayName, displayRole]);

  const handleSave = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Fill all password fields before saving.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password must match.");
      setSuccessMessage("");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await smsApi.updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to update password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout activeTab="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img src={profileImage} className="w-12 h-12 rounded-full" alt={displayName} />
          <div>
            <h2 className="font-bold text-lg">{displayName}</h2>
            <div className="text-sm text-gray-600 hidden sm:flex items-center gap-2 mt-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-green-600 hover:text-green-700 hover:underline font-medium cursor-pointer"
              >
                Dashboard
              </button>
              <span className="text-gray-400">{">"}</span>
              <button
                onClick={() => navigate("/admin/profile")}
                className="text-black font-semibold hover:text-green-600 cursor-pointer"
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>

          <div className="flex gap-6 mb-6 border-b pb-4 overflow-x-auto">
            <button
              onClick={() => navigate("/admin/profile")}
              className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              Profile Overview
            </button>
            <button
              onClick={() => navigate("/admin/access-permission")}
              className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              Access Permissions
            </button>
            <button
              onClick={() => navigate("/admin/activity-log")}
              className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              Activity Log
            </button>
            <button className="text-green-500 font-medium border-b-2 border-green-500 cursor-pointer">
              Settings
            </button>
          </div>

          {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="mb-4 text-sm text-green-600">{successMessage}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Field
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <Field
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <Field
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <div className="mt-6">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save New Password"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-lg"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
