import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import BottomNav from "@/components/BottomNav";
import { Loader2, Briefcase, MapPin } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

const JobPostings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchJobPostings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/postings');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Job postings:", data);
        setJobPostings(data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
        toast.error("Failed to load job postings. Please try again later.");
        
        // Set some mock data for development/demo purposes
        setJobPostings([
          {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            description: "Looking for an experienced frontend developer with React skills.",
            skills: ["React", "TypeScript", "Tailwind CSS"]
          },
          {
            id: 2,
            title: "Backend Engineer",
            company: "Data Systems Corp",
            location: "Remote",
            description: "Join our team building scalable backend services.",
            skills: ["Node.js", "Python", "PostgreSQL"]
          },
          {
            id: 3,
            title: "Full Stack Developer",
            company: "Startup Innovation",
            location: "New York, NY",
            description: "Help us build the next generation of web applications.",
            skills: ["React", "Node.js", "MongoDB"]
          }
        ]);
        toast.warning("Using demo data - API endpoint not available");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobPostings();
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <DashboardHeader />
        
        <div className="my-8">
          <h1 className="text-3xl font-bold mb-6">Job Postings</h1>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Loading job postings...</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {jobPostings.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No job postings found</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back later for new opportunities
                  </p>
                </div>
              ) : (
                jobPostings.map((job, index) => (
                  <JobPostingCard key={job.id} job={job} index={index} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

interface JobPostingCardProps {
  job: JobPosting;
  index: number;
}

const JobPostingCard: React.FC<JobPostingCardProps> = ({ job, index }) => {
  return (
    <Card 
      className="hover-lift overflow-hidden animate-slideInRight"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {job.skills.map((skill, i) => (
            <Badge key={i} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Apply Now</Button>
      </CardFooter>
    </Card>
  );
};

export default JobPostings;
