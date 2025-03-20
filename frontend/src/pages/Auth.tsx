
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 animate-slideDown">
          <span className="text-gradient">seeknconnect</span>
        </h1>
        <p className="text-muted-foreground animate-slideDown" style={{ animationDelay: "100ms" }}>
          Where talent meets opportunity
        </p>
      </div>
      
      <AuthForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground max-w-md animate-fadeIn" style={{ animationDelay: "300ms" }}>
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default Auth;
