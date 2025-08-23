import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Markdown from "markdown-to-jsx";
import { 
  X, 
  Send, 
  User, 
  Brain,
  Users,
  Briefcase,
  Target,
  Leaf,
  Globe,
  Award,
  Lightbulb,
  Heart,
  Zap,
  Shield,
  Star
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotPopup = ({ isOpen, onClose }: ChatbotPopupProps) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      text: "Hello! I'm AMOGH AI Assistant. I'm here to help you navigate our platform and answer questions about AMOGH Connect. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const platformData = useMemo(() => ({
    name: "AMOGH",
    tagline: "Connect Innovation with Opportunity - Ever Useful",
    statistics: {
      globalCommunities: "850+ institutions",
      activeSolutions: "1.2M+ learners",
      co2Reduced: "Sustainable impact",
      livesImproved: "Global reach",
      projects: "Innovation projects",
      users: "Students, PhD holders, Professors, Businesses",
      countries: "Worldwide",
      partnerships: "Chainfly, Reslink"
    },
    founder: {
      name: "Harsh Parashar",
      title: "Founder",
      vision: "Working at World Wide Level for Youth Empowerment & Nation Building",
      background: "Founder - Sarvagya Nirakar Community",
      achievements: ["Teaching students at government schools", "Charity for needy people", "Science for all campaign", "Bringing ancient Indian knowledge back to life", "Women empowerment", "Biggest free Startup Incubation Center for all"]
    },
    team: {
      core: "6 team members",
      advisors: "Industry experts",
      global: "Worldwide operations",
      expertise: ["Frontend Development", "Backend Development", "Marketing", "Business Development", "Technical Leadership"]
    },
    services: {
      marketplace: "Course marketplace and project collaboration",
      consulting: "Expert consultation and mentorship",
      incubation: "Startup incubation and support",
      research: "Research freelancing and collaboration",
      events: "Global innovation summits and workshops",
      education: "Skill development and learning resources"
    }
  }), []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = useCallback((userMessage: string): { text: string } => {
    const lowerMessage = userMessage.toLowerCase();
    
         // Handle greetings and introductions
     if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
       return {
         text: `Hello! I'm AMOGH AI Assistant, your guide to the AMOGH Connect platform.

## What I can help with:
- Project marketplace & collaboration
- Community engagement & networking  
- Career opportunities & freelancing
- Sustainable development initiatives
- AI & technology solutions

What would you like to learn about today?`
       };
    }
    
         // Handle out-of-context queries
     if (!lowerMessage.includes("amogh") && 
         !lowerMessage.includes("project") && 
         !lowerMessage.includes("community") && 
         !lowerMessage.includes("career") && 
         !lowerMessage.includes("sustainable") && 
         !lowerMessage.includes("ai") && 
         !lowerMessage.includes("marketplace") && 
         !lowerMessage.includes("help") && 
         !lowerMessage.includes("support") &&
         !lowerMessage.includes("platform") &&
         !lowerMessage.includes("connect") &&
         !lowerMessage.includes("innovation") &&
         !lowerMessage.includes("founder") &&
         !lowerMessage.includes("team") &&
         !lowerMessage.includes("service")) {
       return {
         text: `I'm specifically designed to assist with questions about the AMOGH Connect platform and our services.

## I can help you with:
- Platform navigation and features
- Project information and collaboration
- Community engagement and networking
- Career opportunities and freelancing
- Sustainable development initiatives
- AI and technology solutions
- Information about our founder and team
- Our comprehensive service offerings

Please ask me about AMOGH Connect, and I'll be happy to help!`
       };
    }
    
         // Handle founder-related queries
     if (lowerMessage.includes("founder") || lowerMessage.includes("harsh") || lowerMessage.includes("ceo")) {
       return {
         text: `# Meet Our Founder: ${platformData.founder.name}

## ${platformData.founder.title}
${platformData.founder.vision}

## Background:
- ${platformData.founder.background}
- Working at World Wide Level for Youth Empowerment
- Nation Building initiatives and community development

## Key Achievements:
- Teaching students at government schools
- Charity for needy people
- Science for all campaign
- Bringing ancient Indian knowledge back to life
- Women empowerment initiatives
- Biggest free Startup Incubation Center for all

## Vision for AMOGH:
Creating a platform where students, PhD holders, professors, and businesses collaborate to transform ideas into real-world impact. Empowering technically skilled students to present their innovations while providing channels for professionals and businesses to engage, mentor, and elevate those ideas.

**Contact:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)`
       };
    }

         // Handle team-related queries
     if (lowerMessage.includes("team") || lowerMessage.includes("people") || lowerMessage.includes("staff")) {
       return {
         text: `# 👥 Our Team

## Leadership:
- **Harsh Parashar** - Founder & CEO
- **Ankit Kumar** - Team Lead & Technical Consultant

## Technical Team:
- **Rishika Gupta** - Frontend Developer
- **Amrit Lal Paswan** - Frontend Developer  
- **Kritensh Kumar** - Backend Developer

## Management Team:
- **Pooja Kusum** - Marketing Director
- **Navya** - Business Development

## Expertise Areas:
- **Frontend Development** - React, TypeScript, UI/UX
- **Backend Development** - Server solutions, APIs, databases
- **Marketing & Strategy** - Growth, partnerships, brand development
- **Business Development** - Client relations, market expansion
- **Technical Leadership** - Product development, architecture

## Company Culture:
- Passionate about innovation and impact
- Focus on youth empowerment and education
- Global reach with local expertise
- Collaborative and inclusive environment

**Join Our Team:** We're always looking for passionate innovators. Send your resume to [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)`
       };
    }

         // Handle services-related queries
     if (lowerMessage.includes("service") || lowerMessage.includes("what we do") || lowerMessage.includes("offer")) {
       return {
         text: `# 🚀 Our Comprehensive Services

## 🎓 Learning Hub
- **Course Marketplace** - Access to curated courses and projects
- **AI Learning Agents** - Personalized AI-powered learning experiences
- **Find Expert Mentors** - Connect with industry professionals
- **Schedule Sessions** - Book consultation and mentoring sessions

## 💼 Enterprise Solutions
- **Expert Consultation** - One-on-one sessions with industry leaders
- **Research Freelancing** - Collaborate on research projects
- **Career Opportunities** - Find freelancing and career advancement
- **Network & Connect** - Build professional relationships
- **Sustainable Projects** - Contribute to environmental initiatives

## 🔒 Platform Features
- **Secure Platform** - Enterprise-grade encryption and data protection
- **AI Matching** - Smart recommendations for projects and collaborators
- **Mentorship** - Exclusive one-to-one sessions and workshops
- **Project Control** - Boards, timelines, and progress tracking
- **Resources** - Curated courses, tutorials, and certifications
- **24/7 Support** - Human-assisted chat with AI knowledge base

## 🌍 Global Reach
- **850+ institutions** worldwide
- **1.2M+ learners** across the globe
- **Trusted Partners** including Chainfly and Reslink
- **Worldwide operations** with local expertise

**Contact us:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com) for detailed proposals.`
       };
    }
    
         // Enhanced AI-like responses with more natural language and context
     if (lowerMessage.includes("project") || lowerMessage.includes("marketplace")) {
       return {
         text: `# 🚀 AMOGH Marketplace - Innovation Hub

**Current Projects:** ${platformData.statistics.projects} active initiatives

## 🚀 Core Categories:

### 🤖 AI & Machine Learning
- Fraud detection systems (95% accuracy)
- Personalized chatbots and assistants
- Predictive analytics platforms
- Computer vision applications

### 🌱 Sustainability
- Solar community grids
- Clean water technologies
- Carbon capture solutions
- Smart agriculture systems

### 🏥 HealthTech
- Mental health platforms
- Patient monitoring systems
- Telemedicine solutions
- Medical AI diagnostics

### 💳 FinTech
- Personal finance trackers
- Blockchain solutions
- Payment processing systems
- Investment platforms

### 🎓 EdTech
- Learning management systems
- Skill development platforms
- Virtual reality education
- Adaptive learning algorithms

## 📋 Each project includes:
- Detailed requirements and specifications
- Budget and timeline information
- Collaboration opportunities
- Expert mentorship access
- Global team formation

**Ready to explore?** Browse projects by category or submit your own innovative idea!`
       };
    } else if (lowerMessage.includes("community") || lowerMessage.includes("join") || lowerMessage.includes("connect")) {
      return {
        text: `# 🌍 AMOGH Connect Community

## Global Network:
- ${platformData.statistics.users} active innovators
- ${platformData.statistics.globalCommunities} communities
- ${platformData.statistics.countries} countries represented
- 6 continents covered

## 🌟 Community Benefits:

### Expert Access
- Direct mentorship from industry leaders
- Networking with Fortune 500 executives
- Academic collaboration opportunities
- Government and NGO connections

### Collaboration
- Project team formation
- Joint venture opportunities
- Knowledge sharing platforms
- Resource pooling networks

### Recognition
- Innovation awards and certificates
- Featured project showcases
- Industry publication opportunities
- Speaking engagement invitations

## 📅 Engagement Channels:

### Virtual Platforms
- Discussion forums by interest area
- Webinar series and workshops
- Virtual networking events
- Online mentorship sessions

### Physical Events
- Global innovation summits
- Regional meetups and conferences
- Hackathons and competitions
- Industry-specific workshops

**Ready to join?** Start by creating your profile and exploring our community forums!`
      };
    } else if (lowerMessage.includes("career") || lowerMessage.includes("job") || lowerMessage.includes("opportunity")) {
      return {
        text: `# 💼 Career Opportunities at AMOGH Connect

## 🎯 Primary Pathways:

### Freelancing & Projects
- Work on cutting-edge global projects
- Flexible hours and remote options
- Competitive compensation rates
- Portfolio building opportunities

### Corporate Partnerships
- Consulting roles with major companies
- Strategic advisory positions
- Technology implementation roles
- Innovation management positions

### Academic Collaboration
- Research partnerships with universities
- Professor consulting opportunities
- Student internship programs
- Joint publication projects

### Startup Support
- Co-founder opportunities
- Technical advisory roles
- Investment and funding access
- Mentorship and guidance

## 🔥 Current Openings:

### AI & Technology
- AI Research Engineers
- Machine Learning Specialists
- Blockchain Developers
- Data Scientists

### Sustainability
- Environmental Engineers
- Green Technology Experts
- Carbon Reduction Specialists
- Renewable Energy Consultants

### Business & Strategy
- Innovation Consultants
- Business Development Managers
- Strategic Advisors
- Partnership Managers

## 💼 Advantages:
- Global networking opportunities
- Skill development through real projects
- Industry recognition and credibility
- Access to cutting-edge technologies

**Apply:** Send your resume to [careers@amogh.com](mailto:careers@amogh.com)`
      };
    } else if (lowerMessage.includes("sustainable") || lowerMessage.includes("eco") || lowerMessage.includes("green")) {
      return {
        text: `# 🌍 Sustainability at AMOGH Connect

## 🌍 Environmental Impact:
- **CO₂ Reduction:** ${platformData.statistics.co2Reduced} annually
- **Lives Improved:** ${platformData.statistics.livesImproved} worldwide
- **Active Solutions:** ${platformData.statistics.activeSolutions} implemented
- **Global Reach:** 6 continents, 45+ countries

## 🚀 Key Project Areas:

### Renewable Energy
- Solar community grids
- Wind power systems
- Hydroelectric solutions
- Geothermal technologies

### Smart Cities
- Urban green spaces
- Intelligent transportation
- Energy-efficient buildings
- Waste management systems

### Clean Water
- Water purification technologies
- Desalination systems
- Rainwater harvesting
- Water quality monitoring

### Carbon Capture
- Direct air capture
- Bioenergy with carbon capture
- Ocean-based solutions
- Industrial carbon reduction

### Agriculture
- Smart farming systems
- Vertical farming solutions
- Sustainable irrigation
- Crop optimization

## 🌱 Upcoming Initiatives:
- **Winter 2025:** New sustainable technology launch
- **2026:** Carbon-neutral operations target
- **2027:** 100% renewable energy goal

**Join our mission:** Contribute to a sustainable future through innovative projects!`
      };
    } else if (lowerMessage.includes("ai") || lowerMessage.includes("artificial intelligence") || lowerMessage.includes("machine learning")) {
      return {
        text: `# 🤖 AI & Machine Learning at AMOGH Connect

## 🤖 AI Agents Marketplace
**Development Status:** 85% complete

## Core AI Solutions:

### Market Analysis
- 95% accuracy in trend prediction
- Real-time market monitoring
- Automated reporting systems
- Risk assessment algorithms

### Personalized Education
- Adaptive learning pathways
- Individual skill assessment
- Customized content delivery
- Progress tracking systems

### Medical Diagnosis
- 40% error reduction vs. traditional methods
- Image recognition capabilities
- Symptom analysis algorithms
- Treatment recommendation systems

### Creative Collaboration
- AI-powered brainstorming tools
- Design optimization algorithms
- Content generation assistance
- Creative problem-solving support

### 24/7 Business Support
- Automated customer service
- Intelligent query routing
- Predictive maintenance alerts
- Performance optimization

## 🔬 Current AI Projects:

### Fraud Detection
- Real-time transaction monitoring
- Pattern recognition systems
- Behavioral analysis algorithms
- Risk scoring models

### Predictive Analytics
- Customer behavior prediction
- Market trend forecasting
- Resource optimization
- Demand planning systems

### Computer Vision
- Image and video analysis
- Object recognition systems
- Quality control automation
- Security monitoring

### Natural Language Processing
- Chatbot development
- Sentiment analysis
- Document processing
- Language translation

## 🚀 Early Access:
Register for AI marketplace launch notifications and exclusive beta testing opportunities!

**Contact:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)`
      };
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("assist")) {
      return {
        text: `# 🎯 How I Can Help You

## 🎯 Platform Navigation
- Course marketplace and project exploration
- AI learning agents and mentorship
- Expert consultation and networking
- Career and freelancing opportunities

## 📚 Knowledge Base
- Platform features and capabilities
- Learning path guidelines
- Community participation rules
- Technical support resources

## ⚡ Quick Actions
- Browse courses and projects
- Find expert mentors
- Join learning communities
- Access educational resources

## 👥 Human Support

### General Inquiries:
- **Email:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)
- **Response Time:** 2-4 hours

### Technical Support:
- **Email:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)
- **Response Time:** 1-2 hours

### Business Development:
- **Email:** [amogheveruseful@gmail.com](mailto:amogheveruseful@gmail.com)
- **Response Time:** 24-48 hours

## Office Location:
Connaught Place, Delhi-110001, India

## Social Media:
- **LinkedIn:** [AMOGH Ever Useful](https://www.linkedin.com/company/amogh-ever-useful/)
- **GitHub:** [HARSH6309](https://github.com/HARSH6309)
- **Instagram:** [@amoghever](https://www.instagram.com/amoghever/)

**What would you like to explore first?**`
      };
    } else if (lowerMessage.includes("website") || lowerMessage.includes("platform") || lowerMessage.includes("amogh")) {
      return {
        text: `# 🌐 AMOGH Platform Overview

## 🌐 What We Are:
AMOGH is a curated platform where innovation meets opportunity. We bring together talented student innovators, passionate researchers, experienced developers, and visionary investors — creating a collaborative ecosystem where bold ideas become real-world solutions.

## 🎯 Our Mission:
"Connect Innovation with Opportunity - Ever Useful"

## 📊 Platform Statistics:
- **Institutions:** ${platformData.statistics.globalCommunities} worldwide
- **Learners:** ${platformData.statistics.activeSolutions} across the globe
- **Users:** ${platformData.statistics.users} (Students, PhD holders, Professors, Businesses)
- **Partnerships:** ${platformData.statistics.partnerships} including Chainfly and Reslink
- **Global Reach:** ${platformData.statistics.countries} operations

## 🚀 Core Features:

### Learning Hub
- Course marketplace and project collaboration
- AI-powered learning agents
- Expert mentor connections
- Consultation scheduling

### Enterprise Solutions
- Expert consultation services
- Research freelancing opportunities
- Career advancement pathways
- Professional networking

### Platform Features
- Secure enterprise-grade platform
- AI-powered matching system
- Comprehensive mentorship programs
- Project management tools
- Learning resources and certifications
- 24/7 AI and human support

## 🌍 Global Impact:
- **Education:** Empowering students and researchers worldwide
- **Innovation:** Bridging the gap between talent and opportunity
- **Community:** Building global networks of innovators
- **Sustainability:** Supporting environmental and social initiatives

## 🏢 Trusted Partners:
- **Chainfly** - Solar Asset Management
- **Reslink** - Semiconductor Inventions

**Ready to explore?** Start your innovation journey with AMOGH!`
      };
         } else {
       return {
         text: `# Let's Explore AMOGH Together!

## 📊 Platform Overview:
- ${platformData.statistics.globalCommunities} institutions worldwide
- ${platformData.statistics.activeSolutions} learners across the globe
- ${platformData.statistics.users} (Students, PhD holders, Professors, Businesses)
- ${platformData.statistics.countries} operations

## 🎯 My Expertise Areas:
- **Learning Hub** - Course marketplace and AI learning agents
- **Enterprise Solutions** - Expert consultation and research freelancing
- **Platform Features** - Secure platform with AI matching and mentorship
- **Founder & Team** - Learn about our leadership and expertise
- **Services** - Understand our comprehensive offerings

## 💡 Popular Topics:
- How to access courses and projects
- Joining the learning community
- Finding expert mentors
- AI learning experiences
- Career opportunities
- Our team and leadership
- Platform features and security

**Could you provide more specific details about what interests you?** I'm here to guide your AMOGH journey!`
       };
    }
  }, [platformData.statistics, platformData.founder, platformData.team, platformData.services]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time with performance optimization
    const thinkingTime = 600 + Math.random() * 300; // Further reduced for better performance
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const botResponse: Message = {
        id: messages.length + 2,
        text: aiResponse.text,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, thinkingTime);
  }, [inputValue, messages.length, generateAIResponse]);

  const handleQuickReply = useCallback((reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSendMessage(), 100);
  }, [handleSendMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 h-[500px] md:w-96 md:h-[600px]">
      <Card className="w-full h-full bg-white border border-gray-200 shadow-lg relative overflow-hidden">
        {/* Professional header */}
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-800 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2 md:mr-3">
              <Brain className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm md:text-base">AMOGH Assistant</div>
              <div className="text-xs text-gray-500">AI-powered support</div>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-6 w-6 md:h-8 md:w-8 p-0 rounded-full"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-[calc(500px-60px)] md:h-[calc(600px-80px)] relative">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50">
            {messages.slice(-20).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-2 md:p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white ml-2 md:ml-4"
                      : "bg-white text-gray-800 mr-2 md:mr-4 border border-gray-200"
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "bot" && (
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <Brain className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                      </div>
                    )}
                                         <div className="flex-1">
                       <div className="text-xs md:text-sm leading-relaxed prose prose-sm max-w-none">
                         <Markdown
                           options={{
                             overrides: {
                               h1: { props: { className: "text-sm md:text-base font-bold mb-2 text-gray-800" } },
                               h2: { props: { className: "text-sm md:text-base font-bold mb-2 text-gray-800" } },
                               h3: { props: { className: "text-xs md:text-sm font-bold mb-1 text-gray-800" } },
                               h4: { props: { className: "text-xs md:text-sm font-semibold mb-1 text-gray-700" } },
                               h5: { props: { className: "text-xs font-semibold mb-1 text-gray-700" } },
                               ul: { props: { className: "list-disc list-inside ml-2 space-y-0.5" } },
                               li: { props: { className: "text-xs md:text-sm" } },
                               p: { props: { className: "text-xs md:text-sm mb-2" } },
                               strong: { props: { className: "font-semibold" } },
                               a: { props: { className: "text-blue-600 hover:text-blue-800 underline" } }
                             }
                           }}
                         >
                           {message.text}
                         </Markdown>
                       </div>
                       <span className="text-xs opacity-70 mt-1 md:mt-2 block">
                         {message.timestamp.toLocaleTimeString([], { 
                           hour: '2-digit', 
                           minute: '2-digit' 
                         })}
                       </span>
                     </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-2 md:p-3 rounded-lg mr-2 md:mr-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs md:text-sm text-gray-600">AI is thinking</div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-3 md:px-4 py-2 md:py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 mb-2 md:mb-3 font-medium">Quick actions:</div>
              <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-8 md:h-9"
                  onClick={() => handleQuickReply("Tell me about AMOGH projects")}
                >
                  <Briefcase className="w-3 h-3 mr-1 md:mr-2" />
                  Projects
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-8 md:h-9"
                  onClick={() => handleQuickReply("How to join the community?")}
                >
                  <Users className="w-3 h-3 mr-1 md:mr-2" />
                  Community
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-8 md:h-9"
                  onClick={() => handleQuickReply("What career opportunities are available?")}
                >
                  <Target className="w-3 h-3 mr-1 md:mr-2" />
                  Careers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-8 md:h-9"
                  onClick={() => handleQuickReply("Tell me about sustainable projects")}
                >
                  <Leaf className="w-3 h-3 mr-1 md:mr-2" />
                  Sustainability
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about AMOGH Connect..."
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 text-xs md:text-sm"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-2 md:px-3"
              >
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 