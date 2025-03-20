import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateResume from "./pages/CreateResume";
import AnswerQuestions from "./pages/AnswerQuestions";
import Evaluation from "./pages/Evaluation";
import NotFound from "./pages/NotFound";
import JobPostings from "./pages/JobPostings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-resume" element={<CreateResume />} />
            <Route path="/answer-questions" element={<AnswerQuestions />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/applications" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/job-postings" element={<JobPostings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
