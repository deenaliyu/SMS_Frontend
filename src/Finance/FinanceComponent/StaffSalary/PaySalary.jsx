import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import { teacherPayments } from "../../data";
import { smsApi } from "../../../services/smsApi";

const initialForm = {
  teacherId: "",
  staffName: "",
  payDay: "",
  grossSalary: "",
  deductions: "",
  netSalary: "",
};

export default function PaySalary() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedTeachers, setSavedTeachers] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadTeachers() {
      try {
        const response = await smsApi.listTeachers();
        if (active) {
          setSavedTeachers(Array.isArray(response) ? response : []);
        }
      } catch {
        if (active) {
          setSavedTeachers([]);
        }
      }
    }

    loadTeachers();

    return () => {
      active = false;
    };
  }, []);

  const salaryTemplates = useMemo(() => teacherPayments, []);

  const staffOptions = useMemo(() => {
    const map = new Map();

    salaryTemplates.forEach((entry) => {
      const key = entry.teacherId || entry.name;
      if (!map.has(key)) {
        map.set(key, {
          teacherId: entry.teacherId,
          name: entry.name,
          grossAmount: entry.grossAmount,
          deductions: entry.deductions,
          netSalary: entry.netSalary,
        });
      }
    });

    savedTeachers.forEach((teacher) => {
      const key = teacher.teacherId || teacher.name;
      if (!map.has(key)) {
        map.set(key, {
          teacherId: teacher.teacherId,
          name: teacher.name,
          grossAmount: "",
          deductions: "",
          netSalary: "",
        });
      }
    });

    return Array.from(map.values());
  }, [salaryTemplates, savedTeachers]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (message) {
      setMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleStaffChange = (teacherId) => {
    const selected = staffOptions.find((option) => option.teacherId === teacherId);

    if (!selected) {
      handleInputChange("teacherId", teacherId);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      teacherId: selected.teacherId,
      staffName: selected.name,
      grossSalary: selected.grossAmount !== "" ? String(selected.grossAmount) : prev.grossSalary,
      deductions: selected.deductions !== "" ? String(selected.deductions) : prev.deductions,
      netSalary: selected.netSalary !== "" ? String(selected.netSalary) : prev.netSalary,
    }));

    if (message) {
      setMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleProcessSalary = async () => {
    if (!formData.teacherId || !formData.staffName || !formData.payDay || !formData.grossSalary || !formData.netSalary) {
      setErrorMessage("Please complete all required fields before processing salary.");
      return;
    }

    const payload = {
      id: Date.now(),
      teacherId: formData.teacherId,
      name: formData.staffName,
      paymentDate: formData.payDay,
      grossAmount: Number(formData.grossSalary) || 0,
      deductions: Number(formData.deductions) || 0,
      netSalary: Number(formData.netSalary) || 0,
      status: "Paid",
    };

    try {
      await smsApi.createFinancePayment(payload);
      setMessage("Salary processed and saved successfully.");
      setFormData(initialForm);
    } catch (error) {
      setErrorMessage(error.message || "Unable to process salary.");
    }
  };

  return (
    <Layout activeTab="Finance">
      <div className="min-h-screen">
        <div className="bg-white rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-2xl">Staff Salaries</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-400 text-sm cursor-pointer" onClick={() => navigate("/finance")}>
                Finance
              </p>
              <p className="text-gray-400 text-sm">{">"}</p>
              <p className="text-gray-400 text-sm cursor-pointer" onClick={() => navigate("/finance/staff-salary")}>
                Staff Salaries
              </p>
              <p className="text-gray-400 text-sm">{">"}</p>
              <p className="font-medium text-sm">Pay Salary</p>
            </div>
          </div>

          <div className="p-2">
            <div className="rounded-xl p-4 bg-white border border-gray-100">
              <div className="font-bold text-lg mb-2">Pay Salary</div>

              <div className="flex flex-col gap-5">
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="staffName" className="text-sm font-medium">Staff Name</label>
                    <select
                      name="staffName"
                      id="staffName"
                      value={formData.teacherId}
                      onChange={(event) => handleStaffChange(event.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="">Select Staff</option>
                      {staffOptions.map((teacher) => (
                        <option key={teacher.teacherId || teacher.name} value={teacher.teacherId}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="payDay" className="text-sm font-medium">Payment Date</label>
                    <input
                      type="date"
                      name="payDay"
                      id="payDay"
                      value={formData.payDay}
                      onChange={(event) => handleInputChange("payDay", event.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-1">
                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="grossSalary" className="text-sm font-medium">Gross Salary</label>
                    <input
                      type="number"
                      name="grossSalary"
                      id="grossSalary"
                      value={formData.grossSalary}
                      onChange={(event) => handleInputChange("grossSalary", event.target.value)}
                      placeholder="Gross Salary"
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="deductions" className="text-sm font-medium">Deductions</label>
                    <input
                      type="number"
                      name="deductions"
                      id="deductions"
                      value={formData.deductions}
                      onChange={(event) => handleInputChange("deductions", event.target.value)}
                      placeholder="Deductions"
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-1">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label htmlFor="netSalary" className="text-sm font-medium">Net Salary</label>
                    <input
                      type="number"
                      name="netSalary"
                      id="netSalary"
                      value={formData.netSalary}
                      onChange={(event) => handleInputChange("netSalary", event.target.value)}
                      placeholder="Net Salary"
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                {message && <p className="text-sm text-green-600">{message}</p>}

                <div>
                  <button
                    className="py-1 px-4 bg-green-600 border border-green-500 rounded-sm cursor-pointer hover:bg-green-500 text-white"
                    type="button"
                    onClick={handleProcessSalary}
                  >
                    Process Salary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
