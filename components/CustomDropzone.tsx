"use client"

import { useState, DragEvent } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useFileUpload } from "../hooks/useFileUpload"
import { Progress } from "@/components/ui/Progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomDropzoneProps {
  onDataProcessed: (data: any) => void;
  selectedLanguage?: string; // Add language prop
}

export default function CustomDropzone({ onDataProcessed, selectedLanguage = 'english' }: CustomDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { mutate: uploadFile, currentStep, progress, isError, error, isSuccess, isPending } = useFileUpload()

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length > 0) {
      setSelectedFile(pdfFiles[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleFileUpload = () => {
    if (!selectedFile) return
    
    if (selectedFile.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    console.log(`Starting upload with language: ${selectedLanguage}`);
    
    uploadFile(
      { file: selectedFile, language: selectedLanguage },
      {
        onSuccess: (data) => {
          console.log('Upload successful, calling onDataProcessed');
          onDataProcessed(data)
          setSelectedFile(null) // Clear selected file after successful upload
        },
        onError: (error) => {
          console.error('Upload failed:', error);
        }
      }
    )
  }

  const getStepMessage = () => {
    switch (currentStep) {
      case 'uploading':
        return `Extracting data from PDF... (Language: ${selectedLanguage})`
      case 'analyzing':
        return `Analyzing voter data with ${selectedLanguage} language processing...`
      case 'complete':
        return 'Analysis complete!'
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    if (isError) return <AlertCircle className="w-12 h-12 text-red-500" />
    if (isSuccess) return <CheckCircle className="w-12 h-12 text-green-500" />
    if (currentStep !== 'idle') return <Clock className="w-12 h-12 text-blue-500 animate-spin" />
    return <Upload className="w-20 h-20 text-gray-500" />
  }

  const isProcessing = currentStep !== 'idle' || isPending

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[400px]
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
          <div className="text-center mt-6 w-full max-w-lg">
            <p className="text-lg font-semibold text-blue-600 mb-2">
              {getStepMessage()}
            </p>
            <Progress value={progress} className="w-full mb-4 h-3" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Processing may take several minutes for large files...
              </p>
              {currentStep === 'uploading' && (
                <p className="text-xs text-gray-500">
                  ⏳ Extracting voter data from PDF pages
                </p>
              )}
              {currentStep === 'analyzing' && (
                <p className="text-xs text-gray-500">
                  🔍 Running duplicate detection and data validation
                </p>
              )}
              <p className="text-xs text-blue-600 font-medium">
                Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
              </p>
            </div>
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
          <div className="text-center mt-6 space-y-4">
            <div>
              <p className="text-2xl font-semibold text-gray-700">Upload Electoral Roll PDF</p>
              <p className="text-lg text-gray-500 mt-2">
                Drag & drop or click to select PDF file
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supported: PDF files only
              </p>
            </div>
            
            {selectedFile && (
              <div className="bg-white/80 rounded-lg p-4 border">
                <p className="text-sm font-medium text-gray-700">Selected File:</p>
                <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {selectedFile && (
              <div className="space-y-3">
                {!selectedLanguage && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Please select an analysis language first
                    </p>
                  </div>
                )}
                
                <button
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={!selectedFile || !selectedLanguage}
                  onClick={handleFileUpload}
                >
                  {selectedLanguage ? 
                    `Analyze with ${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}` : 
                    'Select Language First'
                  }
                </button>
              </div>
            )}
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
            <div className="mt-2 space-y-1 text-sm">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check if your PDF is not corrupted</li>
                <li>Ensure the PDF contains voter data in a readable format</li>
                <li>Try with a smaller PDF file if the issue persists</li>
                <li>Make sure your internet connection is stable</li>
                <li>Verify the backend server is running on localhost:5000</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {selectedLanguage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            🌐 <strong>Analysis Language:</strong> {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
            <br />
            <span className="text-xs"><span className="font-bold">NOTE:</span> The processing time will depend on the size of PDF and number of pages in it.</span>
            <br />
            <span className="text-xs">The system will process voter names and data using this language context.</span>
          </p>
        </div>
      )}
    </div>
  )
}