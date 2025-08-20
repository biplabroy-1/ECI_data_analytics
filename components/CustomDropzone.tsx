"use client"

import { useState, DragEvent } from "react"
import { Upload, FileText, CheckCircle } from "lucide-react"

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
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[300px]
        ${isDragging 
          ? "border-blue-400 bg-blue-50" 
          : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"}
      `}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <div className="text-center">
        <div className="mb-6">
          <Upload className={`w-12 h-12 mx-auto transition-colors ${
            isDragging ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>

        {isDragging ? (
          <div>
            <p className="text-lg font-semibold text-blue-600 mb-2">Drop files here</p>
            <p className="text-blue-500">Release to upload</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Upload Documents</p>
            <p className="text-gray-500 mb-4">Drag and drop PDF files or click to browse</p>
            <p className="text-sm text-gray-400">Supports PDF files up to 100MB</p>
          </div>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        className="hidden"
        multiple
        accept=".pdf"
        onChange={handleFileSelect}
      />

      {files.length > 0 && (
        <div className="mt-6 w-full max-w-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-20 overflow-y-auto">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-md border border-gray-200">
                <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">{file.name}</span>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}