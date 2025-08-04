import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X } from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import userService from '@/services/userService';
import toast from 'react-hot-toast';

interface EditProfileSidebarProps {
  onClose: () => void;
  initialSection?: string;
  onProfileUpdated?: () => void;
}

const steps = [
  { name: 'Basic Details', completed: true },
  { name: 'About', completed: true },
  { name: 'Skills', completed: true },
  { name: 'Education', completed: true },
  { name: 'Work Experience', completed: false },
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

type EducationFormType = {
  id?: string;
  qualification: string;
  course: string;
  specialization: string;
  college: string;
  startYear: string;
  endYear: string;
  courseType: string;
  percentage: string;
  cgpa: string;
  rollNumber: string;
  lateralEntry: string;
  skills: string;
  description: string;
  attachments: any;
};

type WorkFormType = {
  id?: string;
  gotFromUnstop: boolean;
  designation: string;
  organization: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  location: string;
  remote: boolean;
  skills: string;
  description: string;
  attachments: any;
};

export const EditProfile: React.FC<EditProfileSidebarProps> = ({ onClose, initialSection = 'Basic Details', onProfileUpdated }) => {
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
    userType: '',
    username: '',
    email: '',
    mobile: '',
    gender: '',
    domain: '',
    startYear: '',
    endYear: '',
    purpose: '',
    role: '',
    specialization: '',
    department: '',
    designation: '',
    researchInterests: '',
    skills: '',
    experience: '',
    portfolio: '',
    hourlyRate: '',
    avgResponseTime: '',
    dateOfBirth: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const [educationList, setEducationList] = useState([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [educationForm, setEducationForm] = useState<EducationFormType>({
    id: undefined,
    qualification: '', course: '', specialization: '', college: '', startYear: '', endYear: '', courseType: '', percentage: '', cgpa: '', rollNumber: '', lateralEntry: '', skills: '', description: '', attachments: null,
  });

  const [workList, setWorkList] = useState([]);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [workForm, setWorkForm] = useState<WorkFormType>({
    id: undefined,
    gotFromUnstop: false, designation: '', organization: '', employmentType: '', startDate: '', endDate: '', currentlyWorking: false, location: '', remote: false, skills: '', description: '', attachments: null,
  });

  // Add state for personal details
  const [personalDetails, setPersonalDetails] = useState({
    address1: '',
    address2: '',
    landmark: '',
    pincode: '',
    location: '',
    hobbies: '',
    copyCurrent: false,
  });

  // Add state for social links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
    git: '',
    medium: '',
    reddit: '',
    slack: '',
    dribbble: '',
    behance: '',
    codepen: '',
    figma: '',
    custom: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await userService.getUserProfile();
        console.log('EditProfile - Fetched user profile:', userProfile); // Debug log
        
        // Extract data from the response structure - backend returns data directly
        const { auth: authData, profile: userProfileData, studentData: studentInfo, professorData: professorInfo, freelancerData: freelancerInfo } = userProfile;
        
        console.log('EditProfile - Extracted auth data:', authData);
        console.log('EditProfile - Extracted profile data:', userProfileData);
        console.log('EditProfile - Extracted freelancer data:', freelancerInfo);
        
        setProfileData({
          firstName: authData?.firstName || '',
          lastName: authData?.lastName || '',
          bio: userProfileData?.bio || '',
          college: studentInfo?.college || '',
          degree: studentInfo?.degree || '',
          course: studentInfo?.course || '',
          location: userProfileData?.location || '',
          year: studentInfo?.year || '',
          userType: authData?.userType || '',
          username: authData?.username || '',
          email: authData?.email || '',
          mobile: authData?.mobile || authData?.phoneNumber || '',
          gender: authData?.gender || userProfileData?.gender || '',
          domain: authData?.domain || userProfileData?.domain || '',
          startYear: studentInfo?.startYear || '',
          endYear: studentInfo?.endYear || '',
          purpose: authData?.purpose || userProfileData?.purpose || '',
          role: authData?.role || userProfileData?.role || '',
          specialization: studentInfo?.specialization || '',
          department: professorInfo?.department || '',
          designation: professorInfo?.designation || '',
          researchInterests: professorInfo?.researchInterests || '',
          skills: (freelancerInfo?.skills && Array.isArray(freelancerInfo.skills) ? freelancerInfo.skills : []).join(','),
          experience: freelancerInfo?.experience || '',
          portfolio: freelancerInfo?.portfolio || '',
          hourlyRate: freelancerInfo?.hourlyRate || '',
          avgResponseTime: freelancerInfo?.avgResponseTime || '',
          dateOfBirth: userProfileData?.dateOfBirth || '',
        });
        
        console.log('EditProfile - Set profile data with freelancer fields:', {
          experience: freelancerInfo?.experience || '',
          portfolio: freelancerInfo?.portfolio || '',
          hourlyRate: freelancerInfo?.hourlyRate || '',
          avgResponseTime: freelancerInfo?.avgResponseTime || ''
        });
        setEducationList(userProfile.education || []);
        setWorkList(userProfile.workExperience || []);
        
        // Handle skills - convert objects to strings if needed
        const skillsData = (userProfile as any).skills || freelancerInfo?.skills || [];
        if (Array.isArray(skillsData)) {
          const skillStrings = skillsData.map(skill => {
            if (typeof skill === 'string') return skill;
            if (skill && typeof skill === 'object' && skill.name) return skill.name;
            return String(skill);
          });
          setSkills(skillStrings);
        } else {
          setSkills([]);
        }
        
        setPersonalDetails(userProfile.personalDetails || {
          address1: '', address2: '', landmark: '', pincode: '', location: '', hobbies: '', copyCurrent: false
        });
        setSocialLinks(userProfile.socialLinks || {
          linkedin: '', facebook: '', instagram: '', twitter: '', git: '', medium: '', reddit: '', slack: '', dribbble: '', behance: '', codepen: '', figma: '', custom: ''
        });
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
        setEducationList([]);
        setWorkList([]);
        setSkills([]);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading('Saving...');
    try {
      if (activeSection === 'Basic Details') {
        // Update auth info (backend fields)
        console.log('EditProfile - Updating auth info with userType:', denormalizeUserType(profileData.userType));
        await userService.updateAuthInfo({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          userType: denormalizeUserType(profileData.userType),
          phoneNumber: profileData.mobile,
        });
        
        // Also update profile with mobile field
        await userService.updateProfile({
          mobile: profileData.mobile,
        });
        
        // Update profile info (userData.json fields)
        await userService.updateProfile({
          gender: profileData.gender,
          domain: profileData.domain,
          purpose: profileData.purpose,
          role: profileData.role,
          location: profileData.location,
          dateOfBirth: profileData.dateOfBirth,
        });
        
        // Update student data if user is a student
        if (profileData.userType === 'Students') {
          await userService.updateStudentData({
            college: profileData.college,
            degree: profileData.degree,
            course: profileData.course,
            year: profileData.year,
            specialization: profileData.specialization,
            startYear: profileData.startYear,
            endYear: profileData.endYear,
          });
        }
        
        // Update freelancer data if user is a freelancer
        console.log('EditProfile - Current userType:', profileData.userType);
        if (profileData.userType === 'Freelancers' || profileData.userType === 'freelancer') {
          console.log('EditProfile - Saving freelancer data:', {
            experience: profileData.experience,
            portfolio: profileData.portfolio,
            location: profileData.location,
            hourlyRate: profileData.hourlyRate,
            avgResponseTime: profileData.avgResponseTime,
          });
          await userService.updateFreelancerData({
            experience: profileData.experience,
            portfolio: profileData.portfolio,
            location: profileData.location,
            hourlyRate: profileData.hourlyRate,
            avgResponseTime: profileData.avgResponseTime,
          });
        } else {
          console.log('EditProfile - User is not a freelancer, userType:', profileData.userType);
        }
        
        // Debug: Check if data was saved by fetching it again
        setTimeout(async () => {
          try {
            const refreshedProfile = await userService.getUserProfile();
            console.log('EditProfile - Refreshed profile after save:', refreshedProfile);
            console.log('EditProfile - Refreshed freelancer data:', refreshedProfile.freelancerData);
          } catch (error) {
            console.error('EditProfile - Error fetching refreshed profile:', error);
          }
        }, 1000);
        
        // Update professor data if user is a professor
        if (profileData.userType === 'Professors') {
          await userService.updateProfessorData({
            department: profileData.department,
            designation: profileData.designation,
            researchInterests: profileData.researchInterests,
          });
        }
      } else if (activeSection === 'About') {
        await userService.updateProfile({ bio: profileData.bio });
      } else if (activeSection === 'Education') {
        await userService.updateStudentData({
          college: profileData.college,
          degree: profileData.degree,
          course: profileData.course,
          year: profileData.year,
        });
        await userService.updateProfile({ location: profileData.location });
      } else if (activeSection === 'Work Experience') {
        // No bulk save, handled by add/edit/delete
      } else if (activeSection === 'Personal Details') {
        await userService.updatePersonalDetails(personalDetails);
      } else if (activeSection === 'Social Links') {
        await userService.updateSocialLinks(socialLinks);
      }
      toast.dismiss();
      toast.success('Profile updated successfully!');
      // Move to next section
      const currentIndex = steps.findIndex(s => s.name === activeSection);
      if (currentIndex !== -1 && currentIndex < steps.length - 1) {
        setActiveSection(steps[currentIndex + 1].name);
      } else {
        onClose();
      }
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to update profile.');
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const suggestedSkills = ['Securities', 'Deep Learning', 'Mathematical Proficiency', 'Tone of Voice', 'CRM Proficiency', 'E-Discovery', 'Embedded Programming', 'GDPR Compliance', 'Medical Malpractice', 'Remote Access'];
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

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
      await userService.addSkill({ 
        name: trimmedSkill,
        level: 'intermediate',
        category: 'general'
      });
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

  const handleUserTypeSelect = (type: string) => {
    setProfileData(prev => ({ ...prev, userType: type }));
  };

  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEducationSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEducation = () => {
    setEducationForm({
      id: undefined,
      qualification: '', course: '', specialization: '', college: '', startYear: '', endYear: '', courseType: '', percentage: '', cgpa: '', rollNumber: '', lateralEntry: '', skills: '', description: '', attachments: null,
    });
    setEditingEducationIndex(null);
    setShowEducationForm(true);
  };
  const handleEditEducation = (index: number) => {
    setEducationForm(educationList[index]);
    setEditingEducationIndex(index);
    setShowEducationForm(true);
  };
  const handleDeleteEducation = async (index: number) => {
    const edu = educationList[index];
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      await userService.deleteEducation(edu.id);
      const userProfile = await userService.getUserProfile();
      setEducationList(userProfile.education || []);
    }
  };
  const handleSaveEducation = async () => {
    if (editingEducationIndex !== null && educationForm.id) {
      await userService.updateEducation(educationForm.id, educationForm);
    } else {
      await userService.addEducation(educationForm);
    }
    const userProfile = await userService.getUserProfile();
    setEducationList(userProfile.education || []);
    setShowEducationForm(false);
    setEditingEducationIndex(null);
  };
  const handleCancelEducation = () => {
    setShowEducationForm(false);
    setEditingEducationIndex(null);
  };

  const handleWorkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setWorkForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setWorkForm(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleWorkSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWorkForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddWork = () => {
    setWorkForm({
      id: undefined,
      gotFromUnstop: false, designation: '', organization: '', employmentType: '', startDate: '', endDate: '', currentlyWorking: false, location: '', remote: false, skills: '', description: '', attachments: null,
    });
    setEditingWorkIndex(null);
    setShowWorkForm(true);
  };
  const handleEditWork = (index: number) => {
    setWorkForm(workList[index]);
    setEditingWorkIndex(index);
    setShowWorkForm(true);
  };
  const handleDeleteWork = async (index: number) => {
    const work = workList[index];
    if (window.confirm('Are you sure you want to delete this work experience entry?')) {
      await userService.deleteWorkExperience(work.id);
      const userProfile = await userService.getUserProfile();
      setWorkList(userProfile.workExperience || []);
    }
  };
  const handleSaveWork = async () => {
    if (editingWorkIndex !== null && workForm.id) {
      await userService.updateWorkExperience(workForm.id, workForm);
    } else {
      await userService.addWorkExperience(workForm);
    }
    const userProfile = await userService.getUserProfile();
    setWorkList(userProfile.workExperience || []);
    setShowWorkForm(false);
    setEditingWorkIndex(null);
  };
  const handleCancelWork = () => {
    setShowWorkForm(false);
    setEditingWorkIndex(null);
  };

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setPersonalDetails(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setPersonalDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const normalizeUserType = (dbType: string) => {
    switch ((dbType || '').toLowerCase()) {
      case 'student':
        return 'Students';
      case 'professor':
        return 'Professors';
      case 'freelancer':
        return 'Freelancers';
      default:
        return '';
    }
  };

  const denormalizeUserType = (uiType: string) => {
    switch (uiType) {
      case 'Students':
        return 'student';
      case 'Professors':
        return 'professor';
      case 'Freelancers':
        return 'freelancer';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        <header className="flex items-center justify-between p-2 border-b">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Details</h3>
                  {/* Name, Username, Email, Mobile, Gender, User Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                      <Input name="firstName" value={profileData.firstName ?? ''} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                      <Input name="lastName" value={profileData.lastName ?? ''} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <Input name="username" value={profileData.username ?? ''} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input name="email" value={profileData.email ?? ''} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mobile <span className="text-red-500">*</span></label>
                      <div className="flex gap-2 mt-1">
                        <select className="border rounded-md px-2 py-1 text-sm bg-white">
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <Input name="mobile" value={profileData.mobile ?? ''} onChange={handleInputChange} className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                      <div className="flex gap-3 mt-1">
                        {['Male', 'Female', 'Others'].map(gender => (
                          <button
                            key={gender}
                            type="button"
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${profileData.gender === gender ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setProfileData(prev => ({ ...prev, gender }))}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <Input 
                        name="dateOfBirth" 
                        type="date" 
                        value={profileData.dateOfBirth ?? ''} 
                        onChange={handleInputChange} 
                        className="mt-1" 
                      />
                    </div>
                  </div>
                  {/* User Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">User Type <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Students', 'Professors', 'Freelancers'].map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${(profileData.userType === type || (type === 'Freelancers' && profileData.userType === 'freelancer')) ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setProfileData(prev => ({ ...prev, userType: type }))}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Current userType: {profileData.userType || 'Not set'} (Normalized: {normalizeUserType(profileData.userType) || profileData.userType})
                    </div>
                  </div>
                  
                  {/* Conditional Fields by User Type */}
                  {profileData.userType === 'Students' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course <span className="text-red-500">*</span></label>
                        <select name="course" value={profileData.course ?? ''} onChange={handleSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Course</option>
                          <option value="B.Tech/BE">B.Tech/BE (Bachelor of Technology / Bachelor of Engineering)</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="MBA">MBA</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course Specialization <span className="text-red-500">*</span></label>
                        <select name="specialization" value={profileData.specialization ?? ''} onChange={handleSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Specialization</option>
                          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Course Duration <span className="text-red-500">*</span></label>
                          <Input name="startYear" value={profileData.startYear ?? ''} onChange={handleInputChange} className="mt-1" placeholder="Start Year" />
                        </div>
                        <div className="pt-6">
                          <Input name="endYear" value={profileData.endYear ?? ''} onChange={handleInputChange} className="mt-1" placeholder="End Year" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organisation/College <span className="text-red-500">*</span></label>
                        <Input name="college" value={profileData.college ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Purpose <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {['To find a Job', 'Compete & Upskill', 'To Host an Event', 'To be a Mentor'].map(purpose => (
                            <button
                              key={purpose}
                              type="button"
                              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${profileData.purpose === purpose ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                              onClick={() => setProfileData(prev => ({ ...prev, purpose }))}
                            >
                              {purpose}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Select Role</label>
                        <Input name="role" value={profileData.role ?? ''} onChange={handleInputChange} className="mt-1" placeholder="Hiring For" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input name="location" value={profileData.location ?? ''} onChange={handleInputChange} className="flex-1" placeholder="City, State, Country" />
                          <span className="text-gray-400"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm0-10a2 2 0 100 4 2 2 0 000-4z"/></svg></span>
                        </div>
                      </div>
                    </div>
                  )}
                  {profileData.userType === 'Professors' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                        <Input name="department" value={profileData.department ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
                        <Input name="designation" value={profileData.designation ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">College/University <span className="text-red-500">*</span></label>
                        <Input name="college" value={profileData.college ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Research Interests</label>
                        <Input name="researchInterests" value={profileData.researchInterests ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input name="location" value={profileData.location ?? ''} onChange={handleInputChange} className="flex-1" placeholder="City, State, Country" />
                          <span className="text-gray-400"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm0-10a2 2 0 100 4 2 2 0 000-4z"/></svg></span>
                        </div>
                      </div>
                    </div>
                  )}
                  {(profileData.userType === 'Freelancers' || profileData.userType === 'freelancer') && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Experience (years)</label>
                        <Input name="experience" value={profileData.experience ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Portfolio/Website</label>
                        <Input name="portfolio" value={profileData.portfolio ?? ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Hourly Rate ($/hr)</label>
                        <Input name="hourlyRate" value={profileData.hourlyRate ?? ''} onChange={handleInputChange} className="mt-1" placeholder="e.g. 50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Avg Response Time (hrs)</label>
                        <Input name="avgResponseTime" value={profileData.avgResponseTime ?? ''} onChange={handleInputChange} className="mt-1" placeholder="e.g. 5" />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input name="location" value={profileData.location ?? ''} onChange={handleInputChange} className="flex-1" placeholder="City, State, Country" />
                          <span className="text-gray-400"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm0-10a2 2 0 100 4 2 2 0 000-4z"/></svg></span>
                        </div>
                      </div>
                    </div>
                  )}
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
                            value={profileData.bio ?? ''}
                            onChange={handleInputChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md min-h-[150px] text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Introduce yourself here! Share a brief overview of who you are, your interests, and connect with fellow users, recruiters & organizers."
                        ></textarea>
                        <p className="text-xs text-red-500 mt-1 text-right">Minimum 30 characters are required</p>
                    </div>
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
                              {skills.map((skill, index) => (
                                  <div key={`${skill}-${index}`} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
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
                </>
              )}

              {activeSection === 'Education' && (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                    {!showEducationForm && (
                      <Button variant="outline" size="sm" onClick={handleAddEducation}>Add</Button>
                    )}
                  </div>
                  {showEducationForm ? (
                    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveEducation(); }}>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Qualification <span className="text-red-500">*</span></label>
                        <select name="qualification" value={educationForm.qualification ?? ''} onChange={handleEducationSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Qualification</option>
                          <option value="PhD">PhD</option>
                          <option value="Post Graduation">Post Graduation</option>
                          <option value="Graduation">Graduation</option>
                          <option value="Intermediate (12th)">Intermediate (12th)</option>
                          <option value="High School (10th)">High School (10th)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course <span className="text-red-500">*</span></label>
                        <select name="course" value={educationForm.course ?? ''} onChange={handleEducationSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Course</option>
                          <option value="B.Tech/BE">B.Tech/BE (Bachelor of Technology / Bachelor of Engineering)</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="MBA">MBA</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Specialization <span className="text-red-500">*</span></label>
                        <select name="specialization" value={educationForm.specialization ?? ''} onChange={handleEducationSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Specialization</option>
                          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">College <span className="text-red-500">*</span></label>
                        <Input name="college" value={educationForm.college ?? ''} onChange={handleEducationInputChange} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Start Year</label>
                          <Input name="startYear" value={educationForm.startYear ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="Start Year" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">End Year</label>
                          <Input name="endYear" value={educationForm.endYear ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="End Year" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course Type</label>
                        <select name="courseType" value={educationForm.courseType ?? ''} onChange={handleEducationSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Course Type</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Distance">Distance</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Percentage</label>
                          <Input name="percentage" value={educationForm.percentage ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="Percentage" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">CGPA</label>
                          <Input name="cgpa" value={educationForm.cgpa ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="CGPA" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Roll Number</label>
                          <Input name="rollNumber" value={educationForm.rollNumber ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="Roll number" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Are you a Lateral Entry Student?</label>
                          <select name="lateralEntry" value={educationForm.lateralEntry ?? ''} onChange={handleEducationSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                            <option value="">Lateral entry</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Skills</label>
                        <Input name="skills" value={educationForm.skills ?? ''} onChange={handleEducationInputChange} className="mt-1" placeholder="Add skills" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={educationForm.description ?? ''} onChange={handleEducationInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md min-h-[80px] text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Detail your education journey: degrees, accomplishments, skills gained. Share your academic and learning experiences to stand out" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Attachments</label>
                        <Input type="file" name="attachments" onChange={e => setEducationForm(prev => ({ ...prev, attachments: e.target.files?.[0] || null }))} className="mt-1" />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={handleCancelEducation}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 text-white" variant="default">Save</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {educationList.length === 0 ? (
                        <div className="text-gray-500 text-sm">No education added yet.</div>
                      ) : (
                        educationList.map((edu, idx) => (
                          <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                            <div>
                              <div className="font-semibold text-gray-900">{edu.qualification} - {edu.course}</div>
                              <div className="text-gray-700 text-sm">{edu.college} | {edu.startYear} - {edu.endYear}</div>
                              <div className="text-gray-500 text-xs mt-1">{edu.specialization}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditEducation(idx)}>Edit</Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteEducation(idx)} className="text-red-600 border-red-600 hover:bg-red-50">Delete</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}

              {activeSection === 'Work Experience' && (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
                    {!showWorkForm && (
                      <Button variant="outline" size="sm" onClick={handleAddWork}>Add</Button>
                    )}
                  </div>
                  {showWorkForm ? (
                    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveWork(); }}>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
                        <select name="designation" value={workForm.designation ?? ''} onChange={handleWorkSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Designation</option>
                          <option value="Software Engineer">Software Engineer</option>
                          <option value="Research Intern">Research Intern</option>
                          <option value="Product Manager">Product Manager</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organisation <span className="text-red-500">*</span></label>
                        <Input name="organization" value={workForm.organization ?? ''} onChange={handleWorkInputChange} className="mt-1" placeholder="Select Organisation" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Employment Type <span className="text-red-500">*</span></label>
                        <select name="employmentType" value={workForm.employmentType ?? ''} onChange={handleWorkSelectChange} className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white">
                          <option value="">Select Employment Type</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                          <Input type="date" name="startDate" value={workForm.startDate ?? ''} onChange={handleWorkInputChange} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">End Date</label>
                          <Input type="date" name="endDate" value={workForm.endDate ?? ''} onChange={handleWorkInputChange} className="mt-1" disabled={workForm.currentlyWorking} />
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <input type="checkbox" name="currentlyWorking" checked={workForm.currentlyWorking} onChange={handleWorkInputChange} />
                          <label className="text-sm text-gray-700">Currently working in this role</label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                        <Input name="location" value={workForm.location ?? ''} onChange={handleWorkInputChange} className="mt-1 flex-1" placeholder="Select Location" />
                        <input type="checkbox" name="remote" checked={workForm.remote} onChange={handleWorkInputChange} />
                        <label className="text-sm text-gray-700">Remote</label>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Skills</label>
                        <Input name="skills" value={workForm.skills ?? ''} onChange={handleWorkInputChange} className="mt-1" placeholder="Add skills" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={workForm.description ?? ''} onChange={handleWorkInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md min-h-[80px] text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Describe your role here, detailing the responsibilities you handled, the skills you applied and developed, and the significant experiences you gained during your tenure." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Attachments</label>
                        <Input type="file" name="attachments" onChange={e => setWorkForm(prev => ({ ...prev, attachments: e.target.files?.[0] || null }))} className="mt-1" />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={handleCancelWork}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 text-white" variant="default">Save</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {workList.length === 0 ? (
                        <div className="text-gray-500 text-sm">No work experience added yet.</div>
                      ) : (
                        workList.map((work, idx) => (
                          <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                            <div>
                              <div className="font-semibold text-gray-900">{work.designation} - {work.organization}</div>
                              <div className="text-gray-700 text-sm">{work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}</div>
                              <div className="text-gray-500 text-xs mt-1">{work.employmentType}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditWork(idx)}>Edit</Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteWork(idx)} className="text-red-600 border-red-600 hover:bg-red-50">Delete</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}

              {activeSection === 'Personal Details' && (
                <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">Permanent Address</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                        <Input name="address1" value={personalDetails.address1 ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="Address 1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Address Line 2</label>
                        <Input name="address2" value={personalDetails.address2 ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="Address 2" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Landmark</label>
                        <Input name="landmark" value={personalDetails.landmark ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="Landmark" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Pincode</label>
                        <Input name="pincode" value={personalDetails.pincode ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="Pincode" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <Input name="location" value={personalDetails.location ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="Select Location" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hobbies</label>
                    <Input name="hobbies" value={personalDetails.hobbies ?? ''} onChange={handlePersonalInputChange} className="mt-1" placeholder="List your hobbies." />
                  </div>
                </form>
              )}

              {activeSection === 'Social Links' && (
                <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Linkedin</label>
                      <Input name="linkedin" value={socialLinks.linkedin ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Facebook</label>
                      <Input name="facebook" value={socialLinks.facebook ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Instagram</label>
                      <Input name="instagram" value={socialLinks.instagram ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Twitter</label>
                      <Input name="twitter" value={socialLinks.twitter ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Git</label>
                      <Input name="git" value={socialLinks.git ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Medium</label>
                      <Input name="medium" value={socialLinks.medium ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reddit</label>
                      <Input name="reddit" value={socialLinks.reddit ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Slack</label>
                      <Input name="slack" value={socialLinks.slack ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Dribbble</label>
                      <Input name="dribbble" value={socialLinks.dribbble ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Behance</label>
                      <Input name="behance" value={socialLinks.behance ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">CodePen</label>
                      <Input name="codepen" value={socialLinks.codepen ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Figma</label>
                      <Input name="figma" value={socialLinks.figma ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Custom Link</label>
                      <Input name="custom" value={socialLinks.custom ?? ''} onChange={handleSocialInputChange} className="mt-1" placeholder="Add link" />
                    </div>
                  </div>
                </form>
              )}
            </main>
        </div>
        {/* Sticky Save & Next Action Bar */}
        {!(showEducationForm || showWorkForm) && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50 flex justify-end px-8 py-2 shadow-lg">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-xl rounded-full"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (steps.findIndex(s => s.name === activeSection) === steps.length - 1 ? 'Finish' : 'Save & Next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 