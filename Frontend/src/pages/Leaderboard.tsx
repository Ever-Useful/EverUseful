import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Header from '@/components/Header';
import { Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '@/config/api';

import goldenTrophy from '@/assets/images/goldenTrophy.png';
import silverTrophy from '@/assets/images/silverTrophy.png';
import brownTrophy from '@/assets/images/brownTrophy.png';


// --- INTERFACES ---
interface LeaderboardUser {
    customUserId: string;
    name: string;
    profilePicture?: string;
    userType: string;
    projects: number;
    views: number;
    rankingScore: number;
}

const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const trophyImages = ["https://amogh-assets.s3.ap-south-1.amazonaws.com/content/goldenTrophy_11zon.png", "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/silverTrophy_11zon.png", "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/brownTrophy_11zon.png"];

const Leaderboard = () => {
    const [activeMainFilter, setActiveMainFilter] = useState('Rank');
    const [activeTimeFilter, setActiveTimeFilter] = useState('24h');
    const [isMounted, setIsMounted] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [infoBanner, setInfoBanner] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger animations on component mount
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const url = API_ENDPOINTS.USER_LEADERBOARD;
            console.log('Fetching leaderboard data from:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Leaderboard data received:', result);
            
            if (result.success) {
                setLeaderboardData(result.data);
            } else {
                setError('Failed to fetch leaderboard data');
            }
        } catch (err) {
            console.error('Error fetching leaderboard data:', err);
            setError(`Failed to fetch leaderboard data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Sort once based on the active main filter (no time slicing)
    const sortedByMainFilter = React.useMemo(() => {
        const sorted = [...leaderboardData];
        switch (activeMainFilter) {
            case 'Projects':
                sorted.sort((a, b) => b.projects - a.projects);
                break;
            case 'Views':
                sorted.sort((a, b) => b.views - a.views);
                break;
            case 'Rank':
            default:
                sorted.sort((a, b) => b.rankingScore - a.rankingScore);
                break;
        }
        return sorted;
    }, [leaderboardData, activeMainFilter]);

    // Apply time-based view slicing on the already-sorted data
    const filteredLeaderboardData = React.useMemo(() => {
        const timeFilterFactors = {
            '24h': 0.2,
            '7D': 0.5,
            '30D': 1.0
        } as const;
        const factor = timeFilterFactors[activeTimeFilter as keyof typeof timeFilterFactors] || 1.0;
        const maxUsers = Math.ceil(sortedByMainFilter.length * factor);
        return sortedByMainFilter.slice(0, Math.max(0, maxUsers));
    }, [sortedByMainFilter, activeTimeFilter]);

    const { profileData, isLoggedIn } = useUserProfile();
    const currentUserId = (profileData as any)?.customUserId || (profileData as any)?.userId || (profileData as any)?.id;
    const currentUser = sortedByMainFilter.find(u => u.customUserId === currentUserId);
    const currentUserRank = sortedByMainFilter.findIndex(u => u.customUserId === currentUserId) + 1;
    
    const handleShowMyPlace = () => {
        if (!isLoggedIn) {
            navigate('/signin');
            return;
        }

        if (currentUser && currentUserRank > 0) {
            // Ensure the user is visible under current time filter; if not, expand to 30D first
            const isVisibleNow = !!document.querySelector(`[data-user-id="${currentUserId}"]`);
            if (!isVisibleNow && activeTimeFilter !== '30D') {
                setActiveTimeFilter('30D');
                // Defer scrolling to next paint after state update
                setTimeout(() => {
                    const rowAfterExpand = document.querySelector(`[data-user-id="${currentUserId}"]`);
                    if (rowAfterExpand) {
                        rowAfterExpand.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        rowAfterExpand.classList.add('bg-blue-100', 'ring-2', 'ring-blue-500');
                        setTimeout(() => {
                            rowAfterExpand.classList.remove('bg-blue-100', 'ring-2', 'ring-blue-500');
                        }, 3000);
                    }
                }, 50);
                return;
            }

            const userRow = document.querySelector(`[data-user-id="${currentUserId}"]`);
            if (userRow) {
                userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                userRow.classList.add('bg-blue-100', 'ring-2', 'ring-blue-500');
                setTimeout(() => {
                    userRow.classList.remove('bg-blue-100', 'ring-2', 'ring-blue-500');
                }, 3000);
            }
        } else {
            // If the user exists but has zero projects, show guidance; otherwise generic message
            if (profileData && currentUserId) {
                setInfoBanner('You are not ranked yet. Create your first project to get on the leaderboard.');
            } else {
                setInfoBanner('Sign in to see your position on the leaderboard.');
            }
        }
    };

    const handleUserClick = (user: LeaderboardUser) => {
        if (user.customUserId === currentUserId) {
            // Navigate to own profile
            navigate('/profile');
        } else {
            // Navigate to user's profile based on userType
            if (user.userType === 'freelancer') {
                navigate(`/freelancerprofile/${user.customUserId}`);
            } else {
                navigate(`/studentprofile/${user.customUserId}`);
            }
        }
    };

    const top3 = filteredLeaderboardData.slice(0, 3);
    const remainingUsers = filteredLeaderboardData.slice(3);

    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
    const getOriginalIndex = (customUserId: string) => top3.findIndex(u => u.customUserId === customUserId);


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200">
                <Header />
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto space-y-8 pt-16">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6">
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-slate-600">Loading leaderboard...</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200">
                <Header />
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto space-y-8 pt-16">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6">
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <Button onClick={fetchLeaderboardData} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200">
            <Header />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-8 pt-16">

                    <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6">
                        {infoBanner && (
                            <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-between">
                                <span className="text-sm">{infoBanner}</span>
                                <div className="flex gap-2">
                                    {isLoggedIn ? (
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/newproject')}>
                                            Create project
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => navigate('/signin')}>
                                            Sign in
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost" onClick={() => setInfoBanner(null)}>Dismiss</Button>
                                </div>
                            </div>
                        )}
                        {/* Filter Tabs and Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                    <Tabs value={activeMainFilter} onValueChange={setActiveMainFilter}>
                                    <TabsList className="bg-slate-200 p-0.5 rounded-md">
                                        {['Rank', 'Projects', 'Views'].map(filter => ( 
                                            <TabsTrigger key={filter} value={filter}
                                                className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                                    activeMainFilter === filter ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-100")}>
                                                {filter}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                {['24h', '7D', '30D'].map(time => (
                                    <Button key={time} variant={activeTimeFilter === time ? 'default' : 'outline'} size="sm" onClick={() => setActiveTimeFilter(time)}
                                        className={cn("rounded-full text-sm", activeTimeFilter === time ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-100 bg-white/50")}>
                                        {time}
                                    </Button>
                                ))}
                                <Button onClick={handleShowMyPlace} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm">
                                    Show my place
                                </Button>
                            </div>
                        </div>

                        {/* Animated Bar Chart for Top 3 (driven by selected metric) */}
                        <Card className="mb-8 p-6 bg-slate-50/80 rounded-lg">
                            <h3 className="text-lg font-semibold text-center mb-4 text-slate-800">Top 3 by {activeMainFilter}</h3>
                            {top3.length === 0 || top3.every(u => (activeMainFilter === 'Projects' ? u.projects : activeMainFilter === 'Views' ? u.views : u.rankingScore) === 0) ? (
                                <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
                                    No data to display yet for {activeMainFilter}.
                                </div>
                            ) : (
                            <div className="flex justify-center items-end h-56 border-b-2 border-slate-200 pb-2">
                                {podiumOrder.map((user) => {
                                    const metricValue = activeMainFilter === 'Projects' ? user.projects : activeMainFilter === 'Views' ? user.views : user.rankingScore;
                                    const maxMetric = Math.max(
                                        1,
                                        ...top3.map(u => activeMainFilter === 'Projects' ? u.projects : activeMainFilter === 'Views' ? u.views : u.rankingScore)
                                    );
                                    const rawPercent = (metricValue / maxMetric) * 100;
                                    // Prevent avatars from sitting too low: enforce a minimum height.
                                    // - If value is zero, show a small baseline height so avatar isn't at the very bottom.
                                    // - If value is non-zero but tiny, clamp to a reasonable minimum for visibility.
                                    const minPercentForZero = 14;   // keeps avatar visibly above the baseline
                                    const minPercentForNonZero = 24; // ensures small values still look decent
                                    const adjustedPercent = metricValue === 0
                                        ? minPercentForZero
                                        : Math.max(rawPercent, minPercentForNonZero);
                                    const height = isMounted ? `${adjustedPercent}%` : '0%';
                                    const originalIndex = getOriginalIndex(user.customUserId);
                                    const barColors = ['bg-yellow-400', 'bg-slate-400', 'bg-amber-800'];
                                    const barColor = barColors[originalIndex];

                                    return (
                                        <div key={user.customUserId} className="h-full flex flex-col justify-end items-center w-20">
                                            <div className="flex flex-col items-center w-full transition-all duration-1000 ease-in-out" style={{ height }}>
                                                <Avatar className="w-12 h-12 border-2 border-white shadow-lg cursor-pointer" onClick={() => handleUserClick(user)}>
                                                    <AvatarImage src={user.profilePicture} alt={user.name} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className={cn("w-full mt-1 flex-grow rounded-t-md", barColor)}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            )}
                            <div className="flex justify-center mt-2">
                                {podiumOrder.map(user => {
                                    const metricValue = activeMainFilter === 'Projects' ? `${user.projects} projects` : activeMainFilter === 'Views' ? `${user.views} views` : `Score ${user.rankingScore}`;
                                    return (
                                        <div key={user.customUserId} className="w-20 text-center px-1">
                                            <p className="font-semibold text-slate-800 text-xs truncate cursor-pointer hover:text-blue-600" onClick={() => handleUserClick(user)}>{user.name}</p>
                                            <p className="text-xs text-slate-600">{metricValue}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Animated Top 3 Podium Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {top3.map((user, index) => (
                                <Card key={user.customUserId}
                                    className={cn(
                                        "p-4 bg-slate-50/80 shadow-sm rounded-lg flex items-center justify-between transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer",
                                        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    )}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                    onClick={() => handleUserClick(user)}>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16 border-2 border-blue-400">
                                            <AvatarImage src={user.profilePicture} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-800 hover:text-blue-600">{user.name}</h3>
                                            {activeMainFilter === 'Rank' && (
                                                <p className="text-sm text-slate-600">Rank #{index + 1}</p>
                                            )}
                                            {activeMainFilter === 'Projects' && (
                                                <p className="text-sm text-slate-600">Projects: {user.projects}</p>
                                            )}
                                            {activeMainFilter === 'Views' && (
                                                <p className="text-sm text-slate-600 flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-500" />{user.views}</p>
                                            )}
                                        </div>
                                    </div>
                                    <img src={trophyImages[index]} alt={`Rank ${index + 1} trophy`} className="w-16 h-16" />
                                </Card>
                            ))}
                        </div>

                        {/* Remaining Users Table - show only the selected metric */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-blue-100/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">{activeMainFilter}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/0">
                                    {remainingUsers.map((user, index) => (
                                        <tr key={user.customUserId}
                                            data-user-id={user.customUserId}
                                            className={cn("transition-all duration-300 border-b border-slate-200/50 cursor-pointer",
                                                user.customUserId === currentUserId ? 'bg-blue-100/50' : 'hover:bg-slate-100/50',
                                                isMounted ? "opacity-100" : "opacity-0",
                                                "hover:!bg-slate-50/70 hover:shadow-md"
                                            )}
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                            onClick={() => handleUserClick(user)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {activeMainFilter === 'Rank' ? index + 4 : activeMainFilter === 'Projects' ? user.projects : user.views}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Avatar className="w-8 h-8 mr-3">
                                                        <AvatarImage src={user.profilePicture} alt={user.name} />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium text-slate-900 hover:text-blue-600">{user.name}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentUser && currentUserRank > 3 && (
                                        <tr data-user-id={currentUser.customUserId} className="bg-blue-200/80 border-t-2 border-blue-300 cursor-pointer" onClick={() => handleUserClick(currentUser)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">{activeMainFilter === 'Rank' ? currentUserRank : activeMainFilter === 'Projects' ? currentUser.projects : currentUser.views}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Avatar className="w-8 h-8 mr-3 border-2 border-blue-500">
                                                        <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                                                        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-bold text-blue-800 hover:text-blue-600">{currentUser.name} (You)</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;