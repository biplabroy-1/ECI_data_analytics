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

  // Increased timeout and better error handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

  try {
    const res = await fetch("/api/analyse-pdf", {
      method: "POST",
      body: formData,
      signal: controller.signal,
      // Add keepalive to prevent connection drops
      keepalive: true,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Upload failed: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out after 10 minutes. Please try with a smaller file or check your connection.');
    }
    throw error;
  }
}

// Analyze extracted data with language support
async function analyzeData(extractedData: UploadResponse, language: string = 'english'): Promise<AnalysisResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

  try {
    const requestBody = {
      ...extractedData,
      analysis_language: language, // Add language parameter
    };

    const res = await fetch("http://localhost:5000/api/analyze-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),      
      signal: controller.signal,
      keepalive: true,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Analysis failed: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Analysis timed out after 5 minutes. The data is complex and taking longer than expected.');
    }
    throw error;
  }
}

interface UseFileUploadOptions {
  language?: string;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ file, language = 'english' }: { file: File; language?: string }): Promise<ProcessedData> => {
      try {
        console.log(`Starting analysis with language: ${language}`);
        
        // Step 1: Upload and extract PDF
        setCurrentStep('uploading');
        setProgress(10);
        
        const uploadData = await uploadAndExtractPDF(file);
        
        console.log('PDF extraction completed, starting analysis...');
        setProgress(50);
        
        // Step 2: Analyze extracted data with language
        setCurrentStep('analyzing');
        setProgress(60);
        
        const analysisData = await analyzeData(uploadData, language);
        
        console.log('Analysis completed, generating summary...');
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
        
        console.log('Analysis complete!');
        
        return {
          uploadData,
          analysisData,
          executiveSummary,
        };
      } catch (error) {
        console.error('File upload/analysis error:', error);
        setCurrentStep('idle');
        setProgress(0);
        throw error;
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        setCurrentStep('idle');
        setProgress(0);
      }, 3000); // Increased display time
    },
    onError: (error) => {
      console.error('Upload mutation error:', error);
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