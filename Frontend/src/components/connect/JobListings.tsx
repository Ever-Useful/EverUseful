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
            <h2 className="heading-header font-bold text-white mb-2">
              Open Positions
            </h2>
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto">
              Find your next opportunity and join our growing team of innovators.
            </p>
            
            {/* Commented out Advanced Filter Section since no jobs are listed */}
            {/* 
            <div className="max-w-6xl mx-auto mb-12">
              <div className="bg-black/20 backdrop-blur rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-white" />
                    <h3 className="text-xl font-semibold text-white">Filter Jobs</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => {
                      setSelectedRole("All");
                      setSelectedLocation("All");
                      setSelectedJobType("All");
                      setSelectedWorkTime("All");
                      setSelectedTechnology("All");
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block text-left">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-full bg-white border-0 text-gray-800">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {locations.map(location => (
                          <SelectItem key={location} value={location} className="hover:bg-gray-100">
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block text-left">Work Time</label>
                    <Select value={selectedWorkTime} onValueChange={setSelectedWorkTime}>
                      <SelectTrigger className="w-full bg-white border-0 text-gray-800">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {workTimes.map(time => (
                          <SelectItem key={time} value={time} className="hover:bg-gray-100">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block text-left">Technology</label>
                    <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                      <SelectTrigger className="w-full bg-white border-0 text-gray-800">
                        <SelectValue placeholder="All Technologies" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {technologies.map(tech => (
                          <SelectItem key={tech} value={tech} className="hover:bg-gray-100">
                            {tech}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block text-left">Work Location</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-full bg-white border-0 text-gray-800">
                        <SelectValue placeholder="All Work Locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept} className="hover:bg-gray-100">
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block text-left">Employment Type</label>
                    <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                      <SelectTrigger className="w-full bg-white border-0 text-gray-800">
                        <SelectValue placeholder="All Employment Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {jobTypes.map(type => (
                          <SelectItem key={type} value={type} className="hover:bg-gray-100">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>

          {/* Openings Soon Message */}
          <div className="text-center py-8">
            <div className="bg-white/95 backdrop-blur border-0 shadow-lg rounded-xl p-6 sm:p-8 max-w-xl mx-auto">
              <h3 className="text-2xl font-bold mb-2 text-olive-dark">
                🚀 Openings Soon
              </h3>
              <p className="text-base mb-4 leading-relaxed text-olive">
                We're currently preparing exciting new opportunities for talented individuals like you. 
                Our team is growing and we'll be posting new positions soon!
              </p>
              <p className="text-xs mb-6 text-olive">
                Stay tuned for updates on our latest openings in engineering, design, marketing, and more.
              </p>
              <Button 
                onClick={handleResumeSubmit}
                className="rounded-lg transition-colors duration-300 px-6 py-2.5 bg-mint text-olive hover:bg-mint-dark hover:text-olive-dark"
              >
                Send Us Your Resume
              </Button>
            </div>
          </div>

          {/* Commented out job listings grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#2A311B' }}>
                      {job.title}
                    </h3>
                    <div className="flex items-center mb-2" style={{ color: '#3A4325' }}>
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="inline-block text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#E2F4ED', color: '#3A4325' }}>
                        {job.type}
                      </span>
                      <span className="inline-block text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(58, 67, 37, 0.1)', color: '#3A4325' }}>
                        {job.department}
                      </span>
                    </div>
                  </div>
                  
                 <p className="text-sm mb-6 leading-relaxed" style={{ color: '#3A4325' }}>
                    {job.description}
                  </p>
                  
                  <Button 
                    onClick={() => handleApply(job.title)} 
                    className="w-full rounded-lg transition-colors duration-300"
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
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center text-white/80 mt-12">
              <p className="text-xl">No jobs match your current filters.</p>
              <Button 
                onClick={() => {
                  setSelectedRole("All");
                  setSelectedLocation("All");
                  setSelectedJobType("All");
                  setSelectedWorkTime("All");
                  setSelectedTechnology("All");
                }} 
                className="mt-4"
                style={{ backgroundColor: '#B8E6CC', color: '#3A4325' }}
              >
                Clear Filters
              </Button>
            </div>
          )}
          */}

          {/* Commented out the bottom CTA since we have the main one above
          <div className="text-center mt-12">
            <p className="text-white/80 mb-4">
              Don't see the perfect role? We're always looking for exceptional talent.
            </p>
            <Button 
              variant="outline" 
              className="border-white/40 hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-black"
              onClick={handleResumeSubmit}
            >              Send Us Your Resume
            </Button>
          </div>
          */}
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