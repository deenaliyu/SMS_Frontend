import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Building2, Mail, MapPin, PencilLine, Phone, Plus, School2, Trash2, X } from "lucide-react";
import Layout from "../components/Layout/Layout";
import { smsApi } from "../services/smsApi";

const defaultProfile = {
  id: "school-profile",
  schoolName: "Wischool Academy",
  schoolType: "Private K-12",
  phone: "+234 801 234 5678",
  email: "admin@wischool.edu.ng",
  address: "15 Education Crescent, Kano, Nigeria",
  campuses: [
    { id: "main-campus", name: "Main Campus", location: "Kano Municipal", students: 1240, staff: 96 },
    { id: "junior-wing", name: "Junior Wing", location: "Nassarawa", students: 680, staff: 54 },
    { id: "senior-wing", name: "Senior Wing", location: "Tarauni", students: 520, staff: 41 },
  ],
};

const emptyCampus = {
  id: "",
  name: "",
  location: "",
  students: "",
  staff: "",
};

export default function SchoolPage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(defaultProfile);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSchoolProfile() {
      try {
        const response = await smsApi.listSchoolProfile();
        const firstProfile = Array.isArray(response) && response.length > 0 ? response[0] : null;

        if (!active) {
          return;
        }

        if (firstProfile) {
          const normalized = {
            ...defaultProfile,
            ...firstProfile,
            id: firstProfile.id || "school-profile",
            campuses: Array.isArray(firstProfile.campuses) && firstProfile.campuses.length > 0
              ? firstProfile.campuses.map((campus, index) => ({
                  id: campus.id || `campus-${index + 1}`,
                  name: campus.name || "",
                  location: campus.location || "",
                  students: Number(campus.students || 0),
                  staff: Number(campus.staff || 0),
                }))
              : defaultProfile.campuses,
          };

          setProfile(normalized);
          setFormData(normalized);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load school profile.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSchoolProfile();

    return () => {
      active = false;
    };
  }, []);

  const campusCount = useMemo(() => profile.campuses.length, [profile.campuses]);

  function openEditModal() {
    setFormData({
      ...profile,
      campuses: profile.campuses.map((campus) => ({ ...campus })),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCampusChange(index, field, value) {
    setFormData((prev) => ({
      ...prev,
      campuses: prev.campuses.map((campus, campusIndex) =>
        campusIndex === index ? { ...campus, [field]: value } : campus
      ),
    }));
  }

  function addCampus() {
    setFormData((prev) => ({
      ...prev,
      campuses: [
        ...prev.campuses,
        { ...emptyCampus, id: `campus-${Date.now()}` },
      ],
    }));
  }

  function removeCampus(index) {
    setFormData((prev) => ({
      ...prev,
      campuses: prev.campuses.filter((_, campusIndex) => campusIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.schoolName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMessage("School name, phone, and email are required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      id: formData.id || "school-profile",
      name: formData.schoolName,
      title: formData.schoolType,
      email: formData.email,
      schoolName: formData.schoolName,
      schoolType: formData.schoolType,
      phone: formData.phone,
      address: formData.address,
      campuses: formData.campuses.map((campus, index) => ({
        id: campus.id || `campus-${index + 1}`,
        name: campus.name,
        location: campus.location,
        students: Number(campus.students || 0),
        staff: Number(campus.staff || 0),
      })),
    };

    try {
      const saved = await smsApi.saveSchoolProfile(payload);
      const normalized = {
        ...defaultProfile,
        ...saved,
        id: saved.id || "school-profile",
        schoolName: saved.schoolName || saved.name || formData.schoolName,
        schoolType: saved.schoolType || saved.title || formData.schoolType,
        phone: saved.phone || formData.phone,
        email: saved.email || formData.email,
        address: saved.address || formData.address,
        campuses: Array.isArray(saved.campuses) ? saved.campuses : payload.campuses,
      };

      setProfile(normalized);
      setFormData(normalized);
      setSuccessMessage("School profile saved successfully.");
      setIsEditOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Unable to save school profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout activeTab="School">
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">School Profile</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{profile.schoolName}</h1>
              <p className="text-sm text-gray-600 mt-1">Manage institutional information and campus structure.</p>
            </div>
            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              <PencilLine className="w-4 h-4" />
              Edit School Profile
            </button>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="mt-4 text-sm text-green-600">{successMessage}</p>}

          {isLoading ? (
            <div className="mt-6 text-sm text-gray-500">Loading school profile...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <InfoCard icon={School2} label="School Type" value={profile.schoolType} />
                <InfoCard icon={Building2} label="Campuses" value={String(campusCount)} />
                <InfoCard icon={Phone} label="Phone" value={profile.phone} />
                <InfoCard icon={Mail} label="Email" value={profile.email} />
              </div>

              <div className="mt-4 bg-gray-50 rounded-md p-4 flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                {profile.address}
              </div>
            </>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Campus Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Campus Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profile.campuses.map((campus) => (
                  <tr key={campus.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{campus.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{campus.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{campus.students}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{campus.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {isEditOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-5xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Edit School Profile</h2>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} />
                  <InputField label="School Type" name="schoolType" value={formData.schoolType} onChange={handleChange} />
                  <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none min-h-[88px]"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Campuses</h3>
                    <button
                      type="button"
                      onClick={addCampus}
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Campus
                    </button>
                  </div>

                  {formData.campuses.map((campus, index) => (
                    <div key={campus.id || index} className="grid grid-cols-1 md:grid-cols-5 gap-3 border border-gray-200 rounded-lg p-4">
                      <InputField
                        label="Campus Name"
                        value={campus.name}
                        onChange={(event) => handleCampusChange(index, "name", event.target.value)}
                      />
                      <InputField
                        label="Location"
                        value={campus.location}
                        onChange={(event) => handleCampusChange(index, "location", event.target.value)}
                      />
                      <InputField
                        label="Students"
                        type="number"
                        value={String(campus.students)}
                        onChange={(event) => handleCampusChange(index, "students", event.target.value)}
                      />
                      <InputField
                        label="Staff"
                        type="number"
                        value={String(campus.staff)}
                        onChange={(event) => handleCampusChange(index, "staff", event.target.value)}
                      />
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeCampus(index)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save School Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-lg font-semibold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name || label} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name || label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

InputField.defaultProps = {
  name: "",
  type: "text",
};
