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
} from "@clerk/nextjs";
import { ProcessedData } from "../hooks/useFileUpload";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CsvExportDialog from "@/components/CsvExportDialog";
import { Download, FileSpreadsheet } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <SignedOut>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Electoral Data Analytics</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the application</p>
            <SignInButton mode="modal">
              <Button size="lg">Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 w-full max-w-6xl mx-auto p-6 gap-6">
            {/* Left section: PDF Uploader + Select (70%) */}
            <div className="flex flex-col flex-[0.7] gap-6 justify-around align-middle">
              <div className="flex-1">
                <CustomDropzone onDataProcessed={handleDataProcessed} />
              </div>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose analysis language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Separator */}
            <Separator orientation="vertical" className="h-auto" />

            {/* Right section: Analysis Results (30%) */}
            <div className="flex flex-col flex-[0.3] items-center justify-center gap-6">
              
              {/* CSV Export Button */}
              {processedData && (
                <div className="w-80">
                  <CsvExportDialog 
                    data={processedData}
                    trigger={
                      <Button className="w-full h-16 text-lg flex flex-col items-center justify-center p-4 gap-2">
                        <div className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">Export to CSV</span>
                        <span className="text-sm text-gray-200">
                          Download analysis results
                        </span>
                      </Button>
                    }
                  />
                </div>
              )}

              {/* Electoral Metadata */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-80 h-44 text-lg flex flex-col items-center justify-center p-4"
                    variant={processedData ? "default" : "secondary"}
                    disabled={!processedData}
                  >
                    <span className="font-semibold mb-2">Electoral Metadata</span>
                    {processedData ? (
                      <>
                        <div className="text-base text-gray-600 mb-1">
                          Total Pages: {processedData.uploadData.metadata.total_pages}
                        </div>
                        <div className="text-sm text-gray-500">
                          Constituency: {processedData.uploadData.metadata.constituency || "Not Specified"}
                        </div>
                        <div className="text-sm text-gray-500">
                          District: {processedData.uploadData.metadata.district || "Not Specified"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Images: {processedData.uploadData.images_processed}
                        </div>
                      </>
                    ) : (
                      <div className="text-base text-gray-500">
                        Upload a PDF to view metadata
                      </div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Electoral Metadata</DialogTitle>
                  </DialogHeader>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(processedData?.uploadData.metadata || {}, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Executive Summary */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-80 h-44 text-lg flex flex-col items-center justify-center p-4"
                    variant={processedData ? "default" : "secondary"}
                    disabled={!processedData}
                  >
                    <span className="font-semibold mb-2">Executive Summary</span>
                    {processedData ? (
                      <>
                        <div className="text-base text-green-600 font-medium mb-1">
                          Integrity Score: {processedData.executiveSummary.overall_integrity_score.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Voters: {processedData.executiveSummary.total_voters}
                        </div>
                        <div className="text-sm text-red-500">
                          High Risk: {processedData.executiveSummary.voters_flagged_high_risk.count} ({processedData.executiveSummary.voters_flagged_high_risk.percentage.toFixed(2)}%)
                        </div>
                        <div className="text-sm text-yellow-500">
                          Medium Risk: {processedData.executiveSummary.voters_flagged_medium_risk.count} ({processedData.executiveSummary.voters_flagged_medium_risk.percentage.toFixed(2)}%)
                        </div>
                      </>
                    ) : (
                      <div className="text-base text-gray-500">
                        Upload a PDF to view summary
                      </div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Executive Summary</DialogTitle>
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
                                <p className="text-2xl font-bold">{processedData.executiveSummary.total_voters}</p>
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

              {/* Detailed Analysis */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-80 h-52 text-lg flex flex-col items-center justify-center p-4"
                    variant={processedData ? "default" : "secondary"}
                    disabled={!processedData}
                  >
                    <span className="font-semibold mb-2">Detailed Analysis</span>
                    {processedData ? (
                      <>
                        <div className="text-base text-gray-600 mb-1">
                          Duplicates Found: {processedData.analysisData.duplicates.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Format Issues: {processedData.analysisData.format_inconsistencies.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Sequential Issues: {processedData.analysisData.sequential_runs.length}
                        </div>
                        <div className="text-sm text-gray-500">
                          Suspicious Patterns: {processedData.analysisData.suspicious_patterns.length}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Language: {selectedLanguage || "Not Selected"}
                        </div>
                      </>
                    ) : (
                      <div className="text-base text-gray-500">
                        Upload a PDF to view analysis
                      </div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl mb-4">Detailed Analysis Results</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh]">
                    {processedData && (
                      <div className="space-y-6">
                        {/* Duplicates Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg text-red-600">
                              Duplicate Voters ({processedData.analysisData.duplicates.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {processedData.analysisData.duplicates.length > 0 ? (
                              <div className="space-y-4">
                                {processedData.analysisData.duplicates.map((duplicate, index) => (
                                  <div key={index} className="border rounded-lg p-4">
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
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No duplicate voters found.</p>
                            )}
                          </CardContent>
                        </Card>

                        {/* Other Analysis Results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader>
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

                          <Card>
                            <CardHeader>
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

                          <Card>
                            <CardHeader>
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
                            <CardTitle className="text-lg">Raw Analysis Data</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto">
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
          <Footer />
        </div>
      </SignedIn>
    </div>
  );
}