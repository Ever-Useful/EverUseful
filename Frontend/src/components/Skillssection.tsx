import React, { useState } from 'react';
import { Code, Database, Globe, Smartphone, Palette, Wrench, Plus, X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addActivity } from '@/lib/activities';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface Skill {
  name: string;
  expertise: 'Beginner' | 'Intermediate' | 'Expert';
  category: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<{
    name: string;
    expertise: 'Beginner' | 'Intermediate' | 'Expert';
    category: string;
  }>({ name: '', expertise: 'Beginner', category: '' });
  const [showAddDialog, setShowAddDialog] = useState(false);

  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend",
      icon: <Globe className="w-4 h-4" />,
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Backend",
      icon: <Database className="w-4 h-4" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Mobile",
      icon: <Smartphone className="w-4 h-4" />,
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Tools",
      icon: <Wrench className="w-4 h-4" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Design",
      icon: <Palette className="w-4 h-4" />,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Other",
      icon: <Code className="w-4 h-4" />,
      color: "from-gray-500 to-slate-600",
    }
  ];

  const handleAddSkill = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to add skills');
      return;
    }

    if (newSkill.name && newSkill.category) {
      setSkills([...skills, newSkill]);
      
      // Add activity
      addActivity(
        user.uid,
        'skill',
        `Added new skill: ${newSkill.name} (${newSkill.expertise})`
      );

      setNewSkill({ name: '', expertise: 'Beginner', category: '' });
      setShowAddDialog(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const getExpertiseColor = (expertise: string) => {
    switch (expertise) {
      case 'Expert':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Beginner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getExpertiseIcon = (expertise: string) => {
    switch (expertise) {
      case 'Expert':
        return <Star className="w-3 h-3 fill-green-500 text-green-500" />;
      case 'Intermediate':
        return <Star className="w-3 h-3 fill-blue-500 text-blue-500" />;
      case 'Beginner':
        return <Star className="w-3 h-3 fill-purple-500 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">Skills & Expertise</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill Name</label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g., React, Python, UI/UX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category.title} value={category.title}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expertise Level</label>
                <Select
                  value={newSkill.expertise}
                  onValueChange={(value: 'Beginner' | 'Intermediate' | 'Expert') => 
                    setNewSkill({ ...newSkill, expertise: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSkill}>
                Add Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category) => {
          const categorySkills = skills.filter(skill => skill.category === category.title);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category.title} className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                  {category.icon}
                </div>
                <h3 className="font-medium text-card-foreground">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`${getExpertiseColor(skill.expertise)} flex items-center gap-1 group`}
                  >
                    {getExpertiseIcon(skill.expertise)}
                    <span>{skill.name}</span>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No skills added yet. Click "Add Skill" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;