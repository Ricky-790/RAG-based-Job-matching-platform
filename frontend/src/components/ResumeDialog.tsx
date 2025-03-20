import React, { useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateResume: () => void;
}

const ResumeDialog: React.FC<ResumeDialogProps> = ({
  open,
  onOpenChange,
  onCreateResume
}) => {
  const [resumeOption, setResumeOption] = useState<"select" | "upload" | "create">("select");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDialogClose = () => {
    setResumeOption("select");
    setResumeFile(null);
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const apiUrl = 'http://localhost:3000/upload-resume';
      
      console.log(`Uploading resume to: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.questions) {
        throw new Error('No questions received from server');
      }
      
      console.log('Questions received:', data.questions);
      
      onOpenChange(false);
      navigate("/answer-questions", { state: { questions: data.questions } });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleDialogClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Management</DialogTitle>
          <DialogDescription>
            {resumeOption === "select" 
              ? "Choose how you want to add your resume" 
              : resumeOption === "upload" 
                ? "Upload an existing resume file" 
                : "Create a new resume from scratch"}
          </DialogDescription>
        </DialogHeader>
        
        {resumeOption === "select" ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-2"
              onClick={() => setResumeOption("upload")}
            >
              <Upload className="h-10 w-10" />
              <span>Upload Resume</span>
              <span className="text-xs text-muted-foreground">Use an existing PDF file</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-2"
              onClick={onCreateResume}
            >
              <FileText className="h-10 w-10" />
              <span>Create Resume</span>
              <span className="text-xs text-muted-foreground">Build from scratch</span>
            </Button>
          </div>
        ) : resumeOption === "upload" ? (
          <form onSubmit={handleResumeUpload}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File</Label>
                <Input 
                  id="resume" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  required 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResumeOption("select")}
              >
                Back
              </Button>
              <Button type="submit" disabled={!resumeFile || isUploading}>
                {isUploading ? "Uploading..." : "Upload Resume"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog;
