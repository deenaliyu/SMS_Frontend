import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import { smsApi } from "../../../services/smsApi";

const initialForm = {
  parentName: "",
  studentName: "",
  studentId: "",
  paymentFor: "",
  session: "",
  term: "",
  amount: "",
  dueDate: "",
  status: "Unpaid",
};

function buildInvoiceId() {
  return `INV-${Date.now()}`;
}

export default function GenerateInvoice() {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [parentsResponse, studentsResponse] = await Promise.all([
          smsApi.listParents(),
          smsApi.listStudents(),
        ]);

        if (!active) {
          return;
        }

        setParents(Array.isArray(parentsResponse) ? parentsResponse : []);
        setStudents(Array.isArray(studentsResponse) ? studentsResponse : []);
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load invoice form data.");
        }
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const selectedStudent = useMemo(
    () => students.find((student) => student.name === formData.studentName) || null,
    [formData.studentName, students]
  );

  useEffect(() => {
    if (selectedStudent && !formData.studentId) {
      setFormData((prev) => ({
        ...prev,
        studentId: selectedStudent.studentId || selectedStudent.id || "",
      }));
    }
  }, [formData.studentId, selectedStudent]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.parentName || !formData.studentName || !formData.paymentFor || !formData.amount) {
      setErrorMessage("Parent, student, payment item, and amount are required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        name: formData.parentName,
        title: formData.paymentFor,
        status: formData.status,
        invoiceId: buildInvoiceId(),
        parentName: formData.parentName,
        studentName: formData.studentName,
        studentId: formData.studentId,
        paymentFor: formData.paymentFor,
        session: formData.session,
        term: formData.term,
        amount: formData.amount,
        dueDate: formData.dueDate,
        createdOn: new Date().toISOString(),
      };

      await smsApi.createInvoice(payload);
      setFormData(initialForm);
      setSuccessMessage("Invoice created and saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to create invoice.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="Finance">
      <div className="min-h-screen">
        <div className="bg-white rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-2xl">Generate Invoice</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-400 text-sm cursor-pointer" onClick={() => navigate("/finance")}>
                Finance
              </p>
              <p className="text-gray-400 text-sm">{">"}</p>
              <p className="font-medium text-sm">Generate Invoice</p>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white border border-gray-100">
            <div className="font-bold text-lg mb-2">Generate Invoice</div>
            {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}
            {successMessage && <p className="mb-4 text-sm text-green-600">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row gap-2">
                  <SelectField
                    label="Parent Name"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    options={parents.map((parent) => parent.name || parent.parentName).filter(Boolean)}
                    placeholder="Select Parent"
                  />
                  <SelectField
                    label="Student Name"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    options={students.map((student) => student.name || student.studentName).filter(Boolean)}
                    placeholder="Select Student"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    label="Student ID"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Student ID"
                  />
                  <InputField
                    label="Payment For"
                    name="paymentFor"
                    value={formData.paymentFor}
                    onChange={handleChange}
                    placeholder="Tuition Fee"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    label="Session"
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    placeholder="2026/2027"
                  />
                  <InputField
                    label="Term"
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    placeholder="1st Term"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    label="Amount to Pay"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                  />
                  <InputField
                    label="Due Date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    type="date"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="py-1 px-5 text-green-500 border border-green-500 rounded cursor-pointer hover:bg-green-500 hover:text-white"
                    onClick={() => navigate("/finance/invoices")}
                  >
                    Open Invoices
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2 px-4 bg-green-600 text-white border border-green-500 rounded-sm cursor-pointer hover:bg-green-500 disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Generate Invoice"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

InputField.defaultProps = {
  placeholder: "",
  type: "text",
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
};

SelectField.defaultProps = {
  placeholder: "Select",
};
