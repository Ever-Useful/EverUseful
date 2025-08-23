
import { Users, Github, BookOpen } from "lucide-react";

const CommunityLinks = () => {
  const communityLinks = [
    {
      title: "GitHub Organization",
      description: "Contribute to our open source projects",
      icon: Github,
      link: "https://github.com/HARSH6309",
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900"
    },
    {
      title: "Tech Meetups",
      description: "Monthly meetups in major cities worldwide",
      icon: Users,
      link: "https://meetup.com/techforward",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      title: "Tech Blog",
      description: "Latest insights and technical deep-dives",
      icon: BookOpen,
      link: "https://blog.techforward.com",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    }
  ];

  const handleLinkClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-section font-bold text-olive-dark mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-olive max-w-3xl mx-auto">
            Connect with passionate developers, contribute to open source, and grow together in our vibrant tech community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityLinks.map((community, index) => {
            const IconComponent = community.icon;
            return (
              <div
                key={index}
                onClick={() => handleLinkClick(community.link)}
                className="group bg-white border border-mint-light rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${community.color} ${community.hoverColor} p-3 rounded-lg transition-colors duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-olive-dark mb-2 group-hover:text-olive transition-colors duration-300">
                      {community.title}
                    </h3>
                    <p className="text-olive text-sm mb-4 leading-relaxed">
                      {community.description}
                    </p>
                    <div className="flex justify-end">
                      <button className="bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 group-hover:scale-105">
                        Join →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunityLinks;