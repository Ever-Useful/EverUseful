
import { Card } from '@/components/ui/card';

interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'hover:text-pink-600',
      twitter: 'hover:text-blue-500',
      linkedin: 'hover:text-blue-700',
      youtube: 'hover:text-red-600',
      facebook: 'hover:text-blue-600',
      email: 'hover:text-slate-700',
    };
    return colors[platform as keyof typeof colors] || 'hover:text-slate-700';
  };

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Connect</h2>
      <div className="grid grid-cols-3 gap-3">
        {socialLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-50 ${getPlatformColor(link.platform)}`}
            >
              <IconComponent className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-all duration-200" />
              <span className="text-xs text-slate-600 mt-1 capitalize font-medium">{link.platform}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
};

export default SocialLinks;
