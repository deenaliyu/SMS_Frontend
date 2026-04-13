import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ACCESS_MODULES } from "../../config/accessControl";
import { getAuthUser } from "../../utils/authSession";
import { getProfileAvatar } from "../../utils/profileAvatar";

export default function AccessPermission() {
  const navigate = useNavigate();

  const currentUser = getAuthUser();

  const accessRows = useMemo(() => {
    const permissions = currentUser?.permissions || {};

    return ACCESS_MODULES.map((moduleName) => ({
      moduleName,
      enabled: permissions[moduleName] !== false,
    }));
  }, [currentUser]);

  return (
    <Layout activeTab="Dashboard">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Access Permissions</h1>
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

        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/admin/profile")}>
          <img
            src={getProfileAvatar(currentUser?.fullName || currentUser?.name || "Admin User", currentUser?.role || "Admin")}
            alt={currentUser?.fullName || currentUser?.name || "Admin User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="font-medium">{currentUser?.fullName || "Admin User"}</p>
            <p className="text-sm text-gray-500">{currentUser?.role || "Admin"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b pb-2 mb-4">
        <button
          onClick={() => navigate("/admin/profile")}
          className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
        >
          Profile Overview
        </button>
        <button className="text-green-500 font-medium border-b-2 border-green-500 cursor-pointer">
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

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3">Module</th>
              <th className="px-6 py-3">Access Level</th>
            </tr>
          </thead>
          <tbody>
            {accessRows.map((entry) => (
              <tr key={entry.moduleName} className="border-b even:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">{entry.moduleName}</td>
                <td className="px-6 py-3 text-gray-600">
                  {entry.enabled ? "Full Access (View, Edit, Delete)" : "No Access"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
        {currentUser?.role || "System Admin"}
      </div>
    </Layout>
  );
}
