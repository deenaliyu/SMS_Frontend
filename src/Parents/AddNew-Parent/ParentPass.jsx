import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getParentDraft, saveParentDraft } from "../../utils/parentDraft";

const getInitialFormData = () => {
  const draft = getParentDraft();

  return {
    username: draft.username || "",
    email: draft.email || "",
    password: draft.password || "",
    repeatPassword: draft.repeatPassword || "",
  };
};

const LoginDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData);
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNext = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.repeatPassword) {
      setErrorMessage("Please complete all login details.");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    saveParentDraft(formData);
    navigate("/parents/new/link");
  };

  return (
    <Layout activeTab="Parents">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span className="text-gray-900 font-medium">Add New Parent</span>
      </nav>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Login Details</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Username*">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(event) => handleInputChange("username", event.target.value)}
                  placeholder="Username here"
                  className="w-full px-4 py-3 border rounded-md border-gray-300"
                />
              </Field>

              <Field label="Email*">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleInputChange("email", event.target.value)}
                  placeholder="Email here"
                  className="w-full px-4 py-3 border rounded-md border-gray-300"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Password*">
                <div className="relative">
                  <input
                    type={showPassword.password ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => handleInputChange("password", event.target.value)}
                    placeholder="Password here"
                    className="w-full px-4 py-3 pr-12 border rounded-md border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.password ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </Field>

              <Field label="Repeat Password*">
                <div className="relative">
                  <input
                    type={showPassword.repeatPassword ? "text" : "password"}
                    value={formData.repeatPassword}
                    onChange={(event) => handleInputChange("repeatPassword", event.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 pr-12 border rounded-md border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("repeatPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.repeatPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </Field>
            </div>
          </div>

          {errorMessage && <p className="text-red-600 text-sm mt-5">{errorMessage}</p>}

          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/parents/new/address")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LoginDetails;


