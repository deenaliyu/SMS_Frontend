import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { getParentDraft, saveParentDraft } from "../../utils/parentDraft";

const stateOptions = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const lgaOptions = [
  "Bebeji",
  "Bichi",
  "Bagwai",
  "Dawakin Kudu",
  "Dawakin Tofa",
  "Doguwa",
  "Fagge",
  "Gabasawa",
  "Garko",
  "Garun Mallam",
  "Gaya",
  "Gezawa",
  "Gwale",
  "Gwarzo",
  "Kabo",
  "Kano Municipal",
  "Karaye",
  "Kibiya",
  "Kiru",
  "Kumbotso",
  "Kunchi",
  "Kura",
  "Madobi",
  "Makoda",
  "Minjibir",
  "Nasarawa",
  "Rano",
  "Rimin Gado",
  "Rogo",
  "Shanono",
  "Sumaila",
  "Takai",
  "Tarauni",
  "Tofa",
  "Tsanyawa",
  "Tudun Wada",
  "Ungogo",
  "Warawa",
  "Wudil",
];

const getInitialFormData = () => {
  const draft = getParentDraft();

  return {
    state: draft.state || "",
    lga: draft.lga || "",
    address: draft.address || "",
  };
};

const ResidentialAddress = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData);
  const [dropdowns, setDropdowns] = useState({ state: false, lga: false });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const selectOption = (dropdown, value) => {
    handleInputChange(dropdown, value);
    setDropdowns((prev) => ({ ...prev, [dropdown]: false }));
  };

  const handleNext = () => {
    if (!formData.state || !formData.lga || !formData.address) {
      setErrorMessage("State, LGA and address are required.");
      return;
    }

    saveParentDraft(formData);
    navigate("/parents/new/login");
  };

  return (
    <Layout activeTab="Parents">
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Residential Address</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State<span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown("state")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
                  >
                    <span className={formData.state ? "text-gray-900" : "text-gray-500"}>{formData.state || "Select--"}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {dropdowns.state && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {stateOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectOption("state", option)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LGA<span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown("lga")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
                  >
                    <span className={formData.lga ? "text-gray-900" : "text-gray-500"}>{formData.lga || "Select--"}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {dropdowns.lga && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {lgaOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectOption("lga", option)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Address here"
                  value={formData.address}
                  onChange={(event) => handleInputChange("address", event.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {errorMessage && <p className="text-red-600 text-sm mt-5">{errorMessage}</p>}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate("/parents/new")}
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
      </div>
    </Layout>
  );
};

export default ResidentialAddress;


