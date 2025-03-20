import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  question: string;
  answer: string;
  onChange: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  answer, 
  onChange 
}) => {
  // Generate a safe ID based on the question text
  const questionId = `answer-${question ? question.replace(/\s+/g, '-').toLowerCase().substring(0, 20) : 'question'}`;
  
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={questionId} className="sr-only">
            Answer
          </Label>
          <Textarea
            id={questionId}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
