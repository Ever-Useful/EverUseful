
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const founder = {
    name: "Koos Tervooren",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
    linkedin: "https://linkedin.com/in/harsh-founder",
    email: "koos@microphonemedia.nl",
    description: "Studied Journalism and History at the University of Groningen. Storytelling is his strength, podcasts are his medium. He leads Microphone Media together with Frank."
  };

  const teamLead = {
    name: "Francis Garlich",
    role: "Team Lead & CTO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    linkedin: "https://linkedin.com/in/alex-rodriguez",
    email: "francis@microphonemedia.nl",
    description: "Podcast editor, studied Communication and Media at Erasmus University. Has an ear for beautiful stories and is interested in a wide range of subjects."
  };

  const techTeam = [
    {
      name: "Dylan de Heer",
      role: "Co-founder & Product Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/dylan-de-heer",
      description: "Full-stack developer passionate about creating user-centered experiences and scalable solutions."
    },
    {
      name: "Thierry Emmery",
      role: "Co-founder & Product Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      linkedin: "https://linkedin.com/in/thierry-emmery",
      description: "Creative developer focused on building intuitive and beautiful user interfaces."
    },
    {
      name: "Sasha Filipchyk",
      role: "Product & Brand Designer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      linkedin: "https://linkedin.com/in/sasha-filipchyk",
      description: "Backend specialist passionate about creating robust and scalable server solutions."
    }
  ];

  const managementTeam = [
    {
      name: "Kaylee O'Brien",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/kaylee-obrien",
      description: "Strategic marketer connecting innovative solutions with the right audiences and driving growth."
    },
    {
      name: "Manmay Kshirsagar",
      role: "Business Development",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/manmay-kshirsagar",
      description: "Business strategist focused on fostering partnerships and growth opportunities."
    }
  ];

  // Combine only tech team and management team for mobile horizontal scroll
  const allMobileMembers = [...techTeam, ...managementTeam];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allMobileMembers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, allMobileMembers.length]);

  return (
    <section className="py-10 min-h-screen font-sans" style={{background: 'linear-gradient(135deg, #181c24 0%, #23283a 100%)'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Founder & Team Lead Section */}
        <div className="mb-12">
          <div className="flex flex-col gap-10 md:gap-8">
            {/* Founder */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10 bg-[#23283a] rounded-2xl shadow-lg p-6 md:p-10">
              {/* Image and role */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-300 shadow-md"
                    style={{ cursor: 'pointer' }}
                  />
                </a>
                <div className="mt-3 flex flex-col items-center">
                  <span className="block text-base font-semibold text-gray-200 tracking-wide">Founder & CEO</span>
                  <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                    <Linkedin size={20} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
              {/* Name and description */}
              <div className="flex-1 flex flex-col items-start justify-center text-left">
                <h4 className="text-3xl md:text-4xl font-bold mb-1 text-white leading-tight tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>{founder.name}</h4>
                <p className="text-gray-300 leading-relaxed max-w-xl text-lg" style={{fontFamily: 'Inter, sans-serif'}}>{founder.description}</p>
              </div>
            </div>
            {/* Team Lead */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10 bg-[#23283a] rounded-2xl shadow-lg p-6 md:p-10">
              {/* Image and role */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <a href={teamLead.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                  <img
                    src={teamLead.avatar}
                    alt={teamLead.name}
                    className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-300 shadow-md"
                    style={{ cursor: 'pointer' }}
                  />
                </a>
                <div className="mt-3 flex flex-col items-center">
                  <span className="block text-base font-semibold text-gray-200 tracking-wide">Team Lead & CTO</span>
                  <a href={teamLead.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                    <Linkedin size={20} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
              {/* Name and description */}
              <div className="flex-1 flex flex-col items-start justify-center text-left">
                <h4 className="text-3xl md:text-4xl font-bold mb-1 text-white leading-tight tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>{teamLead.name}</h4>
                <p className="text-gray-300 leading-relaxed max-w-xl text-lg" style={{fontFamily: 'Inter, sans-serif'}}>{teamLead.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Section */}
        <div className="lg:hidden mb-10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>Our Team</h3>
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-5 pb-3" style={{ minWidth: 'max-content' }}>
              {allMobileMembers.map((member, index) => (
                <div key={index} className="text-center flex-shrink-0 bg-[#23283a] rounded-2xl shadow-md p-4" style={{ width: '180px' }}>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="group block">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 object-cover rounded-full mx-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-300"
                    />
                  </a>
                  <h4 className="text-base font-semibold mt-3 mb-1 text-white tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>{member.name}</h4>
                  <p className="text-gray-400 text-xs mb-2" style={{fontFamily: 'Inter, sans-serif'}}>{member.role}</p>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                    <Linkedin size={16} />
                    <span className="text-xs font-medium">LinkedIn</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Tech Team Section */}
        <div className="hidden lg:block mb-10">
          <div className="flex flex-row items-center gap-8">
            {/* Left side - Heading */}
            <div className="w-1/3 flex flex-col items-start justify-center">
            <h2 className="text-[90px] font-extralight tracking-tight text-white mb-6 leading-[1] font-sans" style={{letterSpacing: '-0.04em'}}>Technical Team</h2>
            </div>
            {/* Right side - Card with Tech Team */}
            <div className="w-2/3">
              <div className="rounded-2xl bg-[#23283a] p-8 shadow-lg flex flex-row justify-between items-center gap-6">
                {techTeam.map((member, index) => (
                  <div key={index} className="text-center flex-1 flex flex-col items-center">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-28 h-28 object-cover rounded-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-300 shadow-md"
                        style={{ cursor: 'pointer' }}
                      />
                    </a>
                    <h4 className="text-lg font-semibold mt-3 mb-1 text-white tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>{member.name}</h4>
                    <p className="text-gray-400 text-sm mb-2" style={{fontFamily: 'Inter, sans-serif'}}>{member.role}</p>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                      <Linkedin size={16} />
                      <span className="text-xs font-medium">LinkedIn</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Management Team Section */}
        <div className="hidden lg:block">
          <div className="flex flex-row items-center gap-8">
            {/* Left side - Heading */}
            <div className="w-1/3 flex flex-col items-start justify-center">
            <h2 className="text-[90px] font-extralight tracking-tight text-white mb-6 leading-[1] font-sans" style={{letterSpacing: '-0.04em'}}>Management Team</h2>
            </div>
            {/* Right side - Card with Management Team */}
            <div className="w-2/5 ml-auto">
              <div className="rounded-2xl bg-[#23283a] p-8 shadow-lg flex flex-row justify-between items-center gap-6">
                {managementTeam.map((member, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center text-center">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-28 h-28 object-cover rounded-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-300 shadow-md"
                        style={{ cursor: 'pointer' }}
                      />
                    </a>
                    <h4 className="text-lg font-semibold mt-3 mb-1 text-white tracking-tight" style={{fontFamily: 'Inter, sans-serif'}}>{member.name}</h4>
                    <p className="text-gray-400 text-sm mb-2" style={{fontFamily: 'Inter, sans-serif'}}>{member.role}</p>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition">
                      <Linkedin size={16} />
                      <span className="text-xs font-medium">LinkedIn</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;