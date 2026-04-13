import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getAuthToken, getAuthUser, setAuthSession } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";

const emptyForm = {
  fullName: "",
  username: "",
  email: "",
  role: "",
  phone: "",
  status: "Active",
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await smsApi.me();
        const user = response?.user || authUser || {};

        if (!active) {
          return;
        }

        setFormData({
          fullName: user.fullName || user.name || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "",
          phone: user.twilioPhoneNumber || "",
          status: user.status || "Active",
        });
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load profile.");
          setFormData({
            fullName: authUser?.fullName || authUser?.name || "",
            username: authUser?.username || "",
            email: authUser?.email || "",
            role: authUser?.role || "",
            phone: authUser?.twilioPhoneNumber || "",
            status: authUser?.status || "Active",
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [authUser]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage("Full name and email are required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await smsApi.updateProfile({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        twilioPhoneNumber: formData.phone,
      });

      setAuthSession({
        token: getAuthToken(),
        user: response?.user,
        emailFallback: response?.user?.email || formData.email,
      });

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  const displayName = formData.fullName || authUser?.fullName || authUser?.name || "School Admin";
  const displayRole = formData.role || authUser?.role || "System Admin";
  const profileImage = useMemo(() => getProfileAvatar(displayName, displayRole), [displayName, displayRole]);

  return (
    <Layout activeTab="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img src={profileImage} className="w-12 h-12 rounded-full" alt={displayName} />
          <div className="hidden sm:block">
            <h2 className="font-bold text-lg">{displayName}</h2>
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
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
          <h1 className="text-2xl font-bold mb-4">Profile</h1>

          <div className="flex gap-6 mb-6 border-b pb-4 overflow-x-auto">
            <button className="text-green-500 font-medium border-b-2 border-green-500 cursor-pointer">
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
            <button
              onClick={() => navigate("/admin/settings")}
              className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              Settings
            </button>
          </div>

          {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="mb-4 text-sm text-green-600">{successMessage}</p>}

          {isLoading ? (
            <div className="py-10 text-sm text-gray-500">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  type="text"
                />
                <Field
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  type="text"
                />
                <Field
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="text"
                />
                <Field
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  type="text"
                />
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, name, value, onChange, type }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
