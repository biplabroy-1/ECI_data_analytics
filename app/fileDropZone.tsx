"use client"

import Dropzone, { DropzoneState } from "shadcn-dropzone"
import { Upload } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

// File upload API call
async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/xyz", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) throw new Error("Upload failed")
  return res.json()
}

export const CustomUI = () => {
  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      console.log("✅ Upload successful:", data)
    },
    onError: (err) => {
      console.error("❌ Upload error:", err)
    },
  })

  return (
    <Dropzone
      accept={{ "application/pdf": [".pdf"] }}
      multiple={false}
      onDrop={(acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          mutation.mutate(acceptedFiles[0])
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
            {dropzone.acceptedFiles.length} file(s) selected
          </div>

          {/* Upload Status */}
          {mutation.isPending && (
            <p className="mt-3 text-sm text-blue-500 font-medium">
              ⏳ Uploading...
            </p>
          )}
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
  )
}
