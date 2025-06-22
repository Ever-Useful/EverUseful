import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Interfaces
interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  createdAt: string;
  updatedAt: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'project_created' | 'project_updated' | 'meeting_scheduled' | 'skill_added' | 'profile_updated';
  description: string;
  timestamp: string;
  relatedId?: string;
}

interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  stats: {
    followers: number;
    following: number;
    projects: number;
    likes: number;
  };
  userType: string;
  college: string;
  degree: string;
  course: string;
  year: string;
  location: string;
  website: string;
  quickActions: QuickAction[];
  recentProjects: Project[];
  meetings: Meeting[];
  skills: Skill[];
  recentActivity: Activity[];
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  users: Profile[];
}

const PROFILE_FILE_PATH = path.join(__dirname, '../data/profile.json');

// Helper functions
const readProfileData = (): ProfileData => {
  try {
    const data = fs.readFileSync(PROFILE_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profile data:', error);
    return { users: [] };
  }
};

const writeProfileData = (data: ProfileData): void => {
  try {
    fs.writeFileSync(PROFILE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing profile data:', error);
    throw error;
  }
};

// Profile Management
export const createProfile = (userId: string, profileData: Partial<Profile>): Profile => {
  const data = readProfileData();
  
  const newProfile: Profile = {
    id: userId,
    name: profileData.name || 'Anonymous',
    title: profileData.title || 'Member',
    bio: profileData.bio || 'No bio available',
    avatar: profileData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    backgroundImage: profileData.backgroundImage || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    stats: {
      followers: 0,
      following: 0,
      projects: 0,
      likes: 0
    },
    userType: profileData.userType || 'student',
    college: profileData.college || '',
    degree: profileData.degree || '',
    course: profileData.course || '',
    year: profileData.year || '',
    location: profileData.location || '',
    website: profileData.website || '',
    quickActions: [],
    recentProjects: [],
    meetings: [],
    skills: [],
    recentActivity: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.users.push(newProfile);
  writeProfileData(data);
  return newProfile;
};

// Quick Actions Management
export const addQuickAction = (userId: string, action: Omit<QuickAction, 'id' | 'createdAt'>): QuickAction | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const newAction: QuickAction = {
    id: uuidv4(),
    ...action,
    createdAt: new Date().toISOString()
  };

  data.users[userIndex].quickActions.push(newAction);
  writeProfileData(data);
  return newAction;
};

export const removeQuickAction = (userId: string, actionId: string): boolean => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return false;

  const initialLength = data.users[userIndex].quickActions.length;
  data.users[userIndex].quickActions = data.users[userIndex].quickActions.filter(action => action.id !== actionId);
  
  if (data.users[userIndex].quickActions.length !== initialLength) {
    writeProfileData(data);
    return true;
  }
  
  return false;
};

// Projects Management
export const addProject = (userId: string, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const newProject: Project = {
    id: uuidv4(),
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.users[userIndex].recentProjects.push(newProject);
  data.users[userIndex].stats.projects += 1;
  writeProfileData(data);
  return newProject;
};

export const updateProject = (userId: string, projectId: string, updates: Partial<Project>): Project | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const projectIndex = data.users[userIndex].recentProjects.findIndex(project => project.id === projectId);
  if (projectIndex === -1) return null;

  const updatedProject = {
    ...data.users[userIndex].recentProjects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  data.users[userIndex].recentProjects[projectIndex] = updatedProject;
  writeProfileData(data);
  return updatedProject;
};

// Meetings Management
export const scheduleMeeting = (userId: string, meeting: Omit<Meeting, 'id' | 'createdAt'>): Meeting | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const newMeeting: Meeting = {
    id: uuidv4(),
    ...meeting,
    createdAt: new Date().toISOString()
  };

  data.users[userIndex].meetings.push(newMeeting);
  writeProfileData(data);
  return newMeeting;
};

export const updateMeeting = (userId: string, meetingId: string, updates: Partial<Meeting>): Meeting | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const meetingIndex = data.users[userIndex].meetings.findIndex(meeting => meeting.id === meetingId);
  if (meetingIndex === -1) return null;

  const updatedMeeting = {
    ...data.users[userIndex].meetings[meetingIndex],
    ...updates
  };

  data.users[userIndex].meetings[meetingIndex] = updatedMeeting;
  writeProfileData(data);
  return updatedMeeting;
};

// Skills Management
export const addSkill = (userId: string, skill: Omit<Skill, 'id' | 'createdAt'>): Skill | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const newSkill: Skill = {
    id: uuidv4(),
    ...skill,
    createdAt: new Date().toISOString()
  };

  data.users[userIndex].skills.push(newSkill);
  writeProfileData(data);
  return newSkill;
};

export const removeSkill = (userId: string, skillId: string): boolean => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return false;

  const initialLength = data.users[userIndex].skills.length;
  data.users[userIndex].skills = data.users[userIndex].skills.filter(skill => skill.id !== skillId);
  
  if (data.users[userIndex].skills.length !== initialLength) {
    writeProfileData(data);
    return true;
  }
  
  return false;
};

// Activity Management
export const addActivity = (userId: string, activity: Omit<Activity, 'id' | 'timestamp'>): Activity | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const newActivity: Activity = {
    id: uuidv4(),
    ...activity,
    timestamp: new Date().toISOString()
  };

  // Keep only the last 50 activities
  data.users[userIndex].recentActivity.unshift(newActivity);
  if (data.users[userIndex].recentActivity.length > 50) {
    data.users[userIndex].recentActivity = data.users[userIndex].recentActivity.slice(0, 50);
  }

  writeProfileData(data);
  return newActivity;
};

// Getter Functions
export const getProfile = (userId: string): Profile | null => {
  const data = readProfileData();
  return data.users.find(user => user.id === userId) || null;
};

export const getQuickActions = (userId: string): QuickAction[] | null => {
  const profile = getProfile(userId);
  return profile?.quickActions || null;
};

export const getRecentProjects = (userId: string): Project[] | null => {
  const profile = getProfile(userId);
  return profile?.recentProjects || null;
};

export const getMeetings = (userId: string): Meeting[] | null => {
  const profile = getProfile(userId);
  return profile?.meetings || null;
};

export const getSkills = (userId: string): Skill[] | null => {
  const profile = getProfile(userId);
  return profile?.skills || null;
};

export const getRecentActivity = (userId: string): Activity[] | null => {
  const profile = getProfile(userId);
  return profile?.recentActivity || null;
};

// Update profile
export const updateProfile = (userId: string, updates: Partial<Profile>): Profile | null => {
  const data = readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;

  const updatedProfile = {
    ...data.users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  data.users[userIndex] = updatedProfile;
  writeProfileData(data);
  return updatedProfile;
};

// Delete profile
export const deleteProfile = (userId: string): boolean => {
  const data = readProfileData();
  const initialLength = data.users.length;
  
  data.users = data.users.filter(user => user.id !== userId);
  
  if (data.users.length !== initialLength) {
    writeProfileData(data);
    return true;
  }
  
  return false;
}; 