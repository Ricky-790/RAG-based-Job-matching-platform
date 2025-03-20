
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full mb-8 animate-slideDown">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Hello <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">
              {user.role === "jobseeker" ? "Job Seeker" : "Recruiter"}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="transition-standard hover:bg-destructive hover:text-destructive-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
