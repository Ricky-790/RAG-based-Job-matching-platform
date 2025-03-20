import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export interface JobResult {
  title: string;
  resumes: string[];
}

interface JobMatchesDisplayProps {
  jobResults: JobResult[];
}

const JobMatchesDisplay: React.FC<JobMatchesDisplayProps> = ({ jobResults }) => {
  const downloadResume = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3000/get-resume/${filename}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download resume: ${response.statusText}`);
      }
      
      // Get the response as blob
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Resume ${filename} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume");
    }
  };
  
  if (!jobResults || jobResults.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Job Matches</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No matching resumes found for this job.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mb-12 animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4">Matching Resumes</h2>
      
      {jobResults.map((result, index) => (
        <Card key={index} className="mb-6 border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{result.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <h3 className="text-sm font-medium mb-3">Available Resumes</h3>
            
            {result.resumes && result.resumes.length > 0 ? (
              <div className="space-y-2">
                {result.resumes.map((resume, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-md hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span>{resume}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadResume(resume)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No resumes available.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobMatchesDisplay;
