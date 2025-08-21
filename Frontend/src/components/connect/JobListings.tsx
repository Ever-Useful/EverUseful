import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApplicationForm from "./ApplicationForm";

const JobListings = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResumeFormOpen, setIsResumeFormOpen] = useState(false);
  
  // Filter states - commented out since no jobs are listed
  // const [selectedRole, setSelectedRole] = useState("All");
  // const [selectedLocation, setSelectedLocation] = useState("All");
  // const [selectedJobType, setSelectedJobType] = useState("All");
  // const [selectedWorkTime, setSelectedWorkTime] = useState("All");
  // const [selectedTechnology, setSelectedTechnology] = useState("All");

  // Commented out all job listings
  /*
  const jobs = [
    {
      title: "Senior Frontend Developer",
      location: "Remote / San Francisco",
      type: "Full-time",
      department: "Engineering",
      level: "Senior",
      description: "Build beautiful, responsive user interfaces using React and modern web technologies."
    }, {
      title: "Backend Engineer",
      location: "Remote / New York",
      type: "Full-time",
      department: "Engineering",
      level: "Mid-level",
      description: "Design and develop scalable backend systems and APIs using Node.js and cloud technologies."
    }, {
      title: "Product Designer",
      location: "Remote / London",
      type: "Full-time",
      department: "Design",
      level: "Mid-level",
      description: "Create intuitive user experiences and drive product design from concept to launch."
    }, {
      title: "DevOps Engineer",
      location: "Remote / Berlin",
      type: "Full-time",
      department: "Engineering",
      level: "Senior",
      description: "Automate infrastructure, improve deployment processes, and ensure system reliability."
    }, {
      title: "Data Scientist",
      location: "Remote / Toronto",
      type: "Part-time",
      department: "Data",
      level: "Mid-level",
      description: "Extract insights from complex datasets and build machine learning models."
    }, {
      title: "Marketing Manager",
      location: "On-site / Austin",
      type: "Contract",
      department: "Marketing",
      level: "Senior",
      description: "Drive growth through strategic marketing campaigns and brand development."
    }
  ];
  */

  // Commented out filter options since no jobs are listed
  /*
  // Get unique values for filter options
  const departments = ["All", ...new Set(jobs.map(job => job.department))];
  const locations = ["All", ...new Set(jobs.map(job => job.location.split(" / ")[0]))];
  const jobTypes = ["All", ...new Set(jobs.map(job => job.type))];
  const workTimes = ["All", "Full-time", "Part-time", "Contract"];
  const technologies = ["All", "React", "Node.js", "Python", "JavaScript", "TypeScript"];

  const filteredJobs = jobs.filter(job => {
    const roleMatch = selectedRole === "All" || job.department === selectedRole;
    const locationMatch = selectedLocation === "All" || job.location.includes(selectedLocation);
    const typeMatch = selectedJobType === "All" || job.type === selectedJobType;
    const workTimeMatch = selectedWorkTime === "All" || job.type === selectedWorkTime;
    return roleMatch && locationMatch && typeMatch && workTimeMatch;
  });
  */

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsFormOpen(true);
  };
  
  const handleResumeSubmit = () => {
    setIsResumeFormOpen(true);
  };

  return (
    <>
      <section id="job-listings" className="py-8 sm:py-10 bg-olive-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="heading-header font-bold text-black mb-2">
              Open Positions
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-4 md:mb-6 px-4">

              Find your next opportunity and join our growing team of innovators.
            </p>
          </div>

          {/* Openings Soon Message */}

          <div className="text-center py-6 md:py-8 lg:py-10">
            <div className="bg-white/95 backdrop-blur border-0 shadow-lg rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 max-w-lg md:max-w-2xl mx-auto mx-4">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4" style={{ color: '#2A311B' }}>
                🚀 Openings Soon
              </h3>
              <p className="text-base md:text-lg mb-3 md:mb-4 leading-relaxed" style={{ color: '#3A4325' }}>
                We're currently preparing exciting new opportunities for talented individuals like you. 
                Our team is growing and we'll be posting new positions soon!
              </p>
              <p className="text-sm mb-5 md:mb-6" style={{ color: '#3A4325' }}>

                Stay tuned for updates on our latest openings in engineering, design, marketing, and more.
              </p>
              <Button 
                onClick={handleResumeSubmit}

                className="rounded-lg transition-colors duration-300 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
                style={{ backgroundColor: '#B8E6CC', color: '#3A4325' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#95D5B2';
                  e.currentTarget.style.color = '#2A311B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8E6CC';
                  e.currentTarget.style.color = '#3A4325';
                }}

              >
                Send Us Your Resume
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ApplicationForm 
        jobTitle={selectedJob || ""} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
      
      <ApplicationForm 
        jobTitle="General Application" 
        isOpen={isResumeFormOpen} 
        onClose={() => setIsResumeFormOpen(false)} 
      />
    </>
  );    
};

export default JobListings;
