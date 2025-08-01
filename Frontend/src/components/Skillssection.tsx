import React, { useState, useEffect } from 'react';
import { Code, Database, Globe, Smartphone, Palette, Wrench, Plus, X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import { userService } from "@/services/userService";

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
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated first
        const user = auth.currentUser;
        if (!user) {
          console.log('User not authenticated, skipping skills fetch');
          setSkills([]);
          return;
        }
        
        // Load from backend using token-based authentication
        try {
          const backendSkills = await userService.getUserSkills();
          if (backendSkills && Array.isArray(backendSkills)) {
            setSkills(backendSkills);
          } else {
            setSkills([]);
          }
        } catch (backendError) {
          console.error('Failed to load backend skills:', backendError);
          
          // Fallback to Firestore if backend fails
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const firestoreSkills = userData.skills || [];
              setSkills(firestoreSkills);
            } else {
              setSkills([]);
            }
          } catch (firestoreError) {
            console.error('Failed to load Firestore skills:', firestoreError);
            setSkills([]);
          }
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
        toast.error('Failed to load skills');
        setSkills([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  const handleAddSkill = async (skillName: string) => {
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to add skills');
      return;
    }
    
    try {
      // Add to backend using token-based authentication
      try {
        await userService.addSkill({ name: skillName });
        
        // Update local state
        setSkills(prev => [...prev, skillName]);
        toast.success('Skill added successfully!');
      } catch (backendError) {
        console.error('Failed to add skill to backend:', backendError);
        
        // Fallback to Firestore if backend fails
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let currentSkills: string[] = [];
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          currentSkills = userData.skills || [];
        }
        
        // Add skill if not already present
        if (!currentSkills.includes(skillName)) {
          const updatedSkills = [...currentSkills, skillName];
          await updateDoc(doc(db, "users", user.uid), {
            skills: updatedSkills,
            updatedAt: new Date().toISOString()
          });
          
          setSkills(updatedSkills);
          toast.success('Skill added successfully!');
        } else {
          toast.error('Skill already exists');
        }
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to remove skills');
      return;
    }
    
    try {
      // Remove from backend using token-based authentication
      try {
        await userService.deleteSkill(skillName);
        
        // Update local state
        setSkills(prev => prev.filter(skill => skill !== skillName));
        toast.success('Skill removed successfully');
      } catch (backendError) {
        console.error('Failed to remove skill from backend:', backendError);
        
        // Fallback to Firestore if backend fails
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentSkills = userData.skills || [];
          const updatedSkills = currentSkills.filter(skill => skill !== skillName);
          
          await updateDoc(doc(db, "users", user.uid), {
            skills: updatedSkills,
            updatedAt: new Date().toISOString()
          });
          
          setSkills(updatedSkills);
          toast.success('Skill removed successfully');
        }
      }
    } catch (error) {
      console.error('Failed to remove skill:', error);
      toast.error('Failed to remove skill');
    }
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

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border p-6 space-y-6 relative" style={{ minHeight: '180px', height: '300px' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">Skills & Expertise</h2>
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6 relative" style={{ minHeight: '180px', height: '300px' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">Skills & Expertise</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAddInput((v) => !v)}>
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>
      {showAddInput && (
        <div className="flex gap-2 items-center mt-3 absolute left-0 right-0 px-6" style={{ top: 56, zIndex: 10 }}>
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Python, UI/UX"
            className="flex-1 min-w-[200px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill(newSkill);
                setShowAddInput(false);
                setNewSkill('');
              }
            }}
          />
          <Button style={{ minWidth: '70px' }} className="ml-auto" onClick={() => { handleAddSkill(newSkill); setShowAddInput(false); setNewSkill(''); }}>
            Add
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 && (
            <div className="text-gray-400 text-center w-full">No skills added yet. Click "Add Skill" to get started!</div>
          )}
          {skills.map((skill, idx) => (
            <span key={idx} className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium">
              {skill}
              <button className="ml-2 text-gray-500 hover:text-red-500" onClick={() => handleRemoveSkill(skill)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;