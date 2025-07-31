
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Aidan O'Brien",
      role: "Co-Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      linkedin: "https://linkedin.com/in/aidan-obrien",
      intro: "Passionate about bridging innovation gaps and empowering student entrepreneurs."
    },
    {
      name: "Tyson Hartman",
      role: "Co-Founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/tyson-hartman",
      intro: "Dedicated to creating sustainable innovation ecosystems for future leaders."
    },
    {
      name: "Jake Sommer",
      role: "CTO/Partner",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      linkedin: "https://linkedin.com/in/jake-sommer",
      intro: "Technology enthusiast focused on building scalable platforms for innovation."
    },
    {
      name: "Ryan Ritchie",
      role: "Developer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      linkedin: "https://linkedin.com/in/ryan-ritchie",
      intro: "Full-stack developer passionate about creating user-centered experiences."
    },
    {
      name: "Kaylee O'Brien",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b6302a2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      linkedin: "https://linkedin.com/in/kaylee-obrien",
      intro: "Strategic marketer connecting innovative solutions with the right audiences."
    },
    {
      name: "Manmay Kshirsagar",
      role: "Business Development",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/manmay-kshirsagar",
      intro: "Business strategist focused on fostering partnerships and growth opportunities."
    },
    {
      name: "Sarah Chen",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      linkedin: "https://linkedin.com/in/sarah-chen",
      intro: "Product strategist focused on user experience and innovation."
    },
    {
      name: "Alex Thompson",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      linkedin: "https://linkedin.com/in/alex-thompson",
      intro: "Creative designer passionate about crafting intuitive user experiences."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">Meet Our Team</h2>
          <p className="text-gray-600 text-lg">The passionate individuals driving innovation forward</p>
        </div>
        {/* Mobile: Small circles in horizontal scroll, Desktop: Grid */}
        <div className="block md:hidden overflow-x-auto">
          <div className="flex space-x-4 pb-4 min-w-max">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex-shrink-0 group">
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="text-center mt-2 w-20">
                  <h3 className="font-bold text-xs text-gray-800 leading-tight">{member.name}</h3>
                  <p className="text-gray-600 text-xs leading-tight">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Original card layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
           {teamMembers.map((member, index) => (
            <div key={index} className="group [perspective:1000px]">
              <div className="relative w-80 h-80 [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                {/* Front of card */}
                <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{member.name}</h3>
                      <p className="text-gray-600 text-sm">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Back of card */}
                <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center text-white">
                    <Linkedin className="w-12 h-12 mb-4 text-white" />
                    <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                    <p className="text-blue-100 text-sm mb-4">{member.role}</p>
                    <p className="text-white text-sm mb-6 leading-relaxed">{member.intro}</p>
                    <button
                      onClick={() => window.open(member.linkedin, '_blank')}
                      className="bg-white text-blue-600 px-2 py-1 text-xs rounded font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Connect on LinkedIn
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;