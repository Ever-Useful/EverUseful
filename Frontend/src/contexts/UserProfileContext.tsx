import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import userService from '@/services/userService';
import { setAuthCookie, getAuthCookie, deleteAuthCookie, setFirebaseRefreshCookie, getFirebaseRefreshCookie, deleteFirebaseRefreshCookie } from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/config/api';

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check both localStorage (for backward compatibility) and cookies
    const localLogin = localStorage.getItem("isLoggedIn") === "true";
    const cookieLogin = getAuthCookie() !== null;
    return localLogin || cookieLogin;
  });
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

  const refreshProfile = useCallback(async () => {
    // Prevent multiple simultaneous refreshes
    if (isLoading) return;
    
    // Clear any existing timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          console.log('No user found, clearing profile');
          clearProfile();
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const raw = await response.json();
          console.log('UserProfileContext - Profile data loaded:', raw);

          // Normalize to the shape Header expects
          const normalized = {
            firstName: raw?.data?.auth?.firstName || raw?.data?.profile?.firstName || '',
            lastName: raw?.data?.auth?.lastName || raw?.data?.profile?.lastName || '',
            avatar: raw?.data?.profile?.avatar || '',
            customUserId: raw?.data?.customUserId,
            userType: raw?.data?.auth?.userType,
            email: raw?.data?.auth?.email,
          };

          // Only update if data actually changed
          setProfileData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(normalized)) {
              return normalized;
            }
            return prevData;
          });

          // Cache the normalized profile data
          localStorage.setItem("userProfile", JSON.stringify(normalized));
          setHasRefreshed(true);
        } else {
          console.error('Failed to fetch profile:', response.status);
          // Don't clear profile on fetch failure, keep existing data
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
        // Don't clear profile on error, keep existing data
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 second debounce
    
    setRefreshTimeout(timeout);
  }, [isLoading]); // Only depend on isLoading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        
        // Set authentication cookies
        try {
          const token = await user.getIdToken();
          setAuthCookie(token);
          
          if (user.refreshToken) {
            setFirebaseRefreshCookie(user.refreshToken);
          }
        } catch (error) {
          console.error('Error setting auth cookies:', error);
        }
        
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
        deleteAuthCookie();
        deleteFirebaseRefreshCookie();
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
  }, []); // Remove refreshTimeout from dependencies

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