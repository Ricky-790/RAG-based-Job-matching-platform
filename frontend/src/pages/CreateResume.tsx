import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const CreateResume: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    skills: "",
    education: {
      school: "",
      university: "",
      degree: "",
      graduationYear: "",
    },
    experience: "",
    preferredRoles: "",
    selfAssessment: {
      englishProficiency: "",
      leadershipSkills: "",
      managementSkills: "",
      problemSolving: "",
      technicalSkills: "",
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    const [parent, child] = field.split(".");
    
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [child]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/create-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create resume');
      }
      
      const data = await response.json();
      toast.success("Resume created successfully!");
      
      navigate("/answer-questions", { state: { questions: data.questions } });
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error("Failed to create resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
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
          <CardTitle className="text-2xl">Create Your Resume</CardTitle>
          <CardDescription>
            Fill out the information below to create your professional resume
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="assessment">Self-Assessment</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-6">
              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About Me</Label>
                  <Textarea
                    id="about"
                    name="about"
                    placeholder="Write a brief description about yourself"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    placeholder="e.g. React, JavaScript, UI/UX Design, Project Management"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={10}
                  />
                  <p className="text-sm text-muted-foreground">
                    List your skills separated by commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredRoles">Preferred Job Roles</Label>
                  <Textarea
                    id="preferredRoles"
                    name="preferredRoles"
                    placeholder="e.g. Frontend Developer, UI Designer, Product Manager"
                    value={formData.preferredRoles}
                    onChange={handleChange}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    List the job roles you're interested in, separated by commas
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school">High School</Label>
                  <Input
                    id="school"
                    name="education.school"
                    placeholder="Enter your high school name"
                    value={formData.education.school}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                  <Input
                    id="university"
                    name="education.university"
                    placeholder="Enter your university or college name"
                    value={formData.education.university}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree/Certification</Label>
                    <Input
                      id="degree"
                      name="education.degree"
                      placeholder="e.g. Bachelor of Science"
                      value={formData.education.degree}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      name="education.graduationYear"
                      placeholder="e.g. 2023"
                      value={formData.education.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Describe your work experience, including company names, positions, dates, and responsibilities"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={12}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <div className="text-lg font-medium mb-4">How would you rate yourself on these skills?</div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="englishProficiency">English Proficiency</Label>
                    <Select
                      value={formData.selfAssessment.englishProficiency}
                      onValueChange={(value) => handleSelectChange(value, "selfAssessment.englishProficiency")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your proficiency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="leadershipSkills">Leadership Skills</Label>
                    <Select
                      value={formData.selfAssessment.leadershipSkills}
                      onValueChange={(value) => handleSelectChange(value, "selfAssessment.leadershipSkills")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="proficient">Proficient</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="managementSkills">Management Skills</Label>
                    <Select
                      value={formData.selfAssessment.managementSkills}
                      onValueChange={(value) => handleSelectChange(value, "selfAssessment.managementSkills")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="proficient">Proficient</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="problemSolving">Problem-Solving Skills</Label>
                    <Select
                      value={formData.selfAssessment.problemSolving}
                      onValueChange={(value) => handleSelectChange(value, "selfAssessment.problemSolving")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="technicalSkills">Technical Skills</Label>
                    <Select
                      value={formData.selfAssessment.technicalSkills}
                      onValueChange={(value) => handleSelectChange(value, "selfAssessment.technicalSkills")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-between px-6 pb-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Resume"}
              </Button>
            </CardFooter>
          </Tabs>
        </form>
      </Card>
    </div>
  );
};

export default CreateResume;

