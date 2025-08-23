"use client";

import { useState } from "react";
import Dropzone, { DropzoneState } from "shadcn-dropzone";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAnalysis } from "./analysisContext";

// File upload API call
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/analyze-pdf", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export default function CustomDropzone() {
  const { setAnalysis } = useAnalysis();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      console.log("✅ Upload successful:", data);
      setAnalysis(data);
    },
    onError: (err) => {
      console.error("❌ Upload error:", err);
    },
  });

  return (
    <Dropzone
      accept={{ "application/pdf": [".pdf"] }}
      multiple={false}
      onDrop={(acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          setSelectedFile(acceptedFiles[0]);
        }
      }}
    >
      {(dropzone: DropzoneState) => (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer
          ${
            dropzone.isDragAccept
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <Upload className="w-10 h-10 text-gray-500 mb-3" />

          {dropzone.isDragAccept ? (
            <div className="text-base font-semibold text-green-600">
              Drop your PDF here!
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-lg font-semibold text-gray-700">
                Upload PDF
              </span>
              <span className="text-sm text-gray-500">
                Drag & drop or click to select
              </span>
            </div>
          )}

          <div className="text-xs text-gray-400 font-medium mt-3">
            {selectedFile ? `1 file selected: ${selectedFile.name}` : "No file selected"}
          </div>

          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!selectedFile || mutation.isPending}
            onClick={() => {
              if (selectedFile) mutation.mutate(selectedFile);
            }}
          >
            {mutation.isPending ? "Uploading..." : "Submit"}
          </button>

          {/* Upload Status */}
          {mutation.isSuccess && (
            <p className="mt-3 text-sm text-green-600 font-medium">
              ✅ Upload successful!
            </p>
          )}
          {mutation.isError && (
            <p className="mt-3 text-sm text-red-600 font-medium">
              ❌ Upload failed
            </p>
          )}
        </div>
      )}
    </Dropzone>
  );
}
