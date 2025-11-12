import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { socket } from '@/socket';
import userService from '@/services/userService'; 
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Register this user in socket.io backend with their customUserId
        try {
          const userData = await userService.findUserByFirebaseUid(firebaseUser.uid);
          if (userData?.customUserId && socket) {
            socket.emit("register", userData.customUserId);
            console.log("Registered user with socket:", userData.customUserId);
          } else {
            console.warn("Could not register socket - user data or customUserId not found");
          }
        } catch (error) {
          console.error("Failed to register socket:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 