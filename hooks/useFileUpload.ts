// hooks/useFileUpload.ts
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface UploadResponse {
  images_processed: number;
  metadata: {
    constituency: string;
    district: string;
    total_pages: number;
  };
  pages: Array<{
    page_info: {
      image_file: string;
      page_number: number;
      processed_at: string;
    };
    voter_count: number;
    voters: Array<{
      age: string;
      father_name: string;
      gender: string;
      house_number: string;
      name: string;
      photo_status: string;
      serial_number: string;
      voter_id: string;
    }>;
  }>;
}

interface AnalysisResponse {
  duplicates: Array<{
    count: number;
    voter_id: string;
    records: Array<{
      age: string;
      father_name: string;
      gender: string;
      house_number: string;
      name: string;
      photo_status: string;
      serial_number: string;
      voter_id: string;
      page_info: {
        image_file: string;
        page_number: number;
        processed_at: string;
      };
    }>;
  }>;
  format_inconsistencies: any[];
  sequential_runs: any[];
  suspicious_patterns: any[];
}

export interface ProcessedData {
  uploadData: UploadResponse;
  analysisData: AnalysisResponse;
  executiveSummary: {
    total_voters: number;
    voters_flagged_high_risk: {
      count: number;
      percentage: number;
    };
    voters_flagged_medium_risk: {
      count: number;
      percentage: number;
    };
    overall_integrity_score: number;
  };
}

async function uploadAndExtractPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); 

  try {
    const res = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out. Please try with a smaller file or check your connection.');
    }
    throw error;
  }
}

// Analyze extracted data
async function analyzeData(extractedData: UploadResponse): Promise<AnalysisResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const res = await fetch("http://localhost:5000/api/analyze-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(extractedData),      
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Analysis failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Analysis timed out. The data is complex and taking longer than expected.');
    }
    throw error;
  }
}

export function useFileUpload() {
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<ProcessedData> => {
      try {
        // Step 1: Upload and extract PDF
        setCurrentStep('uploading');
        setProgress(20);
        
        const uploadData = await uploadAndExtractPDF(file);
        
        setProgress(50);
        
        // Step 2: Analyze extracted data
        setCurrentStep('analyzing');
        setProgress(70);
        
        const analysisData = await analyzeData(uploadData);
        
        setProgress(90);
        
        // Step 3: Calculate executive summary
        const totalVoters = uploadData.pages.reduce((sum, page) => sum + page.voter_count, 0);
        const duplicateCount = analysisData.duplicates.reduce((sum, dup) => sum + dup.count, 0);
        const highRiskCount = duplicateCount; // Assuming duplicates are high risk
        const mediumRiskCount = analysisData.format_inconsistencies.length + 
                               analysisData.suspicious_patterns.length;
        
        const executiveSummary = {
          total_voters: totalVoters,
          voters_flagged_high_risk: {
            count: highRiskCount,
            percentage: totalVoters > 0 ? (highRiskCount / totalVoters) * 100 : 0,
          },
          voters_flagged_medium_risk: {
            count: mediumRiskCount,
            percentage: totalVoters > 0 ? (mediumRiskCount / totalVoters) * 100 : 0,
          },
          overall_integrity_score: totalVoters > 0 ? 
            100 - ((highRiskCount + mediumRiskCount) / totalVoters) * 100 : 100,
        };
        
        setProgress(100);
        setCurrentStep('complete');
        
        return {
          uploadData,
          analysisData,
          executiveSummary,
        };
      } catch (error) {
        setCurrentStep('idle');
        setProgress(0);
        throw error;
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        setCurrentStep('idle');
        setProgress(0);
      }, 2000);
    },
    onError: () => {
      setCurrentStep('idle');
      setProgress(0);
    },
  });

  return {
    ...mutation,
    currentStep,
    progress,
  };
}