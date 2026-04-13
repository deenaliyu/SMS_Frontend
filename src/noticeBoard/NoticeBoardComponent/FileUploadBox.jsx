import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function FileUploadBox() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  const formatFileSize = (size) => {
    if (size < 1024) return size + " bytes";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        onChange={handleFileChange}
      />

      <label
        htmlFor="fileUpload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md text-center cursor-pointer transition border-gray-400`}
      >
        {file ? (
          <div className="flex items-center justify-between p-3">
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-sm font-medium mt-1 inline-block"
              >
                Click to view
              </a>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 font-medium">
              <span className="text-green-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
          </div>
        )}
      </label>
    </div>
  );
}
