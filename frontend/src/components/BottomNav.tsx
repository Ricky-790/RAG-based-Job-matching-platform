import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-primary text-primary-foreground shadow-lg py-2 px-4 flex justify-around items-center">
        <button 
          onClick={() => navigate("/job-postings")} 
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-standard",
            isActive("/job-postings") ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
          )}
        >
          <Briefcase className="h-5 w-5" />
          <span className="text-xs mt-1">Jobs</span>
        </button>
        
        <button 
          onClick={() => navigate("/dashboard")} 
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-standard",
            isActive("/dashboard") ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          onClick={() => navigate("/profile")} 
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-standard",
            isActive("/profile") ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
