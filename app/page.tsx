"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main layout */}
      <div className="flex flex-1 w-full max-w-6xl mx-auto p-6 gap-6">
        {/* Left section: PDF Uploader + Select (70%) */}
        <div className="flex flex-col flex-[0.7] gap-6 justify-around align-middle">
          <div className="flex-1">
            <CustomDropzone />
          </div>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Separator */}
        <Separator orientation="vertical" className="h-auto" />

        {/* Right section: Buttons (40%) */}
        <div className="flex flex-col flex-[0.3] items-center justify-center gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-80 h-44 text-lg flex flex-col items-center justify-center p-4">
                <span className="font-semibold mb-2">Electoral Metadata</span>
                <div className="text-base text-gray-600 mb-1">
                  Total Pages: 38
                </div>
                <div className="text-sm text-gray-500">
                  Constituency: Not Specified
                </div>
                <div className="text-sm text-gray-500">
                  District: Not Specified
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl mb-4">Electoral Metadata</DialogTitle>
              </DialogHeader>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <pre className="whitespace-pre-wrap text-sm">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-80 h-44 text-lg flex flex-col items-center justify-center p-4">
                <span className="font-semibold mb-2">Executive Summary</span>
                <div className="text-base text-green-600 font-medium mb-1">
                  Integrity Score: 99.1%
                </div>
                <div className="text-sm text-gray-600">
                  Total Voters: 995
                </div>
                <div className="text-sm text-red-500">
                  High Risk: 1 (0.1%)
                </div>
                <div className="text-sm text-yellow-500">
                  Medium Risk: 15 (1.51%)
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl mb-4">Executive Summary</DialogTitle>
              </DialogHeader>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <pre className="whitespace-pre-wrap text-sm">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-80 h-52 text-lg flex flex-col items-center justify-center p-4">
                <span className="font-semibold mb-2">Analysis Details</span>
                <div className="text-base text-gray-600 mb-1">
                  Total Records: 995
                </div>
                <div className="text-sm text-gray-600">
                  Model: GPT-OSS 20B
                </div>
                <div className="text-sm text-gray-500">
                  Risk Thresholds:
                </div>
                <div className="text-xs text-gray-500">
                  High ≥0.7 | Medium ≥0.4
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date("2025-08-20").toLocaleDateString()}
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl mb-4">Analysis Configuration</DialogTitle>
              </DialogHeader>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <pre className="whitespace-pre-wrap text-sm">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
