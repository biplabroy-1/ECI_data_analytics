"use client"

import { useState, DragEvent } from "react"
import { Upload } from "lucide-react"

export default function CustomDropzone() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[400px]
        ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"}
      `}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <Upload className="w-20 h-20 text-gray-500 mb-6" />

      {isDragging ? (
        <p className="text-2xl font-semibold text-green-600">Drop your files here!</p>
      ) : (
        <>
          <p className="text-2xl font-semibold text-gray-700">Upload files</p>
          <p className="text-lg text-gray-500 mt-2">Drag & drop or click to select</p>
        </>
      )}

      <input
        id="fileInput"
        type="file"
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />

      {files.length > 0 && (
        <div className="mt-4 w-full">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {files.map((file, idx) => (
              <li key={idx}>📄 {file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
