
import { Button } from "@/components/ui/button";

export const TeamSection = () => {
  const teamMembers = [
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      name: "Alex Johnson",
      role: "Sustainability Director"
    },
    {
      image: "https://images.unsplash.com/photo-1494790108755-2616b292e92e?w=300&h=300&fit=crop&crop=face",
      name: "Maria Rodriguez",
      role: "Project Lead"
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      name: "David Chen",
      role: "Green Tech Specialist"
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      name: "Sarah Wilson",
      role: "Environmental Analyst"
    }
  ];

  return (
    <section className="py-20 bg-teal-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover rounded-2xl mb-4"
                />
              </div>
            ))}
          </div>
          
          <div className="text-white space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
              TEAM
            </p>
            <h2 className="text-5xl font-bold leading-tight">
              Meet Our Sustainable Innovation Team
            </h2>
            <p className="text-lg opacity-90">
              Our diverse team of sustainability experts, project managers, and environmental specialists work together to deliver impactful solutions for a greener future.
            </p>
            
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-full">
              Our Team
            </Button>
            
            {/* Navigation arrows */}
            <div className="flex space-x-4 pt-8">
              <button className="bg-black bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="bg-black bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
