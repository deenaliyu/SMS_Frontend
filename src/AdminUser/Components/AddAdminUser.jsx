import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSuperAdminEmail } from "../../config/accessControl";
import { adminRoles } from "../AdminData";
import Layout from "../../components/Layout/Layout";
import { smsApi } from "../../services/smsApi";
import { getAuthUser } from "../../utils/authSession";
import {
  PageHeader, FormField, Input, Select, Btn, SuccessModal,
} from "../../components/ui/index";

const INIT = { userName: "", fullName: "", email: "", password: "", role: "", activity: "" };

function AddAdminUser() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [form, setForm] = useState(INIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isSuperAdmin = isSuperAdminEmail(form.email);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit() {
    if (!form.userName || !form.fullName || !form.email || !form.password || !form.role || !form.activity) {
      setError("Please fill all fields before adding user."); return;
    }

    const payload = {
      id: Date.now(),
      userName: form.userName, username: form.userName,
      fullName: form.fullName,
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: isSuperAdmin ? "System Admin" : form.role,
      activity: isSuperAdmin ? "Active" : form.activity,
      status: isSuperAdmin ? "Active" : form.activity,
    };

    setIsSubmitting(true); setError("");
    try {
      await smsApi.createAdminUser(payload);
      setShowSuccess(true);
      setForm(INIT);
    } catch (err) {
      setError(err.message || "Unable to add admin user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout activeTab="Admin Users">
      <PageHeader
        title="Add Admin User"
        breadcrumbs={[{ label: "Admin Users", onClick: () => navigate("/admin-users") }, { label: "Add User" }]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        {isSuperAdmin && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
            Super admin email detected — role and status will be set automatically.
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Username" required>
              <Input name="userName" value={form.userName} onChange={handleChange} placeholder="Username" />
            </FormField>
            <FormField label="Full Name" required>
              <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
            </FormField>
            <FormField label="Password" required>
              <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
            </FormField>
            <FormField label="Role" required>
              <Select name="role" value={isSuperAdmin ? "System Admin" : form.role} onChange={handleChange} disabled={isSuperAdmin}>
                <option value="">Select role</option>
                {adminRoles.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FormField>
            <FormField label="Status" required>
              <Select name="activity" value={isSuperAdmin ? "Active" : form.activity} onChange={handleChange} disabled={isSuperAdmin}>
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormField>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="flex justify-between pt-2">
            <Btn variant="ghost">Add Module Permission</Btn>
            <Btn onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add User"}
            </Btn>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          title="Admin User Added!"
          message={isSuperAdmin ? "Super admin user saved with full access." : "Admin user added successfully."}
          buttonLabel="Back to Admin Users"
          onClose={() => { setShowSuccess(false); navigate("/admin-users"); }}
        />
      )}
    </Layout>
  );
}

export default AddAdminUser;