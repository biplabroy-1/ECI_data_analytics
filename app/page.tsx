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

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <SignedOut>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Electoral Data Analytics</h2>
              <p className="text-gray-600 mb-8">Secure voter list analysis platform</p>
            </div>
            <SignInButton mode="modal">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign In to Continue
              </Button>
            </SignInButton>
            <p className="text-sm text-gray-500 mt-4">azmth</p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col flex-1">
          {/* Professional Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Electoral Data Analytics</h1>
                    <p className="text-sm text-gray-500">Voter Analysis Platform</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">Online</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9",
                          userButtonPopoverCard: "bg-white shadow-xl border border-gray-200",
                          userButtonPopoverActions: "text-gray-700"
                        }
                      }}
                    />
                    <SignOutButton>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1 w-full max-w-7xl mx-auto p-6 gap-8">
            {/* Left section: Clean Upload + Select */}
            <div className="flex flex-col flex-[0.65] gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
                  <p className="text-gray-600 text-sm">Upload PDF files containing electoral data for analysis</p>
                </div>
                <CustomDropzone />
              </div>

              {/* Language Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Language</h3>
                  <p className="text-gray-600 text-sm">Select the language for data processing</p>
                </div>
                <Select>
                  <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Separator */}
            <Separator orientation="vertical" className="h-auto bg-gray-200" />

            {/* Right section: Clean Analytics Cards */}
            <div className="flex flex-col flex-[0.35] gap-6">
              {/* Metadata Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-auto p-6 bg-white hover:bg-gray-50 text-left border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Document Metadata</h4>
                        <p className="text-sm text-gray-500">File information</p>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Total Pages</span>
                        <span className="font-medium text-purple-600">38</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Constituency</span>
                        <span className="text-sm text-gray-400">Not Specified</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">District</span>
                        <span className="text-sm text-gray-400">Not Specified</span>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Electoral Metadata</DialogTitle>
                  </DialogHeader>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {JSON.stringify({
                        metadata: {
                          constituency: "",
                          district: "",
                          total_pages: 38
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Summary Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-auto p-6 bg-white hover:bg-gray-50 text-left border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Analysis Summary</h4>
                        <p className="text-sm text-gray-500">Key insights</p>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-md">
                        <span className="text-sm text-gray-600">Integrity Score</span>
                        <span className="font-semibold text-green-600">99.1%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Total Voters</span>
                        <span className="font-medium text-gray-700">995</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-md">
                        <span className="text-sm text-gray-600">High Risk</span>
                        <span className="font-medium text-red-600">1 (0.1%)</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-yellow-50 rounded-md">
                        <span className="text-sm text-gray-600">Medium Risk</span>
                        <span className="font-medium text-yellow-600">15 (1.51%)</span>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Executive Summary</DialogTitle>
                  </DialogHeader>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {JSON.stringify({
                        executive_summary: {
                          overview: "*dummy data",
                          key_statistics: {
                            total_voters: 995,
                            voters_flagged_high_risk: {
                              count: 1,
                              percentage: 0.1
                            },
                            voters_flagged_medium_risk: {
                              count: 15,
                              percentage: 1.51
                            },
                            overall_integrity_score: 99.1
                          }
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Analysis Details Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-auto p-6 bg-white hover:bg-gray-50 text-left border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Configuration</h4>
                        <p className="text-sm text-gray-500">Technical details</p>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Records</span>
                        <span className="font-medium text-gray-700">995</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">AI Model</span>
                        <span className="font-medium text-blue-600">GPT-OSS 20B</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Thresholds</span>
                        <span className="text-xs text-gray-500">High ≥0.7 | Medium ≥0.4</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-md">
                        <span className="text-sm text-gray-600">Date</span>
                        <span className="text-sm text-blue-600">{new Date("2025-08-20").toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Analysis Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {JSON.stringify({
                        metadata: {
                          analysis_date: "2025-08-20T16:50:36.502134",
                          total_records: 995,
                          configuration: {
                            groq_model: "openai/gpt-oss-20b",
                            thresholds: {
                              high_risk_score: 0.7,
                              medium_risk_score: 0.4
                            }
                          }
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Footer />
        </div>
      </SignedIn>
    </div>
  );
}
