import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X } from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

interface EditProfileSidebarProps {
  onClose: () => void;
  initialSection?: string;
}

const steps = [
  { name: 'Basic Details', completed: true },
  { name: 'About', completed: true },
  { name: 'Skills', completed: true },
  { name: 'Education', completed: true },
  { name: 'Work Experience', completed: false },
  { name: 'Accomplishments & Initiatives', completed: false },
  { name: 'Personal Details', completed: false },
  { name: 'Social Links', completed: true },
];

const userTypes = [
    { name: 'College Students' },
    { name: 'Professional' },
    { name: 'School Student' },
    { name: 'Fresher' },
];

const domains = ['Management', 'Engineering', 'Arts & Science', 'Medicine', 'Law', 'Others'];


export const EditProfile: React.FC<EditProfileSidebarProps> = ({ onClose, initialSection = 'Basic Details' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    college: '',
    degree: '',
    course: '',
    location: '',
    year: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await userService.getUserProfile();
          setProfileData({
            firstName: userProfile.auth.firstName || '',
            lastName: userProfile.auth.lastName || '',
            bio: userProfile.profile.bio || '',
            college: userProfile.studentData?.college || '',
            degree: userProfile.studentData?.degree || '',
            course: userProfile.studentData?.course || '',
            location: userProfile.profile.location || '',
            year: userProfile.studentData?.year || '',
          });
        } catch (error) {
          toast.error("Failed to fetch profile data.");
          console.error(error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    toast.loading('Saving...');
    try {
      if (activeSection === 'Basic Details') {
        await userService.updateAuthInfo({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        });
      } else if (activeSection === 'About') {
        await userService.updateProfile({ bio: profileData.bio });
      } else if (activeSection === 'Education') {
        await userService.updateStudentData({
          college: profileData.college,
          degree: profileData.degree,
          course: profileData.course,
          year: profileData.year,
        });
        await userService.updateProfile({
          location: profileData.location,
        });
      }
      toast.dismiss();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to update profile.');
      console.error('Failed to save profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const suggestedSkills = ['Securities', 'Deep Learning', 'Mathematical Proficiency', 'Tone of Voice', 'CRM Proficiency', 'E-Discovery', 'Embedded Programming', 'GDPR Compliance', 'Medical Malpractice', 'Remote Access'];
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  // Load skills from database
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const user = auth.currentUser;
        if (!user) {
          setSkills([]);
          return;
        }
        
        const backendSkills = await userService.getUserSkills();
        if (backendSkills && Array.isArray(backendSkills)) {
          setSkills(backendSkills);
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
        setSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    
    fetchSkills();
  }, []);

  const handleAddSkill = async (skillToAdd: string) => {
    const trimmedSkill = skillToAdd.trim();
    if (!trimmedSkill) {
      toast.error('Please enter a skill name');
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      toast.error('Skill already exists');
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to add skills');
      return;
    }
    
    try {
      await userService.addSkill({ name: trimmedSkill });
      setSkills(prev => [...prev, trimmedSkill]);
      toast.success('Skill added successfully!');
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to remove skills');
      return;
    }
    
    try {
      await userService.deleteSkill(skillToRemove);
      setSkills(prev => prev.filter(skill => skill !== skillToRemove));
      toast.success('Skill removed successfully');
    } catch (error) {
      console.error('Failed to remove skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput) {
      e.preventDefault();
      handleAddSkill(skillInput);
      setSkillInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-semibold text-lg">Edit Profile</h2>
            </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-1/4 bg-slate-50 border-r overflow-y-auto p-6 space-y-6">
                <nav>
                    <ul>
                        {steps.map((step, index) => (
                            <li key={index}>
                                <button
                                  onClick={() => setActiveSection(step.name)}
                                  className={`w-full flex items-center p-3 my-1 rounded-md text-sm font-medium transition-colors text-left ${activeSection === step.name ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-slate-200 text-slate-700'}`}
                                >
                                    <span>{step.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
              {activeSection === 'Basic Details' && (
                <>
                  <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Basic Details</h3>
                  </div>

                  <div className="space-y-8">
                      <div className="flex items-center gap-8">
                          <InitialsAvatar firstName={profileData.firstName} lastName={profileData.lastName} size={96} />
                          <div className="grid grid-cols-2 gap-4 flex-1">
                              <div>
                                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                                  <Input name="firstName" value={profileData.firstName} onChange={handleInputChange} className="mt-1" />
                              </div>
                              <div>
                                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                                  <Input name="lastName" value={profileData.lastName} onChange={handleInputChange} className="mt-1" />
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t flex justify-end">
                      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save
                      </Button>
                  </div>
                </>
              )}

              {activeSection === 'About' && (
                <>
                  <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">About</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">About Me <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-500">Maximum 1000 characters can be added</p>
                        <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md min-h-[150px] text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Introduce yourself here! Share a brief overview of who you are, your interests, and connect with fellow users, recruiters & organizers."
                        ></textarea>
                        <p className="text-xs text-red-500 mt-1 text-right">Minimum 30 characters are required</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t flex justify-end">
                      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save
                      </Button>
                  </div>
                </>
              )}

              {activeSection === 'Skills' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-300 rounded-md min-h-[60px] bg-gray-50">
                        {isLoadingSkills ? (
                          <div className="flex items-center justify-center h-12">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          </div>
                        ) : skills.length === 0 ? (
                          <div className="text-gray-500 text-center py-4">No skills added yet. Add some skills to showcase your expertise!</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                              {skills.map(skill => (
                                  <div key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                      <span>{skill}</span>
                                      <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-blue-600 hover:text-blue-800 transition-colors">
                                          <X className="w-4 h-4" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.filter(s => !skills.includes(s)).map(suggestion => (
                                <Button key={suggestion} variant="outline" size="sm" onClick={() => handleAddSkill(suggestion)} className="text-sm">
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Skill</h4>
                        <Input 
                            placeholder="Type a skill and press Enter to add it"
                            value={skillInput}
                            onChange={handleSkillInputChange}
                            onKeyDown={handleSkillInputKeyDown}
                            className="text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Press Enter to add the skill</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t flex justify-end">
                      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save
                      </Button>
                  </div>
                </>
              )}

              {activeSection === 'Education' && (
                <>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700">College <span className="text-red-500">*</span></label>
                            <Input name="college" value={profileData.college} onChange={handleInputChange} placeholder="College" className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Degree</label>
                                <Input name="degree" value={profileData.degree} onChange={handleInputChange} placeholder="e.g. Btech" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Course</label>
                                <Input name="course" value={profileData.course} onChange={handleInputChange} placeholder="e.g. CSE" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Year of Study</label>
                                <Input name="year" placeholder="e.g. 3" value={profileData.year} onChange={handleInputChange} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Location</label>
                            <Input name="location" value={profileData.location} onChange={handleInputChange} placeholder="e.g.Delhi" className="mt-1" />
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t flex justify-end gap-2">
                      <Button variant="outline">
                        Discard
                      </Button>
                      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save
                      </Button>
                    </div>
                </>
              )}
            </main>
        </div>
      </div>
    </div>
  );
}; 