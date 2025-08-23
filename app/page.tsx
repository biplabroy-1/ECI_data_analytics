"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import CustomDropzone from "./fileDropZone";
import CustomDropzone from "@/components/CustomDropzone";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useUser,
  SignInButton,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import { AnalysisProvider, useAnalysis } from "./analysisContext";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalysisProvider>
        <Example />
      </AnalysisProvider>
    </QueryClientProvider>
  );
}

function Example() {
  const { setAnalysis } = useAnalysis();
  // Fetch and show analysis from Flask API
  const fetchAnalysis = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analyze-json");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      alert("Failed to fetch analysis");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <SignedOut>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Electoral Data Analytics
              </h2>
              <p className="text-gray-600 mb-8">
                Secure voter list analysis platform
              </p>
            </div>
            <SignInButton mode="modal">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign In to Continue
              </Button>
            </SignInButton>
            <p className="text-sm text-gray-500 mt-4">azmth</p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Electoral Data Analytics
                  </h1>
                  <p className="text-sm text-gray-500">Voter Analysis Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UserButton />
                <SignOutButton>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </header>

          {/* Main */}
          <div className="flex flex-1 w-full max-w-7xl mx-auto p-6 gap-8">
            {/* Left: Upload + Language */}
            <div className="flex flex-col flex-[0.65] gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload PDF files containing electoral data
                </p>
                <CustomDropzone />
                <Button className="mt-4" onClick={fetchAnalysis}>
                  Fetch Analysis from API
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Language
                </h3>
                <Select>
                  <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right: Analytics Cards */}
            <Separator orientation="vertical" className="h-auto bg-gray-200" />
            <div className="flex flex-col flex-[0.35] gap-6">
              <MetadataCard />
              <SummaryCard />
              <ConfigCard />
            </div>
          </div>

          <Footer />
        </div>
      </SignedIn>
    </div>
  );
}

/* =====================
   CARDS CONNECTED TO CONTEXT
   ===================== */

function MetadataCard() {
  const { analysis } = useAnalysis();
  const metadata = analysis?.metadata;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-auto p-6 bg-gray-500 border text-left flex flex-col items-start space-y-3">
          <h4 className="font-semibold">Document Metadata</h4>
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span>Total Pages</span>
              <span>{metadata?.total_pages ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Constituency</span>
              <span>{metadata?.constituency ?? "Not Specified"}</span>
            </div>
            <div className="flex justify-between">
              <span>District</span>
              <span>{metadata?.district ?? "Not Specified"}</span>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Electoral Metadata</DialogTitle>
        </DialogHeader>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard() {
  const { analysis } = useAnalysis();
  const summary = analysis?.executive_summary;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-auto p-6 bg-gray-500 border text-left flex flex-col items-start space-y-3">
          <h4 className="font-semibold">Analysis Summary</h4>
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span>Integrity Score</span>
              <span>{summary?.key_statistics?.overall_integrity_score ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Voters</span>
              <span>{summary?.key_statistics?.total_voters ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>High Risk</span>
              <span>
                {summary?.key_statistics?.voters_flagged_high_risk?.count ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Medium Risk</span>
              <span>
                {summary?.key_statistics?.voters_flagged_medium_risk?.count ?? 0}
              </span>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Executive Summary</DialogTitle>
        </DialogHeader>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}

function ConfigCard() {
  const { analysis } = useAnalysis();
  const config = analysis?.analysis_config;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-auto p-6 bg-gray-500 border text-left flex flex-col items-start space-y-3">
          <h4 className="font-semibold">Configuration</h4>
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span>Records</span>
              <span>{config?.total_records ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model</span>
              <span>{config?.groq_model ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Thresholds</span>
              <span>
                High ≥{config?.thresholds?.high_risk_score ?? "-"} | Medium ≥
                {config?.thresholds?.medium_risk_score ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{config?.analysis_date ? new Date(config.analysis_date).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analysis Configuration</DialogTitle>
        </DialogHeader>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}
