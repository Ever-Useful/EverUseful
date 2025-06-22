export interface Freelancer {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  availability: string;
  skills: string[];
  description: string;
  about: string;
  completedProjects: number;
  responseTime: string;
  connections: number;
}

export const freelancersData: Freelancer[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "AI Research Scientist",
    image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 85,
    location: "San Francisco, CA",
    availability: "Available",
    skills: ["Machine Learning", "Python", "TensorFlow", "Research"],
    description: "PhD in AI with 8+ years experience in machine learning research and development.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 45,
    responseTime: "2 hours",
    connections: 500,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "Blockchain Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 75,
    location: "Austin, TX",
    availability: "Available",
    skills: ["Solidity", "Web3", "Smart Contracts", "React"],
    description: "Full-stack blockchain developer specializing in DeFi and NFT platforms.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 32,
    responseTime: "1 hour",
    connections: 500,
  },
  {
    id: 3,
    name: "Lisa Johnson",
    title: "UX/UI Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 156,
    hourlyRate: 65,
    location: "New York, NY",
    availability: "Busy until Feb 15",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    description: "Senior UX designer with expertise in creating intuitive digital experiences.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 67,
    responseTime: "4 hours",
    connections: 500,
  },
  {
    id: 4,
    name: "Dr. Raj Patel",
    title: "Data Scientist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5.0,
    reviews: 78,
    hourlyRate: 90,
    location: "London, UK",
    availability: "Available",
    skills: ["Python", "R", "Machine Learning", "Statistics"],
    description: "Data scientist with PhD in Statistics, specialized in predictive modeling.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 28,
    responseTime: "3 hours",
    connections: 500,
  },
  {
    id: 5,
    name: "Emma Watson",
    title: "Mobile App Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    reviews: 203,
    hourlyRate: 70,
    location: "Toronto, CA",
    availability: "Available",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    description: "Mobile app developer with 6+ years experience in cross-platform development.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 54,
    responseTime: "2 hours",
    connections: 500,
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Cybersecurity Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 167,
    hourlyRate: 95,
    location: "Berlin, DE",
    availability: "Available",
    skills: ["Penetration Testing", "Security Audits", "Compliance", "Risk Assessment"],
    description: "Certified cybersecurity professional with expertise in enterprise security.",
    about: "I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems. I am passionate about advancing AI technologies and have worked on various projects ranging from natural language processing to computer vision. My goal is to leverage AI to solve real-world problems.",
    completedProjects: 38,
    responseTime: "1 hour",
    connections: 500,
  }
];

export const getFreelancerById = (id: number): Freelancer | undefined => {
  return freelancersData.find(freelancer => freelancer.id === id);
};