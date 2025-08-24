"use client";

import { useState, DragEvent } from "react";

interface CustomDropzoneProps {
  onDataProcessed: (data: any) => void;
  selectedLanguage?: string;
}

export default function CustomDropzone({
  onDataProcessed,
  selectedLanguage = "english",
}: CustomDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setSelectedFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("language", selectedLanguage);

      const res = await fetch("https://eci-backend.azmth.in/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      onDataProcessed(data);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center min-h-[250px] cursor-pointer transition-all
          ${
            isDragging
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {selectedFile ? (
          <div className="text-center space-y-2">
            <p className="font-medium">{selectedFile.name}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleFileUpload();
              }}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading
                ? "Uploading..."
                : `Upload & Analyze in ${selectedLanguage}`}
            </button>
          </div>
        ) : (
          <p className="text-gray-600">
            Drag & drop or click to select a PDF file
          </p>
        )}
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
