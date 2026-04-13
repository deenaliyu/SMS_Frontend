import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { getAuthUser } from '../../utils/authSession';
import { getProfileAvatar } from '../../utils/profileAvatar';


export default function ActivityLog() {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const displayName = currentUser?.fullName || currentUser?.name || "School Admin";
  const displayRole = currentUser?.role || "System Admin";

  const activityData = [
    { id: 1, time: '2023-07-23 17:30:00', type: 'Full Access (Read, Write, Delete)' },
    { id: 2, time: '2023-07-23 19:00:00', type: 'Full Access (Read, Write, Delete)' },
    { id: 3, time: '2023-07-23 18:00:00', type: 'Full Access (Read, Write, Delete)' },
    { id: 4, time: '2023-07-23 21:00:00', type: 'Full Access (Read, Write, Delete)' },
    { id: 5, time: '2023-07-23 23:00:00', type: 'Full Access (Read, Write, Delete)' },
    { id: 6, time: '2023-07-24 00:00:00', type: 'Full Access (Read, Write, Delete)' },
  ];

  return (
    <Layout activeTab="Dashboard">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img
            src={getProfileAvatar(displayName, displayRole)}
            className="w-12 h-12 rounded-full"
            alt={displayName}
          />
          <div>
            <h2 className="font-bold text-lg">{displayName}</h2>
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1 hidden sm:flex">
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
      </div>

      {/* Activity Log Card */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {/* Tabs */}
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
          <button className="text-green-500 font-medium border-b-2 border-green-500 cursor-pointer">
            Activity Log
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="text-gray-600 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 cursor-pointer"
          >
            Settings
          </button>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">S/N</th>
                <th className="py-2 px-4 border-b">Time Stamp</th>
                <th className="py-2 px-4 border-b">Activity Type</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 border-b">{item.id}</td>
                  <td className="py-2 px-4 border-b">{item.time}</td>
                  <td className="py-2 px-4 border-b">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button className="px-4 py-1 border border-green-500 text-green-500 rounded cursor-pointer">Previous</button>
            <button className="px-4 py-1 border border-green-500 text-green-500 rounded cursor-pointer">Next</button>
          </div>
          <span className="text-sm text-gray-600">Page 1 of 50</span>
        </div>
      </div>
    </Layout>
  );
}
