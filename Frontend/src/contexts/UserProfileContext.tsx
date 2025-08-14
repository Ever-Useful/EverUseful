import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import userService from '@/services/userService';

interface UserProfile {
  firstName: string;
  lastName: string;
  avatar: string;
  customUserId?: string;
  userType?: string;
  email?: string;
}

interface UserProfileContextType {
  profileData: UserProfile;
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [profileData, setProfileData] = useState<UserProfile>(() => {
    // Initialize from localStorage if available
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        return JSON.parse(storedProfile);
      } catch (error) {
        console.error('Error parsing stored profile:', error);
      }
    }
    return { firstName: '', lastName: '', avatar: '' };
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateProfile = (data: Partial<UserProfile>) => {
    const newProfile = { ...profileData, ...data };
    setProfileData(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfileData({ firstName: '', lastName: '', avatar: '' });
    localStorage.removeItem("userProfile");
  };

  const refreshProfile = async () => {
    if (!isLoggedIn || hasRefreshed) return;
    
    // Clear any existing timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    // Set a new timeout to debounce rapid calls
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const userProfile = await userService.getUserProfile();
        const newProfileData = {
          firstName: userProfile.data?.auth?.firstName || '',
          lastName: userProfile.data?.auth?.lastName || '',
          avatar: userProfile.data?.profile?.avatar || '',
          customUserId: userProfile.data?.customUserId,
          userType: userProfile.data?.auth?.userType,
          email: userProfile.data?.auth?.email,
        };
        setProfileData(newProfileData);
        localStorage.setItem("userProfile", JSON.stringify(newProfileData));
        setHasRefreshed(true);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 second debounce
    
    setRefreshTimeout(timeout);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        
        // Check if we have cached profile data
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          try {
            const parsedProfile = JSON.parse(cachedProfile);
            setProfileData(parsedProfile);
            // Don't refresh if we have cached data
            setHasRefreshed(true);
          } catch (error) {
            console.error('Error parsing cached profile:', error);
            // Only refresh if cached data is invalid
            setHasRefreshed(false);
          }
        } else {
          // Only refresh if no cached data
          setHasRefreshed(false);
        }
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        clearProfile();
        setHasRefreshed(false);
      }
    });

    return () => {
      unsubscribe();
      // Clean up timeout on unmount
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshTimeout]);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loginStatus);
      
      if (!loginStatus) {
        clearProfile();
      } else {
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          try {
            const parsedProfile = JSON.parse(cachedProfile);
            setProfileData(parsedProfile);
          } catch (error) {
            console.error('Error parsing cached profile:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: UserProfileContextType = {
    profileData,
    isLoading,
    isLoggedIn,
    refreshProfile,
    updateProfile,
    clearProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}; 