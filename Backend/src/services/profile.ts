import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get the absolute path to the profile.json file
const PROFILE_FILE = path.resolve(__dirname, '../../data/profile.json');
console.log('Profile file path:', PROFILE_FILE);

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(PROFILE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    console.log('Creating data directory:', dataDir);
    await fs.mkdir(dataDir, { recursive: true });
  }
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'in_progress' | 'completed' | 'on_hold';
  category: string;
  tags: string[];
  githubLink?: string;
  projectLink?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  projects: Project[];
  recentProjects: string[];
  skills: string[];
  quickActions: {
    id: string;
    name: string;
    description: string;
    icon: string;
    link: string;
  }[];
  meetings: {
    id: string;
    title: string;
    date: string;
    time: string;
    participants: string[];
    description: string;
  }[];
  recentActivity: {
    id: string;
    type: 'project' | 'meeting' | 'skill' | 'action';
    title: string;
    description: string;
    timestamp: string;
  }[];
}

interface ProfileData {
  users: UserProfile[];
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  createdAt: string;
}

async function readProfileData(): Promise<ProfileData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PROFILE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profile data:', error);
    // If file doesn't exist or is invalid, return default structure
    return {
      users: []
    };
  }
}

async function writeProfileData(data: ProfileData): Promise<void> {
  try {
    await ensureDataDirectory();
    console.log('Writing profile data to:', PROFILE_FILE);
    console.log('Data to write:', JSON.stringify(data, null, 2));
    await fs.writeFile(PROFILE_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Profile data written successfully');
  } catch (error) {
    console.error('Error writing profile data:', error);
    throw new Error('Failed to write profile data');
  }
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const data = await readProfileData();
  return data.users.find(user => user.id === userId) || null;
}

async function createOrUpdateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  const data = await readProfileData();
  const existingUserIndex = data.users.findIndex(user => user.id === userId);

  if (existingUserIndex === -1) {
    const newUser: UserProfile = {
      id: userId,
      email: profileData.email || '',
      displayName: profileData.displayName || '',
      photoURL: profileData.photoURL,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      projects: [],
      recentProjects: [],
      skills: [],
      quickActions: [],
      meetings: [],
      recentActivity: []
    };
    data.users.push(newUser);
    await writeProfileData(data);
    return newUser;
  }

  const updatedUser = {
    ...data.users[existingUserIndex],
    ...profileData
  };
  data.users[existingUserIndex] = updatedUser;
  await writeProfileData(data);
  return updatedUser;
}

// Project Management Functions
export async function createProject(userId: string, projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const newProject: Project = {
    id: uuidv4(),
    ...projectData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.users[userIndex].projects.push(newProject);
  await writeProfileData(data);
  return newProject;
}

export async function getProjects(userId: string): Promise<Project[]> {
  const user = await getUserProfile(userId);
  return user?.projects || [];
}

export async function updateProject(userId: string, projectId: string, projectData: Partial<Project>): Promise<Project> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const projectIndex = data.users[userIndex].projects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }

  const updatedProject = {
    ...data.users[userIndex].projects[projectIndex],
    ...projectData,
    updatedAt: new Date().toISOString()
  };

  data.users[userIndex].projects[projectIndex] = updatedProject;
  await writeProfileData(data);
  return updatedProject;
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users[userIndex].projects = data.users[userIndex].projects.filter(p => p.id !== projectId);
  data.users[userIndex].recentProjects = data.users[userIndex].recentProjects.filter(id => id !== projectId);
  await writeProfileData(data);
}

export async function addProjectToRecent(userId: string, projectId: string): Promise<void> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const recentProjects = data.users[userIndex].recentProjects;
  // Remove if already exists
  const filteredProjects = recentProjects.filter(id => id !== projectId);
  // Add to beginning
  filteredProjects.unshift(projectId);
  // Keep only the 5 most recent
  data.users[userIndex].recentProjects = filteredProjects.slice(0, 5);
  
  await writeProfileData(data);
}

// Skills Management Functions
export async function addSkill(userId: string, skillData: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
  console.log('Adding skill for user:', userId, 'Skill data:', skillData);
  const data = await readProfileData();
  console.log('Current profile data:', JSON.stringify(data, null, 2));
  
  const userIndex = data.users.findIndex(user => user.id === userId);
  console.log('User index:', userIndex);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const newSkill: Skill = {
    id: uuidv4(),
    ...skillData,
    createdAt: new Date().toISOString()
  };
  console.log('New skill to add:', newSkill);

  // Initialize skills array if it doesn't exist
  if (!data.users[userIndex].skills) {
    data.users[userIndex].skills = [];
  }

  // Add the new skill
  data.users[userIndex].skills.push(newSkill);
  console.log('Updated user skills:', data.users[userIndex].skills);

  // Add to recent activity
  const activity = {
    id: uuidv4(),
    type: 'skill_added',
    description: `Added skill: ${skillData.name}`,
    timestamp: new Date().toISOString(),
    relatedId: newSkill.id
  };

  if (!data.users[userIndex].recentActivity) {
    data.users[userIndex].recentActivity = [];
  }
  data.users[userIndex].recentActivity.unshift(activity);

  // Update the user's updatedAt timestamp
  data.users[userIndex].updatedAt = new Date().toISOString();

  console.log('Final data to write:', JSON.stringify(data, null, 2));
  await writeProfileData(data);
  return newSkill;
}

export async function getSkills(userId: string): Promise<Skill[]> {
  const user = await getUserProfile(userId);
  return user?.skills || [];
}

export async function updateSkill(userId: string, skillId: string, skillData: Partial<Skill>): Promise<Skill> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const skillIndex = data.users[userIndex].skills.findIndex(s => s.id === skillId);
  if (skillIndex === -1) {
    throw new Error('Skill not found');
  }

  const updatedSkill = {
    ...data.users[userIndex].skills[skillIndex],
    ...skillData
  };

  data.users[userIndex].skills[skillIndex] = updatedSkill;
  await writeProfileData(data);
  return updatedSkill;
}

export async function deleteSkill(userId: string, skillId: string): Promise<void> {
  const data = await readProfileData();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Find the skill before deleting it
  const skillToDelete = data.users[userIndex].skills.find(s => s.id === skillId);
  if (!skillToDelete) {
    throw new Error('Skill not found');
  }

  // Remove the skill
  data.users[userIndex].skills = data.users[userIndex].skills.filter(s => s.id !== skillId);

  // Add to recent activity
  const activity = {
    id: uuidv4(),
    type: 'skill_deleted',
    description: `Deleted skill: ${skillToDelete.name}`,
    timestamp: new Date().toISOString(),
    relatedId: skillId
  };

  if (!data.users[userIndex].recentActivity) {
    data.users[userIndex].recentActivity = [];
  }
  data.users[userIndex].recentActivity.unshift(activity);

  // Update the user's updatedAt timestamp
  data.users[userIndex].updatedAt = new Date().toISOString();

  await writeProfileData(data);
}

// Export other necessary functions
export {
  getUserProfile,
  createOrUpdateUserProfile
}; 