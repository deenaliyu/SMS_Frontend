import { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import EventModal from "../MainEvent/EventModal";
import { smsApi } from "../../../services/smsApi";

const initialFormData = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  organizer: "",
};

export default function AddEventPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.date || !formData.time || !formData.description || !formData.organizer) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const payload = {
      id: Date.now(),
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      location: formData.location.trim(),
      description: formData.description.trim(),
      organizer: formData.organizer.trim(),
    };

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createEvent(payload);
      setSuccessMessage("Event added and saved successfully.");
      setShowModal(true);
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(error.message || "Unable to add event to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeTab="Events">
      <div className="flex flex-col">
        <div className="p-4 rounded bg-white border border-gray-100">
          <h1 className="font-bold text-2xl">Add Event</h1>
        </div>

        <div className="rounded-xl p-4 bg-white border border-gray-100">
          <div className="font-bold text-lg mb-2">Basic Details</div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="title" className="text-sm font-medium">
                    Event Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-1">
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="time" className="text-sm font-medium">
                    Time*
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-1">
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description*
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="organizer" className="text-sm font-medium">
                    Organizer*
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    id="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Organizer"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
              {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 px-4 bg-green-600 border border-green-500 rounded-sm cursor-pointer hover:bg-green-500 disabled:opacity-60 text-white"
                >
                  {isSubmitting ? "Adding..." : "Add Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showModal && <EventModal setShowModal={setShowModal} />}
    </Layout>
  );
}
