
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionTileProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  delay?: number;
}

const ActionTile: React.FC<ActionTileProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  delay = 0
}) => {
  return (
    <Card 
      className="hover-lift glass overflow-hidden animate-slideInRight"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-1/3 rounded-full bg-primary/10 animate-pulse" />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full transition-standard"
          onClick={onClick}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionTile;
