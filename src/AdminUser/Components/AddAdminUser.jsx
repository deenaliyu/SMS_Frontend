import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRoles } from "../AdminData";
import { isSuperAdminEmail } from "../../config/accessControl";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getAuthUser } from "../../utils/authSession";

const initialFormData = {
  userName: "",
  fullName: "",
  email: "",
  password: "",
  role: "",
  activity: "",
};

export default function AddAdminUser() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = useMemo(() => adminRoles, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const buildPayload = () => {
    const superAdmin = isSuperAdminEmail(formData.email);

    return {
      id: Date.now(),
      userName: formData.userName,
      username: formData.userName,
      fullName: formData.fullName,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: superAdmin ? "System Admin" : formData.role,
      activity: superAdmin ? "Active" : formData.activity,
      status: superAdmin ? "Active" : formData.activity,
    };
  };

  const handleSubmit = async () => {
    if (!authUser?.permissions?.["Admin Users"] && !String(authUser?.role || "").toLowerCase().includes("admin")) {
      setErrorMessage("Only an admin user can create another admin user.");
      return;
    }

    if (!formData.userName || !formData.fullName || !formData.email || !formData.password || !formData.role || !formData.activity) {
      setErrorMessage("Please fill all fields before adding user.");
      return;
    }

    const payload = buildPayload();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createAdminUser(payload);
      setMessage(
        isSuperAdminEmail(payload.email)
          ? "Super admin user saved with full access."
          : "Admin user added successfully.",
      );
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(error.message || "Unable to add admin user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeTab="Admin Users">
      <div className="min-h-screen">
        <div className="bg-white rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-2xl">Add Admin User</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-400 text-sm cursor-pointer" onClick={() => navigate("/admin-users")}>
                Admin User
              </p>
              <p className="text-gray-400 text-sm">{">"}</p>
              <p className="font-medium text-sm">Add Admin Users</p>
            </div>
          </div>

          <div className="p-2">
            <div className="rounded-xl p-4 bg-white border border-gray-100">
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <label htmlFor="userName" className="text-sm font-medium">
                        User Name
                      </label>
                      <input
                        type="text"
                        name="userName"
                        id="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="User name"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full name"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <div className="flex-1 flex flex-col gap-1">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <div className="flex-1 flex flex-col gap-1">
                      <label htmlFor="role" className="text-sm font-medium">
                        Role
                      </label>
                      <select
                        name="role"
                        id="role"
                        value={isSuperAdminEmail(formData.email) ? "System Admin" : formData.role}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                        disabled={isSuperAdminEmail(formData.email)}
                      >
                        <option value="">Role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <div className="flex flex-col gap-1 w-1/2">
                      <label htmlFor="activity" className="text-sm font-medium">
                        Activity (Active/in-active)
                      </label>
                      <select
                        name="activity"
                        id="activity"
                        value={isSuperAdminEmail(formData.email) ? "Active" : formData.activity}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                        disabled={isSuperAdminEmail(formData.email)}
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
                  {message && <p className="text-green-600 text-sm">{message}</p>}

                  <div className="flex justify-between items-center">
                    <button
                      className="py-2 px-8 border border-green-500 text-green-500 rounded-sm cursor-pointer hover:bg-green-500 hover:text-white"
                      type="button"
                    >
                      Add Module Permission
                    </button>

                    <button
                      className="py-2 px-5 bg-green-500 border border-green-500 rounded-sm cursor-pointer hover:bg-green-600 disabled:opacity-60"
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? "Adding..." : "Add User"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
