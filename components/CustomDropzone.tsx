"use client"

import { useState, DragEvent } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useFileUpload } from "../hooks/useFileUpload"
import { Progress } from "@/components/ui/Progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomDropzoneProps {
  onDataProcessed: (data: any) => void;
}

export default function CustomDropzone({ onDataProcessed }: CustomDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { mutate: uploadFile, currentStep, progress, isError, error, isSuccess } = useFileUpload()

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length > 0) {
      handleFileUpload(pdfFiles[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }
    
    uploadFile(file, {
      onSuccess: (data) => {
        onDataProcessed(data)
      }
    })
  }

  const getStepMessage = () => {
    switch (currentStep) {
      case 'uploading':
        return 'Extracting data from PDF...'
      case 'analyzing':
        return 'Analyzing voter data for duplicates and inconsistencies...'
      case 'complete':
        return 'Analysis complete!'
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    if (isError) return <AlertCircle className="w-6 h-6 text-red-500" />
    if (isSuccess) return <CheckCircle className="w-6 h-6 text-green-500" />
    if (currentStep !== 'idle') return <Clock className="w-6 h-6 text-blue-500 animate-spin" />
    return <Upload className="w-20 h-20 text-gray-500" />
  }

  const isProcessing = currentStep !== 'idle'

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[400px]
          ${isDragging ? "border-green-500 bg-green-50" : 
            isProcessing ? "border-blue-400 bg-blue-50" :
            isError ? "border-red-400 bg-red-50" :
            isSuccess ? "border-green-400 bg-green-50" :
            "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"}
          ${isProcessing ? 'pointer-events-none' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          if (!isProcessing) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById("fileInput")?.click()}
      >
        {getStatusIcon()}

        {isProcessing ? (
          <div className="text-center mt-6 w-full max-w-md">
            <p className="text-lg font-semibold text-blue-600 mb-2">
              {getStepMessage()}
            </p>
            <Progress value={progress} className="w-full mb-4" />
            <p className="text-sm text-gray-600">
              This may take a few minutes for large files...
            </p>
          </div>
        ) : isDragging ? (
          <p className="text-2xl font-semibold text-green-600 mt-6">
            Drop your PDF here!
          </p>
        ) : isSuccess ? (
          <div className="text-center mt-6">
            <p className="text-2xl font-semibold text-green-600">
              Analysis Complete!
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Check the results in the panels on the right
            </p>
          </div>
        ) : (
          <div className="text-center mt-6">
            <p className="text-2xl font-semibold text-gray-700">Upload PDF</p>
            <p className="text-lg text-gray-500 mt-2">
              Drag & drop or click to select electoral roll PDF
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supported: PDF files only
            </p>
          </div>
        )}

        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
      </div>

      {isError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>Upload Failed:</strong> {error?.message || 'An error occurred during processing'}
            <br />
            <span className="text-sm">Please try again if the issue persists.</span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 