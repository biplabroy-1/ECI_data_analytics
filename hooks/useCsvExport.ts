
import { ProcessedData } from './useFileUpload';

interface CsvExportOptions {
  filename?: string;
  includeMetadata?: boolean;
  includeDuplicates?: boolean;
  includeAllVoters?: boolean;
  includeAnalysisSummary?: boolean;
}

interface VoterRecord {
  serial_number: string;
  voter_id: string;
  name: string;
  father_name: string;
  age: string;
  gender: string;
  house_number: string;
  photo_status: string;
  page_number: number;
  image_file: string;
  processed_at: string;
  duplicate_status?: 'No' | 'Yes';
  duplicate_count?: number;
  risk_level?: 'Low' | 'Medium' | 'High';
}

interface MetadataRecord {
  field: string;
  value: string;
}

interface DuplicateRecord {
  voter_id: string;
  duplicate_count: number;
  name: string;
  father_name: string;
  age: string;
  gender: string;
  house_number: string;
  pages_found: string;
}

interface SummaryRecord {
  metric: string;
  value: string;
  percentage?: string;
}

export function useCsvExport() {
  
  // Convert array of objects to CSV string
  const arrayToCsv = (data: any[], headers?: string[]): string => {
    if (data.length === 0) return '';
    
    const csvHeaders = headers || Object.keys(data[0]);
    const headerRow = csvHeaders.join(',');
    
    const dataRows = data.map(row => 
      csvHeaders.map(header => {
        const value = row[header] || '';
        // Escape CSV special characters
        const escapedValue = String(value).replace(/"/g, '""');
        // Wrap in quotes if contains comma, newline, or quote
        return /[",\n\r]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
      }).join(',')
    );
    
    return [headerRow, ...dataRows].join('\n');
  };

  // Download CSV file
  const downloadCsv = (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Generate metadata CSV
  const generateMetadataCsv = (data: ProcessedData): string => {
    const metadataRecords: MetadataRecord[] = [
      { field: 'Total Pages', value: data.uploadData.metadata.total_pages.toString() },
      { field: 'Images Processed', value: data.uploadData.images_processed.toString() },
      { field: 'Constituency', value: data.uploadData.metadata.constituency || 'Not Specified' },
      { field: 'District', value: data.uploadData.metadata.district || 'Not Specified' },
      { field: 'Analysis Date', value: new Date().toISOString() },
      { field: 'Total Voters', value: data.executiveSummary.total_voters.toString() },
      { field: 'Integrity Score', value: `${data.executiveSummary.overall_integrity_score.toFixed(2)}%` },
      { field: 'High Risk Voters', value: data.executiveSummary.voters_flagged_high_risk.count.toString() },
      { field: 'Medium Risk Voters', value: data.executiveSummary.voters_flagged_medium_risk.count.toString() },
      { field: 'Duplicates Found', value: data.analysisData.duplicates.length.toString() },
      { field: 'Format Inconsistencies', value: data.analysisData.format_inconsistencies.length.toString() },
      { field: 'Sequential Runs', value: data.analysisData.sequential_runs.length.toString() },
      { field: 'Suspicious Patterns', value: data.analysisData.suspicious_patterns.length.toString() },
    ];

    return arrayToCsv(metadataRecords, ['field', 'value']);
  };

  // Generate all voters CSV
  const generateAllVotersCsv = (data: ProcessedData): string => {
    const duplicateVoterIds = new Set(
      data.analysisData.duplicates.flatMap(dup => 
        dup.records.map(record => record.voter_id)
      )
    );

    const voterRecords: VoterRecord[] = [];
    
    data.uploadData.pages.forEach(page => {
      page.voters.forEach(voter => {
        const isDuplicate = duplicateVoterIds.has(voter.voter_id);
        const duplicateInfo = data.analysisData.duplicates.find(dup => dup.voter_id === voter.voter_id);
        
        voterRecords.push({
          serial_number: voter.serial_number,
          voter_id: voter.voter_id,
          name: voter.name,
          father_name: voter.father_name,
          age: voter.age,
          gender: voter.gender,
          house_number: voter.house_number,
          photo_status: voter.photo_status,
          page_number: page.page_info.page_number,
          image_file: page.page_info.image_file,
          processed_at: page.page_info.processed_at,
          duplicate_status: isDuplicate ? 'Yes' : 'No',
          duplicate_count: duplicateInfo?.count || 1,
          risk_level: isDuplicate ? 'High' : 'Low'
        });
      });
    });

    return arrayToCsv(voterRecords);
  };

  // Generate duplicates only CSV
  const generateDuplicatesCsv = (data: ProcessedData): string => {
    const duplicateRecords: DuplicateRecord[] = data.analysisData.duplicates.map(duplicate => {
      const firstRecord = duplicate.records[0];
      const pagesFound = [...new Set(duplicate.records.map(r => r.page_info.page_number))].join('; ');
      
      return {
        voter_id: duplicate.voter_id,
        duplicate_count: duplicate.count,
        name: firstRecord.name,
        father_name: firstRecord.father_name,
        age: firstRecord.age,
        gender: firstRecord.gender,
        house_number: firstRecord.house_number,
        pages_found: pagesFound
      };
    });

    return arrayToCsv(duplicateRecords);
  };

  // Generate executive summary CSV
  const generateSummaryCsv = (data: ProcessedData): string => {
    const summaryRecords: SummaryRecord[] = [
      {
        metric: 'Total Voters',
        value: data.executiveSummary.total_voters.toString(),
      },
      {
        metric: 'Overall Integrity Score',
        value: data.executiveSummary.overall_integrity_score.toFixed(2),
        percentage: `${data.executiveSummary.overall_integrity_score.toFixed(2)}%`
      },
      {
        metric: 'High Risk Voters',
        value: data.executiveSummary.voters_flagged_high_risk.count.toString(),
        percentage: `${data.executiveSummary.voters_flagged_high_risk.percentage.toFixed(2)}%`
      },
      {
        metric: 'Medium Risk Voters',
        value: data.executiveSummary.voters_flagged_medium_risk.count.toString(),
        percentage: `${data.executiveSummary.voters_flagged_medium_risk.percentage.toFixed(2)}%`
      },
      {
        metric: 'Clean Records',
        value: (data.executiveSummary.total_voters - 
               data.executiveSummary.voters_flagged_high_risk.count - 
               data.executiveSummary.voters_flagged_medium_risk.count).toString(),
        percentage: `${(100 - data.executiveSummary.voters_flagged_high_risk.percentage - 
                     data.executiveSummary.voters_flagged_medium_risk.percentage).toFixed(2)}%`
      }
    ];

    return arrayToCsv(summaryRecords);
  };

  // Main export function
  const exportToCsv = (data: ProcessedData, options: CsvExportOptions = {}) => {
    const {
      filename = 'electoral_analysis',
      includeMetadata = true,
      includeDuplicates = true,
      includeAllVoters = true,
      includeAnalysisSummary = true
    } = options;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    
    try {
      if (includeAllVoters) {
        const allVotersCsv = generateAllVotersCsv(data);
        downloadCsv(allVotersCsv, `${filename}_all_voters_${timestamp}.csv`);
      }

      if (includeDuplicates && data.analysisData.duplicates.length > 0) {
        const duplicatesCsv = generateDuplicatesCsv(data);
        downloadCsv(duplicatesCsv, `${filename}_duplicates_${timestamp}.csv`);
      }

      if (includeMetadata) {
        const metadataCsv = generateMetadataCsv(data);
        downloadCsv(metadataCsv, `${filename}_metadata_${timestamp}.csv`);
      }

      if (includeAnalysisSummary) {
        const summaryCsv = generateSummaryCsv(data);
        downloadCsv(summaryCsv, `${filename}_summary_${timestamp}.csv`);
      }

      return {
        success: true,
        message: 'CSV files generated successfully'
      };
    } catch (error) {
      console.error('CSV export error:', error);
      return {
        success: false,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  // Export specific sections
  const exportAllVoters = (data: ProcessedData, filename?: string) => {
    return exportToCsv(data, {
      filename: filename || 'all_voters',
      includeAllVoters: true,
      includeDuplicates: false,
      includeMetadata: false,
      includeAnalysisSummary: false
    });
  };

  const exportDuplicatesOnly = (data: ProcessedData, filename?: string) => {
    return exportToCsv(data, {
      filename: filename || 'duplicates_only',
      includeAllVoters: false,
      includeDuplicates: true,
      includeMetadata: false,
      includeAnalysisSummary: false
    });
  };

  const exportSummaryOnly = (data: ProcessedData, filename?: string) => {
    return exportToCsv(data, {
      filename: filename || 'analysis_summary',
      includeAllVoters: false,
      includeDuplicates: false,
      includeMetadata: true,
      includeAnalysisSummary: true
    });
  };

  // Get export statistics
  const getExportStats = (data: ProcessedData) => {
    const totalVoters = data.executiveSummary.total_voters;
    const duplicates = data.analysisData.duplicates.length;
    const duplicateRecords = data.analysisData.duplicates.reduce((sum, dup) => sum + dup.count, 0);
    
    return {
      totalVoters,
      duplicateGroups: duplicates,
      duplicateRecords,
      cleanRecords: totalVoters - duplicateRecords,
      pages: data.uploadData.metadata.total_pages
    };
  };

  return {
    exportToCsv,
    exportAllVoters,
    exportDuplicatesOnly,
    exportSummaryOnly,
    getExportStats,
    generateMetadataCsv,
    generateAllVotersCsv,
    generateDuplicatesCsv,
    generateSummaryCsv
  };
}