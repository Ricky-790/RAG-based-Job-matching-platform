import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock jobs data
const mockJobs = [
  
];

const JobList: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;
  
  return (
    <div className="space-y-12 animate-fadeIn">      
      {/* Recent Jobs Section - shown to everyone */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          Recent Jobs
        </h2>
        
        {mockJobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>
    </div>
  );
};

interface JobCardProps {
  job: typeof mockJobs[0];
  index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  return (
    <Card 
      className="hover-lift overflow-hidden animate-slideInRight"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {job.postedDate}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">12 applications</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 transition-standard">
          View Details <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobList;
