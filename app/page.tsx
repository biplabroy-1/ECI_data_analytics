"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./Footer";
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
  SignedIn, 
  SignedOut,
  UserButton,
  SignOutButton
} from "@clerk/nextjs";
import { ProcessedData } from "../hooks/useFileUpload";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CsvExportDialog from "@/components/CsvExportDialog";
import { 
  Download, 
  FileSpreadsheet, 
  BarChart3, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  FileText,
  LogOut,
  User,
  Vote,
  TrendingUp
} from "lucide-react";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const { user } = useUser();

  const handleDataProcessed = (data: ProcessedData) => {
    setProcessedData(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Electoral Analytics
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Advanced Electoral Data Analysis Platform
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure data processing</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span>Advanced analytics & insights</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FileSpreadsheet className="w-4 h-4 text-purple-500" />
                    <span>Export & reporting tools</span>
                  </div>
                </div>

                <SignInButton mode="modal">
                  <Button size="lg" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Sign In to Continue
                  </Button>
                </SignInButton>
                
                <p className="text-xs text-gray-500 mt-4">
                  Secure authentication powered by Clerk
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen flex flex-col">
          {/* Modern Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Electoral Analytics</h1>
                    <p className="text-sm text-gray-500">Advanced Data Analysis Platform</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">Welcome back</p>
                    <p className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-xl"
                      }
                    }}
                  />
                  <SignOutButton>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              
              {/* Left Panel - Upload & Controls */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span>Document Upload</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomDropzone onDataProcessed={handleDataProcessed} />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span>Analysis Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Analysis Language</label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="Choose analysis language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">🇺🇸 English</SelectItem>
                          <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                          <SelectItem value="tamil">🇮🇳 Tamil</SelectItem>
                          <SelectItem value="bengali">🇮🇳 Bengali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Analytics Dashboard */}
              <div className="space-y-6">
                
                {/* Quick Stats */}
                {processedData && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">Integrity Score</p>
                            <p className="text-2xl font-bold">{processedData.executiveSummary.overall_integrity_score.toFixed(1)}%</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-200" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">Total Voters</p>
                            <p className="text-2xl font-bold">{processedData.executiveSummary.total_voters.toLocaleString()}</p>
                          </div>
                          <Users className="w-8 h-8 text-blue-200" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* CSV Export */}
                {processedData && (
                  <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <CsvExportDialog 
                        data={processedData}
                        trigger={
                          <Button className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Download className="w-5 h-5" />
                                <FileSpreadsheet className="w-5 h-5" />
                              </div>
                              <span>Export Analysis</span>
                            </div>
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Metadata Card */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Electoral Metadata
                          </h3>
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        
                        {processedData ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Pages</span>
                              <Badge variant="secondary">{processedData.uploadData.metadata.total_pages}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Images Processed</span>
                              <Badge variant="outline">{processedData.uploadData.images_processed}</Badge>
                            </div>
                            {processedData.uploadData.metadata.constituency && (
                              <div className="text-xs text-gray-500">
                                {processedData.uploadData.metadata.constituency}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Upload a document to view metadata</p>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <span>Electoral Metadata</span>
                      </DialogTitle>
                    </DialogHeader>
                    <Card>
                      <CardContent className="p-6">
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                          {JSON.stringify(processedData?.uploadData.metadata || {}, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>

                {/* Executive Summary Card */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            Executive Summary
                          </h3>
                          <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                        
                        {processedData ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">High Risk</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="destructive" className="text-xs">
                                  {processedData.executiveSummary.voters_flagged_high_risk.count}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  ({processedData.executiveSummary.voters_flagged_high_risk.percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Medium Risk</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {processedData.executiveSummary.voters_flagged_medium_risk.count}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  ({processedData.executiveSummary.voters_flagged_medium_risk.percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Upload a document to view summary</p>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <span>Executive Summary</span>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-96">
                      {processedData && (
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Summary Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Total Voters</p>
                                  <p className="text-2xl font-bold">{processedData.executiveSummary.total_voters.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Integrity Score</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    {processedData.executiveSummary.overall_integrity_score.toFixed(1)}%
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Risk Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span>High Risk (Duplicates)</span>
                                  <Badge variant="destructive">
                                    {processedData.executiveSummary.voters_flagged_high_risk.count} voters
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Medium Risk (Inconsistencies)</span>
                                  <Badge variant="secondary">
                                    {processedData.executiveSummary.voters_flagged_medium_risk.count} voters
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Detailed Analysis Card */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            Detailed Analysis
                          </h3>
                          <AlertTriangle className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        </div>
                        
                        {processedData ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Duplicates</p>
                                <p className="font-semibold text-red-600">
                                  {processedData.analysisData.duplicates.length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Format Issues</p>
                                <p className="font-semibold text-yellow-600">
                                  {processedData.analysisData.format_inconsistencies.length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Sequential Issues</p>
                                <p className="font-semibold text-blue-600">
                                  {processedData.analysisData.sequential_runs.length}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Patterns</p>
                                <p className="font-semibold text-purple-600">
                                  {processedData.analysisData.suspicious_patterns.length}
                                </p>
                              </div>
                            </div>
                            {selectedLanguage && (
                              <div className="text-xs text-gray-500 pt-2 border-t">
                                Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Upload a document to view analysis</p>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                        <span>Detailed Analysis Results</span>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                      {processedData && (
                        <div className="space-y-6">
                          {/* Duplicates Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg text-red-600 flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Duplicate Voters ({processedData.analysisData.duplicates.length})</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {processedData.analysisData.duplicates.length > 0 ? (
                                <div className="space-y-4">
                                  {processedData.analysisData.duplicates.map((duplicate, index) => (
                                    <Card key={index} className="border-l-4 border-l-red-500">
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-semibold">Voter ID: {duplicate.voter_id}</h4>
                                          <Badge variant="destructive">
                                            {duplicate.count} duplicates
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                          <div>
                                            <span className="font-medium">Name:</span> {duplicate.records[0]?.name}
                                          </div>
                                          <div>
                                            <span className="font-medium">Age:</span> {duplicate.records[0]?.age}
                                          </div>
                                          <div>
                                            <span className="font-medium">Father:</span> {duplicate.records[0]?.father_name}
                                          </div>
                                          <div>
                                            <span className="font-medium">House:</span> {duplicate.records[0]?.house_number}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>No duplicate voters found.</span>
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          {/* Analysis Summary Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-l-4 border-l-yellow-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-yellow-600">Format Inconsistencies</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-bold">
                                  {processedData.analysisData.format_inconsistencies.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Data formatting issues detected
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-blue-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-blue-600">Sequential Runs</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-bold">
                                  {processedData.analysisData.sequential_runs.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Unusual sequence patterns
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-purple-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-purple-600">Suspicious Patterns</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-bold">
                                  {processedData.analysisData.suspicious_patterns.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Potential irregularities found
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Raw Data Preview */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <FileText className="w-5 h-5" />
                                <span>Raw Analysis Data</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
                                {JSON.stringify(processedData.analysisData, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </SignedIn>
    </div>
  );
}