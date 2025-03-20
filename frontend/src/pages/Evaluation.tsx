import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface LocationState {
  evaluationText: string;
  adviceText: string;
}

const Evaluation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get both evaluation and advice text from the location state
  const state = location.state as LocationState;
  const evaluationText = state?.evaluationText || "No evaluation available.";
  const adviceText = state?.adviceText || "No advice available.";
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="my-8">
        <CardHeader>
          <CardTitle className="text-2xl">Evaluation Results</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-lg">{evaluationText}</p>
          </div>
          
          <div className="prose max-w-none mt-8">
            <h3 className="text-xl font-semibold mb-4">You can consider</h3>
            <p className="whitespace-pre-line text-lg">{adviceText}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-4">
          <Button 
            onClick={handleBack}
            className="px-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Evaluation;
