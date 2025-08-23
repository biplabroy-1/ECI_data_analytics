"use client"

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileSpreadsheet, 
  Users, 
  UserX, 
  BarChart3, 
  Settings,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { ProcessedData } from '../hooks/useFileUpload';
import { useCsvExport } from '../hooks/useCsvExport';

interface CsvExportDialogProps {
  data: ProcessedData;
  trigger?: React.ReactNode;
}

export default function CsvExportDialog({ data, trigger }: CsvExportDialogProps) {
  const [filename, setFilename] = useState('electoral_analysis');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeDuplicates, setIncludeDuplicates] = useState(true);
  const [includeAllVoters, setIncludeAllVoters] = useState(true);
  const [includeAnalysisSummary, setIncludeAnalysisSummary] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string } | null>(null);

  const { 
    exportToCsv, 
    exportAllVoters, 
    exportDuplicatesOnly, 
    exportSummaryOnly,
    getExportStats 
  } = useCsvExport();

  const stats = getExportStats(data);

  const handleFullExport = async () => {
    setIsExporting(true);
    setExportResult(null);
    
    try {
      const result = exportToCsv(data, {
        filename,
        includeMetadata,
        includeDuplicates,
        includeAllVoters,
        includeAnalysisSummary
      });
      
      setExportResult(result);
      
      // Auto-hide success message after 3 seconds
      if (result.success) {
        setTimeout(() => setExportResult(null), 3000);
      }
    } catch (error) {
      setExportResult({
        success: false,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = async (type: 'all' | 'duplicates' | 'summary') => {
    setIsExporting(true);
    setExportResult(null);

    try {
      let result;
      switch (type) {
        case 'all':
          result = exportAllVoters(data);
          break;
        case 'duplicates':
          result = exportDuplicatesOnly(data);
          break;
        case 'summary':
          result = exportSummaryOnly(data);
          break;
      }
      
      setExportResult(result);
      
      if (result.success) {
        setTimeout(() => setExportResult(null), 3000);
      }
    } catch (error) {
      setExportResult({
        success: false,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedFileCount = () => {
    let count = 0;
    if (includeAllVoters) count++;
    if (includeDuplicates && stats.duplicateGroups > 0) count++;
    if (includeMetadata) count++;
    if (includeAnalysisSummary) count++;
    return count;
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Export to CSV
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Export Analysis to CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Overview</CardTitle>
              <CardDescription>
                Summary of data available for export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalVoters}</div>
                  <div className="text-sm text-gray-500">Total Voters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.duplicateGroups}</div>
                  <div className="text-sm text-gray-500">Duplicate Groups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.cleanRecords}</div>
                  <div className="text-sm text-gray-500">Clean Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{stats.pages}</div>
                  <div className="text-sm text-gray-500">Pages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Export</CardTitle>
              <CardDescription>
                Export specific sections individually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleQuickExport('all')}
                  disabled={isExporting}
                >
                  <Users className="w-6 h-6" />
                  <span>All Voters</span>
                  <Badge variant="secondary">{stats.totalVoters} records</Badge>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleQuickExport('duplicates')}
                  disabled={isExporting || stats.duplicateGroups === 0}
                >
                  <UserX className="w-6 h-6" />
                  <span>Duplicates Only</span>
                  <Badge variant="destructive">{stats.duplicateGroups} groups</Badge>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleQuickExport('summary')}
                  disabled={isExporting}
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>Summary Report</span>
                  <Badge variant="outline">Analysis</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Custom Export Configuration
              </CardTitle>
              <CardDescription>
                Configure what data to include in your export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filename Input */}
              <div className="space-y-2">
                <Label htmlFor="filename">Filename (without extension)</Label>
                <Input
                  id="filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="electoral_analysis"
                />
              </div>

              {/* Export Options */}
              <div className="space-y-3">
                <Label>Data to Include:</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allVoters"
                      checked={includeAllVoters}
                      onCheckedChange={(checked) => setIncludeAllVoters(checked as boolean)}
                    />
                    <Label htmlFor="allVoters" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      All Voters ({stats.totalVoters} records)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="duplicates"
                      checked={includeDuplicates}
                      onCheckedChange={(checked) => setIncludeDuplicates(checked as boolean)}
                      disabled={stats.duplicateGroups === 0}
                    />
                    <Label htmlFor="duplicates" className="flex items-center gap-2">
                      <UserX className="w-4 h-4" />
                      Duplicate Analysis ({stats.duplicateGroups} groups)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="summary"
                      checked={includeAnalysisSummary}
                      onCheckedChange={(checked) => setIncludeAnalysisSummary(checked as boolean)}
                    />
                    <Label htmlFor="summary" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analysis Summary
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metadata"
                      checked={includeMetadata}
                      onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                    />
                    <Label htmlFor="metadata" className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Metadata & Configuration
                    </Label>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Export will generate:</strong> {getEstimatedFileCount()} CSV file(s)
                  </p>
                  {getEstimatedFileCount() === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Please select at least one data type to export
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Result Alert */}
          {exportResult && (
            <Alert className={exportResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {exportResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={exportResult.success ? "text-green-700" : "text-red-700"}>
                {exportResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setExportResult(null)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFullExport}
            disabled={isExporting || getEstimatedFileCount() === 0}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export CSV Files
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}