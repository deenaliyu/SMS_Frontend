import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import FileUploadBox from "./FileUploadBox";
import NoticeModal from "./NoticeModal";
import { invoiceData } from "../../Finance/data";
import { smsApi } from "../../services/smsApi";

const initialFormData = {
  parentName: "",
  title: "",
  noticeBy: "",
  moreAbout: "",
};

export default function NewItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [textLength, setTextLength] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "moreAbout") {
      setTextLength(value.length);
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.parentName || !formData.title || !formData.noticeBy || !formData.moreAbout) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await smsApi.createNotice(formData);
      setShowModal(true);
      setFormData(initialFormData);
      setTextLength(0);
    } catch (error) {
      setErrorMessage(error.message || "Unable to add notice item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeTab="Notice Board">
      <div className="min-h-screen">
        <div className="bg-white rounded-md px-5 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">Notice Board</h1>
            <div className="flex gap-3 items-center text-gray-400 cursor-pointer">
              <p onClick={() => navigate("/notice-board")}>Notice Board</p>
              <p>{">"}</p>
              <p className="font-medium cursor-pointer text-black">Add Item</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex flex-col gap-1">
                  <h1 className="text-sm font-medium">Media</h1>
                  <FileUploadBox />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="parentName" className="text-sm font-medium">
                    Parent Name
                  </label>
                  <select
                    name="parentName"
                    id="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select Parent</option>
                    {invoiceData.map((parent) => (
                      <option key={parent.id} value={parent.invoicedTo}>
                        {parent.invoicedTo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-1">
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="noticeBy" className="text-sm font-medium">
                    Notice By
                  </label>
                  <input
                    type="text"
                    name="noticeBy"
                    id="noticeBy"
                    value={formData.noticeBy}
                    onChange={handleChange}
                    placeholder="Notice By"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="moreAbout" className="text-sm font-medium">
                  More about the event/notice
                </label>
                <textarea
                  name="moreAbout"
                  id="moreAbout"
                  rows="11"
                  value={formData.moreAbout}
                  onChange={handleChange}
                  placeholder="Enter event here"
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-500 rounded font-medium hover:bg-green-600 font-base cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : textLength > 0 ? "Save" : "Add Item"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showModal && <NoticeModal setShowModal={setShowModal} />}
    </Layout>
  );
}
