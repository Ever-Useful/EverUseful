"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Globe,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Award,
  MapPin,
  Play,
  ArrowRight,
  Edit,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react"

// const About = () => {
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [editingMember, setEditingMember] = useState<number | null>(null)
//   const [selectedMember, setSelectedMember] = useState<number | null>(null)
//   const [teamSlideIndex, setTeamSlideIndex] = useState(0)
//   const sliderRef = useRef<HTMLDivElement>(null)

//   const stats = [
//     { value: "75,000+", label: "Global Innovators", icon: Users },
//     { value: "150+", label: "Countries", icon: Globe },
//     { value: "2,500+", label: "Active Projects", icon: Lightbulb },
//     { value: "98%", label: "Success Rate", icon: Award },
//   ]

//   const companies = [
//     { name: "Google", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#4285F4" },
//     { name: "Microsoft", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#00A4EF" },
//     { name: "Apple", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#555555" },
//     { name: "Amazon", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#FF9900" },
//     { name: "Meta", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#1877F2" },
//     { name: "Tesla", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#E82127" },
//     { name: "Netflix", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#E50914" },
//     { name: "Spotify", logo: null, color: "bg-white", textColor: "text-gray-800", brandColor: "#1DB954" },
//   ]

//   const [team, setTeam] = useState([
//     {
//       id: 1,
//       name: "Sarah Chen",
//       role: "CEO & Founder",
//       image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
//       bio: "Former Silicon Valley executive with 15+ years in tech innovation.",
//       location: "San Francisco, CA",
//     },
//     {
//       id: 2,
//       name: "Alex Rodriguez",
//       role: "CTO & Co-Founder",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
//       bio: "MIT graduate and former Google engineer passionate about scalable platforms.",
//       location: "Boston, MA",
//     },
//     {
//       id: 3,
//       name: "Dr. Priya Sharma",
//       role: "Head of Innovation",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
//       bio: "PhD in Sustainable Technology with expertise in green innovation.",
//       location: "Mumbai, India",
//     },
//     {
//       id: 4,
//       name: "Marcus Johnson",
//       role: "Head of Community",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
//       bio: "Community building expert who has helped scale global networks.",
//       location: "London, UK",
//     },
//     {
//       id: 5,
//       name: "Lisa Wang",
//       role: "Head of Design",
//       image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
//       bio: "Award-winning designer with expertise in user experience.",
//       location: "Toronto, CA",
//     },
//     {
//       id: 6,
//       name: "David Kim",
//       role: "Head of Operations",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
//       bio: "Operations specialist focused on scaling global platforms.",
//       location: "Seoul, KR",
//     },
//   ])

//   const [tempMember, setTempMember] = useState({
//     name: "",
//     role: "",
//     image: "",
//     bio: "",
//     location: "",
//   })

//   // Auto-scroll for company slider
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % companies.length)
//     }, 3000)
//     return () => clearInterval(timer)
//   }, [companies.length])

//   const handleEditMember = (index: number) => {
//     setEditingMember(index)
//     setTempMember({ ...team[index] })
//   }

//   const handleSaveMember = (index: number) => {
//     const updatedTeam = [...team]
//     updatedTeam[index] = { ...tempMember, id: team[index].id }
//     setTeam(updatedTeam)
//     setEditingMember(null)
//     setTempMember({ name: "", role: "", image: "", bio: "", location: "" })
//   }

//   const handleCancelEdit = () => {
//     setEditingMember(null)
//     setTempMember({ name: "", role: "", image: "", bio: "", location: "" })
//   }

//   const handleAddMember = () => {
//     if (tempMember.name && tempMember.role) {
//       const newMember = {
//         ...tempMember,
//         id: Date.now(),
//         image:
//           tempMember.image ||
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
//       }
//       setTeam([...team, newMember])
//       setTempMember({ name: "", role: "", image: "", bio: "", location: "" })
//       setIsEditMode(false)
//     }
//   }

//   const handleRemoveMember = (id: number) => {
//     setTeam(team.filter((member) => member.id !== id))
//   }

//   const nextTeamSlide = () => {
//     setTeamSlideIndex((prev) => (prev + 1) % Math.ceil(team.length / 3))
//   }

//   const prevTeamSlide = () => {
//     setTeamSlideIndex((prev) => (prev === 0 ? Math.ceil(team.length / 3) - 1 : prev - 1))
//   }

//   const handleMemberClick = (index: number) => {
//     setSelectedMember(selectedMember === index ? null : index)
//   }

//   // Create a duplicate array of companies for continuous looping
//   const loopedCompanies = [...companies, ...companies]

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <Header />

//       {/* Hero Section with Enhanced Collage */}
//       <section className="relative bg-gradient-to-br from-stone-100 to-orange-50 py-20 lg:py-32">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//             <div>
//               <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">
//               </Badge>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//                 About AMOGH with <span className="text-orange-600">Innovation</span> and{" "}
//                 <span className="text-teal-600">Productivity</span>
//               </h1>
//               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
//                 Wherever you are should not be a factor in what you do. Brilliant well-being and productivity at your
//                 fingertips will change the way the world works.
//               </p>
//               <Button className="bg-blue-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
//                 Watch Our Platform Video
//                 <Play className="w-4 h-4 ml-2" />
//               </Button>
//             </div>

//             {/* Enhanced Image Collage */}
//             <div className="relative">
//               <div className="grid grid-cols-3 grid-rows-3 gap-5 h-[400px]">
//                 <div className="col-span-2 row-span-2">
//                   <img
//                     src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
//                     alt="Team collaboration"
//                     className="rounded-2xl shadow-lg w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="col-span-1 row-span-1">
//                   <img
//                     src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=200&fit=crop"
//                     alt="Team meeting"
//                     className="rounded-2xl shadow-lg w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="col-span-1 row-span-2">
//                   <img
//                     src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=400&fit=crop"
//                     alt="Developer working"
//                     className="rounded-2xl shadow-lg w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="col-span-1 row-span-1">
//                   <img
//                     src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop"
//                     alt="Innovation workspace"
//                     className="rounded-2xl shadow-lg w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="col-span-1 row-span-1">
//                   <img
//                     src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
//                     alt="Success celebration"
//                     className="rounded-2xl shadow-lg w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Moving Company Logo Slider with Continuous Loop */}
//       <section className="py-12 bg-white border-y border-gray-200">
//   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//     <p className="text-center text-gray-500 mb-8 font-medium">
//       Trusted by innovators from leading companies
//     </p>

//     <div className="overflow-hidden">
//       <div
//         className="flex transition-transform duration-1000 ease-in-out"
//         style={{ transform: `translateX(-${currentSlide * 12.5}%)` }}
//       >
//         {loopedCompanies.map((company, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 w-1/2 sm:w-1/4 md:w-1/6 lg:w-1/8 px-4"
//           >
//             <div className="text-center py-4">
//               <div className="flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
                
//                 {/* ✅ Company Logo */}
//                 <div 
//                   className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-md overflow-hidden border-2 hover:shadow-lg transition-all duration-300"
//                   style={{ borderColor: company.brandColor }}
//                 >
//                   {company.logo ? (
//                     <img
//                       src={company.logo}
//                       alt={company.name}
//                       className="w-full h-full object-contain"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div 
//                       className="w-full h-full flex items-center justify-center font-bold text-sm"
//                       style={{ color: company.brandColor }}
//                     >
//                       {company.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Company Name */}
//                 <span className="mt-2 text-sm font-medium text-gray-600">
//                   {company.name}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <stat.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
//                 <div className="text-gray-600 font-medium">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team Section as Slider */}
//       <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
            
//             </div>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Passionate innovators and experienced leaders working together to build the future of collaboration.
//             </p>
//           </div>

//           {/* Team Slider */}
//           <div className="relative">
//             {selectedMember === null ? (
//               <>
//                 <div className="overflow-hidden" ref={sliderRef}>
//                   <div
//                     className="flex transition-transform duration-500 ease-in-out"
//                     style={{ transform: `translateX(-${teamSlideIndex * 100}%)` }}
//                   >
//                     {Array.from({ length: Math.ceil(team.length / 3) }).map((_, pageIndex) => (
//                       <div key={pageIndex} className="flex-shrink-0 w-full">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                           {team.slice(pageIndex * 3, pageIndex * 3 + 3).map((member, index) => (
//                             <Card
//                               key={member.id}
//                               className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden relative cursor-pointer"
//                               onClick={() => handleMemberClick(pageIndex * 3 + index)}
//                             >
//                               {isEditMode && (
//                                 <div className="absolute top-4 right-4 z-10 flex gap-2">
//                                   <Button
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleEditMember(pageIndex * 3 + index)
//                                     }}
//                                     size="sm"
//                                     className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
//                                   >
//                                     <Edit className="w-3 h-3" />
//                                   </Button>
//                                   <Button
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleRemoveMember(member.id)
//                                     }}
//                                     size="sm"
//                                     className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
//                                   >
//                                     <X className="w-3 h-3" />
//                                   </Button>
//                                 </div>
//                               )}

//                               <CardContent className="p-0">
//                                 {editingMember === pageIndex * 3 + index ? (
//                                   <div className="p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
//                                     <Input
//                                       placeholder="Name"
//                                       value={tempMember.name}
//                                       onChange={(e) => setTempMember({ ...tempMember, name: e.target.value })}
//                                       className="border-gray-300"
//                                     />
//                                     <Input
//                                       placeholder="Role"
//                                       value={tempMember.role}
//                                       onChange={(e) => setTempMember({ ...tempMember, role: e.target.value })}
//                                       className="border-gray-300"
//                                     />
//                                     <Input
//                                       placeholder="Image URL"
//                                       value={tempMember.image}
//                                       onChange={(e) => setTempMember({ ...tempMember, image: e.target.value })}
//                                       className="border-gray-300"
//                                     />
//                                     <Textarea
//                                       placeholder="Bio"
//                                       value={tempMember.bio}
//                                       onChange={(e) => setTempMember({ ...tempMember, bio: e.target.value })}
//                                       className="border-gray-300 min-h-[80px]"
//                                     />
//                                     <Input
//                                       placeholder="Location"
//                                       value={tempMember.location}
//                                       onChange={(e) => setTempMember({ ...tempMember, location: e.target.value })}
//                                       className="border-gray-300"
//                                     />
//                                     <div className="flex gap-2">
//                                       <Button
//                                         onClick={() => handleSaveMember(pageIndex * 3 + index)}
//                                         size="sm"
//                                         className="bg-green-500 hover:bg-green-600 text-white flex-1"
//                                       >
//                                         <Save className="w-4 h-4 mr-2" />
//                                         Save
//                                       </Button>
//                                       <Button
//                                         onClick={handleCancelEdit}
//                                         size="sm"
//                                         variant="outline"
//                                         className="border-gray-300 flex-1"
//                                       >
//                                         Cancel
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <div className="relative">
//                                       <img
//                                         src={member.image || "/placeholder.svg"}
//                                         alt={member.name}
//                                         className="w-full h-64 object-cover"
//                                       />
//                                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
//                                         <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
//                                         <p className="text-orange-300 font-medium">{member.role}</p>
//                                       </div>
//                                       <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2">
//                                         <Info className="w-5 h-5 text-gray-600" />
//                                       </div>
//                                     </div>
//                                     <div className="p-6">
//                                       <p className="text-gray-600 text-sm mb-4 line-clamp-2">{member.bio}</p>
//                                       <div className="flex items-center text-gray-500 text-sm">
//                                         <MapPin className="w-4 h-4 mr-1" />
//                                         {member.location}
//                                       </div>
//                                     </div>
//                                   </>
//                                 )}
//                               </CardContent>
//                             </Card>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Slider Controls */}
//                 {team.length > 3 && (
//                   <div className="flex justify-center mt-8 gap-4">
//                     <Button
//                       onClick={prevTeamSlide}
//                       variant="outline"
//                       size="icon"
//                       className="rounded-full border-gray-300 hover:bg-gray-100"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </Button>
//                     <div className="flex gap-2">
//                       {Array.from({ length: Math.ceil(team.length / 3) }).map((_, i) => (
//                         <button
//                           key={i}
//                           className={`w-2 h-2 rounded-full ${
//                             i === teamSlideIndex ? "bg-teal-600" : "bg-gray-300"
//                           } transition-colors`}
//                           onClick={() => setTeamSlideIndex(i)}
//                         />
//                       ))}
//                     </div>
//                     <Button
//                       onClick={nextTeamSlide}
//                       variant="outline"
//                       size="icon"
//                       className="rounded-full border-gray-300 hover:bg-gray-100"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </Button>
//                   </div>
//                 )}

//                 {/* Add New Member Card */}
//                 {isEditMode && (
//                   <div className="mt-12">
//                     <Card className="bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-3xl overflow-hidden">
//                       <CardContent className="p-6 space-y-4">
//                         <div className="text-center py-8">
//                           <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Team Member</h3>
//                           <Input
//                             placeholder="Name"
//                             value={tempMember.name}
//                             onChange={(e) => setTempMember({ ...tempMember, name: e.target.value })}
//                             className="mb-3 border-gray-300"
//                           />
//                           <Input
//                             placeholder="Role"
//                             value={tempMember.role}
//                             onChange={(e) => setTempMember({ ...tempMember, role: e.target.value })}
//                             className="mb-3 border-gray-300"
//                           />
//                           <Input
//                             placeholder="Image URL (optional)"
//                             value={tempMember.image}
//                             onChange={(e) => setTempMember({ ...tempMember, image: e.target.value })}
//                             className="mb-3 border-gray-300"
//                           />
//                           <Textarea
//                             placeholder="Bio"
//                             value={tempMember.bio}
//                             onChange={(e) => setTempMember({ ...tempMember, bio: e.target.value })}
//                             className="mb-3 border-gray-300 min-h-[60px]"
//                           />
//                           <Input
//                             placeholder="Location"
//                             value={tempMember.location}
//                             onChange={(e) => setTempMember({ ...tempMember, location: e.target.value })}
//                             className="mb-4 border-gray-300"
//                           />
//                           <Button
//                             onClick={handleAddMember}
//                             className="bg-teal-500 hover:bg-teal-600 text-white w-full"
//                             disabled={!tempMember.name || !tempMember.role}
//                           >
//                             Add Member
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}
//               </>
//             ) : (
//               // Detailed Member View
//               <div className="max-w-4xl mx-auto">
//                 <Card className="bg-white border-0 shadow-xl rounded-3xl overflow-hidden">
//                   <CardContent className="p-0">
//                     <div className="grid grid-cols-1 md:grid-cols-2">
//                       <div className="relative h-full">
//                         <img
//                           src={team[selectedMember].image || "/placeholder.svg"}
//                           alt={team[selectedMember].name}
//                           className="w-full h-full object-cover min-h-[400px]"
//                         />
//                       </div>
//                       <div className="p-8">
//                         <Button
//                           onClick={() => setSelectedMember(null)}
//                           variant="outline"
//                           size="sm"
//                           className="absolute top-4 right-4 rounded-full border-gray-300"
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                         <h3 className="text-3xl font-bold text-gray-900 mb-2">{team[selectedMember].name}</h3>
//                         <p className="text-orange-500 font-medium text-lg mb-6">{team[selectedMember].role}</p>
//                         <div className="space-y-6">
//                           <div>
//                             <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
//                             <p className="text-gray-600 leading-relaxed">{team[selectedMember].bio}</p>
//                           </div>
//                           <div>
//                             <h4 className="text-lg font-semibold text-gray-900 mb-2">Location</h4>
//                             <div className="flex items-center text-gray-600">
//                               <MapPin className="w-5 h-5 mr-2 text-orange-500" />
//                               {team[selectedMember].location}
//                             </div>
//                           </div>
//                           <div className="pt-4">
//                             <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full">
//                               Contact {team[selectedMember].name.split(" ")[0]}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Success Section */}
//       <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//                 Our Success Depends on Our Customers Success.
//               </h2>
//               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
//                 We measure our achievements through the impact we create for our global community of innovators. Every
//                 successful project on our platform represents a step forward in solving real-world challenges.
//               </p>
//               <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full">
//                 View Success Stories
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </Button>
//             </div>
//             <div className="relative">
//               <img
//                 src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop"
//                 alt="Success celebration"
//                 className="rounded-3xl shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose AMOGH</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               The principles that guide everything we do and shape our community culture.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               { icon: Lightbulb, title: "Innovation First", color: "from-orange-400 to-red-400" },
//               { icon: Users, title: "Global Community", color: "from-teal-400 to-cyan-400" },
//               { icon: Target, title: "Results Driven", color: "from-purple-400 to-pink-400" },
//               { icon: Heart, title: "Purpose Focused", color: "from-green-400 to-teal-400" },
//             ].map((value, index) => (
//               <Card
//                 key={index}
//                 className="bg-stone-50 border-0 hover:shadow-lg transition-all duration-300 rounded-2xl"
//               >
//                 <CardContent className="p-8 text-center">
//                   <div
//                     className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
//                   >
//                     <value.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
//                   <p className="text-gray-600 leading-relaxed">
//                     Empowering innovation through collaborative excellence and meaningful impact.
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-500">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Mission?</h2>
//             <p className="text-xl text-orange-100 mb-8">
//               Be part of a global community that's shaping the future through innovation and collaboration.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 font-semibold rounded-full">
//                 Get Started Today
//               </Button>
//               <Button
//                 variant="outline"
//                 className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-full"
//               >
//                 Contact Us
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   )
// }

// // Helper function to get brand colors for company logos
// function getCompanyColor(name: string): string {
//   const colorMap: Record<string, string> = {
//     Google: "#4285F4",
//     Microsoft: "#00A4EF",
//     Apple: "#555555",
//     Amazon: "#FF9900",
//     Meta: "#1877F2",
//     Tesla: "#E82127",
//     Netflix: "#E50914",
//     Spotify: "#1DB954",
//     Adobe: "#FF0000",
//     Salesforce: "#00A1E0",
//     Uber: "#000000",
//     Airbnb: "#FF5A5F",
//     Stripe: "#6772E5",
//     Zoom: "#2D8CFF",
//     Slack: "#4A154B",
//     Dropbox: "#0061FF",
//   }

//   return colorMap[name] || "#333333"
// }

// export default About

import React from "react";

// const HeroSection = () => {
//   return (
//     <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Left side - Content */}
//           <div className="text-left space-y-6">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//               About Amogh
//             </h1>
//             <p className="text-xl sm:text-2xl text-blue-600 font-semibold">
//               Amogh is a curated platform where innovation meets opportunity.
//             </p>
//             <p className="text-lg text-gray-700 leading-relaxed">
//               Amogh is a unique platform that brings together talented student innovators, passionate researchers, 
//               experienced developers, and visionary investors — creating a collaborative ecosystem where bold ideas become real-world solutions.
//             </p>
//           </div>
          
//           {/* Right side - Images */}
//           <div className="relative">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Top image - spans full width */}
//               <div className="col-span-2">
//                 <img 
//                   src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
//                   alt="Team collaboration" 
//                   className="w-full h-48 object-cover rounded-2xl shadow-lg" 
//                 />
//               </div>
              
//               {/* Bottom left image */}
//               <div>
//                 <img 
//                   src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
//                   alt="Innovation workspace" 
//                   className="w-full h-40 object-cover rounded-2xl shadow-lg" 
//                 />
//               </div>
              
//               {/* Bottom right image */}
//               <div>
//                 <img 
//                   src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
//                   alt="Technology collaboration" 
//                   className="w-full h-40 object-cover rounded-2xl shadow-lg" 
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

