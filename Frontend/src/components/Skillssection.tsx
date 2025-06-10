import React from 'react';
import { Code, Database, Globe, Smartphone, Palette, Wrench } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
  color: string;
}

const SkillsSection = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend",
      icon: <Globe className="w-3 h-3" />,
      color: "from-blue-500 to-purple-600",
      skills: [
        { name: "React", level: 90, category: "frontend" },
        { name: "TypeScript", level: 85, category: "frontend" },
        { name: "Tailwind CSS", level: 95, category: "frontend" },
        { name: "Next.js", level: 80, category: "frontend" }
      ]
    },
    {
      title: "Backend",
      icon: <Database className="w-3 h-3" />,
      color: "from-green-500 to-emerald-600",
      skills: [
        { name: "Node.js", level: 85, category: "backend" },
        { name: "Python", level: 80, category: "backend" },
        { name: "PostgreSQL", level: 75, category: "backend" },
        { name: "MongoDB", level: 70, category: "backend" }
      ]
    },
    {
      title: "Mobile",
      icon: <Smartphone className="w-3 h-3" />,
      color: "from-orange-500 to-red-600",
      skills: [
        { name: "React Native", level: 75, category: "mobile" },
        { name: "Flutter", level: 65, category: "mobile" },
        { name: "iOS", level: 60, category: "mobile" },
        { name: "Android", level: 70, category: "mobile" }
      ]
    },
    {
      title: "Tools",
      icon: <Wrench className="w-3 h-3" />,
      color: "from-purple-500 to-pink-600",
      skills: [
        { name: "Git", level: 90, category: "tools" },
        { name: "Docker", level: 75, category: "tools" },
        { name: "AWS", level: 70, category: "tools" },
        { name: "Figma", level: 85, category: "tools" }
      ]
    }
  ];

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">Skills & Expertise</h2>
        <Code className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category, categoryIndex) => (
          <div 
            key={category.title}
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: `${categoryIndex * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-card-foreground">{category.title}</h3>
            </div>
            
            <div className="space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <div 
                  key={skill.name}
                  className="group hover-scale cursor-pointer"
                  style={{ animationDelay: `${(categoryIndex * 100) + (skillIndex * 50)}ms` }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-700 ease-out`}
                      style={{ 
                        width: `${skill.level}%`,
                        animationDelay: `${(categoryIndex * 200) + (skillIndex * 100)}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Also experienced with:</span>
          {['GraphQL', 'Redux', 'Webpack', 'Jest', 'Cypress', 'Kubernetes'].map((tech, index) => (
            <span 
              key={tech}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${800 + (index * 50)}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;