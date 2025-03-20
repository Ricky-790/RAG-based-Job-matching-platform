import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import ActionTile from "@/components/ActionTile";
import BottomNav from "@/components/BottomNav";
import { Loader2, FileUp, Briefcase } from "lucide-react";
import { toast } from "sonner";
import JobPostDialog from "@/components/JobPostDialog";
import ResumeDialog from "@/components/ResumeDialog";
import JobMatchesDisplay, { JobResult } from "@/components/JobMatchesDisplay";
import { 
  Card, 
  CardHeader, 
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobList from "@/components/JobList";

interface JobPostResponse {
  name: string;
  reason: string;
  skills: string[];
}

// Define the Candidate interface that was missing
interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience: string;
  match: number;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jobPostResponse, setJobPostResponse] = useState<JobPostResponse | null>(null);
  const [jobMatches, setJobMatches] = useState<JobResult[]>([]);
  const [isSearchingMatches, setIsSearchingMatches] = useState(false);
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleCreateResume = () => {
    setResumeDialogOpen(false);
    navigate("/create-resume");
  };

  const handleJobPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const jobData = {
      title: formData.get('title'),
      company: formData.get('company'),
      location: formData.get('location'),
      description: formData.get('description'),
      skills: formData.get('skills')?.toString().split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
    };
    
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.description || !jobData.skills?.length) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setJobDialogOpen(false);
    setJobMatches([]);
    setJobPostResponse(null);
    
    setIsPostingJob(true);
    
    try {
      // First, post the job
      const apiUrl = 'http://localhost:3000/post-job';
      
      console.log(`Posting job to: ${apiUrl}`, jobData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Job post response:', responseData);
      
      setJobPostResponse(responseData);
      toast.success("Job posted successfully!");
      
      // Now, search for matching resumes
      setIsSearchingMatches(true);
      
      const matchJobsUrl = 'http://localhost:3000/match-jobs';
      const matchJobsData = {
        title: jobData.title,
        description: jobData.description,
        skills: jobData.skills
      };
      
      console.log(`Searching for matches at: ${matchJobsUrl}`, matchJobsData);
      
      const matchesResponse = await fetch(matchJobsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchJobsData),
      });
      
      if (!matchesResponse.ok) {
        throw new Error(`Match-jobs API responded with status: ${matchesResponse.status}`);
      }
      
      const matchesData = await matchesResponse.json();
      console.log('Matches data:', matchesData);
      
      if (matchesData.title && matchesData.files) {
        setJobMatches([{
          title: matchesData.title,
          resumes: matchesData.files
        }]);
      }
      
    } catch (error) {
      console.error("Error in job posting workflow:", error);
      toast.error("Failed to complete job posting process. Please try again.");
    } finally {
      setIsPostingJob(false);
      setIsSearchingMatches(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {user?.role === "jobseeker" ? (
            <ActionTile
              title="Upload Resume"
              description="Share your experience and skills with employers"
              icon={FileUp}
              onClick={() => setResumeDialogOpen(true)}
            />
          ) : (
            <ActionTile
              title="Post a Job"
              description="Find the perfect candidate for your open position"
              icon={Briefcase}
              onClick={() => setJobDialogOpen(true)}
              delay={100}
            />
          )}
          
          <ActionTile
            title="Post a Job"
            description="Create new job opportunities"
            icon={Briefcase}
            onClick={() => setJobDialogOpen(true)}
            delay={200}
          />
        </div>
        
        {isPostingJob && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Processing your job posting...</h3>
              <p className="text-muted-foreground mt-2">
                This will just take a moment
              </p>
            </div>
          </div>
        )}
        
        {jobPostResponse && !isPostingJob && (
          <div className="mb-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Job Post Results</h2>
            <Card className="border-l-4 border-l-primary shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{jobPostResponse.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1.5">Reason</h4>
                  <p className="text-muted-foreground">{jobPostResponse.reason}</p>
                </div>
                
                {jobPostResponse.skills && jobPostResponse.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1.5">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {jobPostResponse.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {isSearchingMatches && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Searching for matching resumes...</h3>
              <p className="text-muted-foreground mt-2">
                Finding candidates that match your job requirements
              </p>
            </div>
          </div>
        )}
        
        {jobMatches.length > 0 && !isSearchingMatches && !isPostingJob && (
          <JobMatchesDisplay jobResults={jobMatches} />
        )}
        
        <JobList />
      </div>
      
      <ResumeDialog 
        open={resumeDialogOpen} 
        onOpenChange={setResumeDialogOpen}
        onCreateResume={handleCreateResume}
      />
      
      <JobPostDialog 
        open={jobDialogOpen} 
        onOpenChange={setJobDialogOpen}
        onSubmit={handleJobPost}
        isLoading={isPostingJob}
      />
      
      <BottomNav />
    </div>
  );
};

export default Dashboard;
