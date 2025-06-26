import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import mainVideo from "@/assets/videos/promotion.mp4";
import bgImage from "@/assets/images/howitworks.jpg";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export const HowItWorks2: React.FC<{ deferVideo?: boolean }> = ({ deferVideo = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true);
    const [playVideo, setPlayVideo] = useState(!deferVideo);

    const handleMuteToggle = () => {
        setMuted((prev) => {
            if (videoRef.current) {
                videoRef.current.muted = !prev;
            }
            return !prev;
        });
    };

    return (
        <section id="how-it-works" className=" px-4 sm:px-6 lg:px-8 bg-blue-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 items-center">
                    {/* Left Column - Heading and Steps */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                            <p className="text-lg sm:text-xl text-gray-600">Get started in three simple steps</p>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { step: "01", title: "Build Your Profile", desc: "Sign up and showcase your skills, projects, and expertise to potential partners." },
                                { step: "02", title: "Submit Projects", desc: "Upload your innovative projects with detailed descriptions and set your pricing." },
                                { step: "03", title: "Connect & Earn", desc: "Get matched with enterprises, collaborate, and start earning from your knowledge." }
                            ].map((item, index) => (
                                <div key={index} className="flex space-x-6 items-start group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Full Height Background with Video */}
                    <div className="relative h-full min-h-[500px] md:min-h-[600px]">
                        <div 
                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${bgImage})` }}
                        >
                            <div className="absolute inset-0 bg-black/30" />
                        </div>
                        
                        <div className="relative h-full flex items-center justify-center p-8">
                            <div className="video-shadow-wrap w-full max-w-md">
                                <video
                                    ref={videoRef}
                                    src={mainVideo}
                                    autoPlay={playVideo}
                                    loop
                                    muted={muted}
                                    playsInline
                                    className="w-full h-auto max-h-[400px] object-cover bg-black rounded-2xl relative z-10"
                                />
                                {/* Mute/Unmute Button */}
                                <button
                                    onClick={handleMuteToggle}
                                    className="absolute bottom-4 right-4 bg-black/70 text-white rounded-full p-2 shadow-lg z-20"
                                    aria-label={muted ? "Unmute video" : "Mute video"}
                                >
                                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                            <Button
                                size="lg"
                                className="px-6 py-3 bg-white text-black hover:bg-blue-600 hover:text-white shadow-lg transition-all duration-300 flex items-center font-semibold rounded-full"
                            >
                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};