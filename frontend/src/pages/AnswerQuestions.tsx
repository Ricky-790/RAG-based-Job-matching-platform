import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import QuestionCard from "@/components/QuestionCard";

interface LocationState {
  questions: string[];
}

const AnswerQuestions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Accept the questions as strings array and filter out blank ones
  const state = location.state as LocationState;
  const rawQuestions = state?.questions || [];
  const questions = rawQuestions.filter(q => q && q.trim() !== "");
  
  // Debug the questions received
  useEffect(() => {
    console.log("Questions received in AnswerQuestions:", questions);
  }, [questions]);
  
  // Initialize answers with indexes as keys
  const [answers, setAnswers] = useState<Record<string, string>>(
    questions.reduce((acc, _, index) => ({ ...acc, [index]: "" }), {})
  );

  const handleAnswerChange = (index: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: answer,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // All questions must be answered
      const unansweredQuestions = Object.values(answers).filter(answer => !answer?.trim()).length;
      
      if (unansweredQuestions > 0) {
        toast.error("Please answer all questions before submitting");
        setIsSubmitting(false);
        return;
      }
      
      // Send answers to new endpoint for evaluation
      const response = await fetch('http://localhost:3000/check-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate answers');
      }
      
      // Get both evaluation and advice from the response
      const data = await response.json();
      console.log("Evaluation response:", data);
      
      // Navigate to the evaluation page with both evaluation and advice data
      navigate("/evaluation", { 
        state: { 
          evaluationText: data.evaluation,
          adviceText: data.advice 
        } 
      });
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // If no questions are provided, show an error message
  if (!questions || questions.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">No Questions Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p>There are no questions to answer at this time.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleBack}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 pb-20">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Answer These Questions</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                answer={answers[index] || ""}
                onChange={(answer) => handleAnswerChange(String(index), answer)}
              />
            ))}
          </CardContent>
          
          <CardFooter className="flex justify-end px-6 pb-6">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit All Answers"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AnswerQuestions;
