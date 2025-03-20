
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Briefcase, CheckCircle } from "lucide-react";

export interface Candidate {
  id: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[];
  experience: string;
  matchReason: string;
  matchPercentage?: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  onContact: (candidate: Candidate) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onContact }) => {
  return (
    <Card className="border-l-4 border-l-primary animate-fadeIn shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{candidate.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> {candidate.phone}
              {candidate.email && (
                <>
                  <span className="mx-1">•</span>
                  <Mail className="h-3.5 w-3.5" /> {candidate.email}
                </>
              )}
            </CardDescription>
          </div>
          {candidate.matchPercentage && (
            <Badge variant="default" className="text-md px-2.5 py-1">
              {candidate.matchPercentage}% Match
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
              <Briefcase className="h-4 w-4 text-muted-foreground" /> Experience
            </h4>
            <p className="text-sm text-muted-foreground">{candidate.experience}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1.5">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" /> Why They're a Good Match
            </h4>
            <p className="text-sm text-muted-foreground">{candidate.matchReason}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onContact(candidate)} 
          className="w-full mt-2"
        >
          Contact Candidate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
