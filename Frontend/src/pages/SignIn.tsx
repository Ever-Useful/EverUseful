import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowRight, Sparkles, Star, Users, BookOpen, Building2, Github, Linkedin, Shield, Smartphone, Mail, Check, Phone, Clock } from "lucide-react";
import { auth, handleGithubAuth, handleGoogleAuth, loginWithEmailPassword, sendPhoneOTP, verifyPhoneOTP, resetPassword } from "@/lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";
import userService from '@/services/userService';
import Logo from '../assets/Logo/Logo Side.png'
import { API_ENDPOINTS } from "@/config/api";

// Extend the Window interface to include confirmationResult
declare global {
  interface Window {
    confirmationResult: any; // You can specify a more precise type if needed
    recaptchaVerifier: RecaptchaVerifier | null;
    recaptchaWidgetId: number;
  }
}
//added a comment
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMethod, setMfaMethod] = useState("authenticator");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPasswordOTP, setShowForgotPasswordOTP] = useState(false);
  const [forgotPasswordOTP, setForgotPasswordOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New states for mobile authentication
  const [authMethod, setAuthMethod] = useState("email");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [hasAttemptedOTP, setHasAttemptedOTP] = useState(false);

  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  // Helper function to handle Firebase rate limiting errors
  const handleFirebaseRateLimitError = (error: any, now: number) => {
    if (error.code === 'auth/too-many-requests') {
      setLastOtpRequestTime(now);
      setOtpCountdown(300); // 5 minutes cooldown for Firebase rate limiting
      setError('Too many requests. Please wait 5 minutes before trying again.');
    } else if (error.code === 'auth/quota-exceeded') {
      setError('Daily quota exceeded. Please try again tomorrow.');
    } else {
      setError(error.message || "Failed to send OTP. Please try again.");
    }
  };
  const [lastOtpRequestTime, setLastOtpRequestTime] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for cycling through user types
  const [currentUserTypeIndex, setCurrentUserTypeIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Control Firebase phone test mode via env, do not disable in production
  useEffect(() => {
    const useTestPhones = import.meta.env.VITE_USE_TEST_PHONE === 'true';
    if (useTestPhones) {
      auth.settings.appVerificationDisabledForTesting = true;
    } else {
      auth.settings.appVerificationDisabledForTesting = false as any;
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    if (section === 'forgot-password') {
      setShowForgotPassword(true);
    }
  }, [location.search]);

  // Effect to cycle through user types every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUserTypeIndex((prevIndex) => (prevIndex + 1) % userTypes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  // Handle OTP countdown timer
  useEffect(() => {
    if (lastOtpRequestTime > 0 || otpCountdown > 0) {
      const timer = setInterval(() => {
        const now = Date.now();
        const timeSinceLastRequest = now - lastOtpRequestTime;
        const remainingTime = Math.max(0, 60000 - timeSinceLastRequest);
        
        // Stop countdown if mobile OTP is shown or if time is up
        if (remainingTime <= 0 || showMobileOTP) {
          setOtpCountdown(0);
          clearInterval(timer);
        } else if (otpCountdown > 0) {
          setOtpCountdown(prev => Math.max(0, prev - 1));
        } else {
          setOtpCountdown(Math.ceil(remainingTime / 1000));
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lastOtpRequestTime, otpCountdown, showMobileOTP]);
  
  // Stop countdown when mobile OTP is shown
  useEffect(() => {
    if (showMobileOTP) {
      setOtpCountdown(0);
    }
  }, [showMobileOTP]);
  
  // Stop countdown when user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setOtpCountdown(0);
    }
  }, []);
  
  // Stop countdown when component unmounts
  useEffect(() => {
    return () => {
      setOtpCountdown(0);
    };
  }, []);

  const userTypes = [
    {
      id: "student",
      label: "Student",
      icon: BookOpen,
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      gradient: "from-blue-50 to-cyan-50",
      description: "Access course projects and collaborate with peers",
      features: ["Project repositories", "Peer collaboration", "Academic resources"]
    },
    {
      id: "professor",
      label: "Professor",
      icon: Star,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      gradient: "from-purple-50 to-pink-50",
      description: "Manage courses and mentor student projects",
      features: ["Course management", "Student mentoring", "Research collaboration"]
    },
    {
      id: "business",
      label: "Business",
      icon: Building2,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      gradient: "from-green-50 to-emerald-50",
      description: "Connect with talent and sponsor innovative projects",
      features: ["Talent recruitment", "Project sponsorship", "Industry partnerships"]
    },
  ];

  const currentUserType = userTypes[currentUserTypeIndex];

  const mfaMethods = [
    { id: "authenticator", label: "Authenticator App", icon: Smartphone, description: "Use your authenticator app" },
    { id: "sms", label: "SMS Code", icon: Mail, description: "Receive code via SMS" },
    { id: "email", label: "Email Code", icon: Mail, description: "Receive code via email" },
  ];

  const countryCodes = [
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
  ];

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const idToken = await loginWithEmailPassword(email, password);

      // Only fetch user profile, do not try to create
      let backendUser = null;
      try {
        backendUser = await userService.getUserProfile();
      } catch (error: any) {
        if (error.message === 'User not found') {
          setError('No account found, please sign up first.');
          setIsLoading(false);
          return;
        } else {
          throw error;
        }
      }

      // User data is now saved in DynamoDB via backend
      const user = auth.currentUser;
      
      // Stop countdown when sign in is successful
      setOtpCountdown(0);
      
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userType", userType);
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email. Please sign up first.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else if (error.message === 'User not found') {
        setError('No account found, please sign up first.');
      } else {
        setError("An error occurred during sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    // Enhanced rate limiting: prevent requests more frequently than every 60 seconds
    const now = Date.now();
    const timeSinceLastRequest = now - lastOtpRequestTime;
    const minInterval = 60000; // 60 seconds
    
    if (timeSinceLastRequest < minInterval) {
      const remainingTime = Math.ceil((minInterval - timeSinceLastRequest) / 1000);
      setError(`Please wait ${remainingTime} seconds before requesting another OTP.`);
      return;
    }

    // Additional check for Firebase rate limiting
    if (otpCountdown > 0) {
      setError(`Please wait ${otpCountdown} seconds before requesting another OTP.`);
      return;
    }

    // Check if mobile number is valid
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Clear any existing reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Create a new reCAPTCHA verifier
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log("reCAPTCHA verified");
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
          setRecaptchaInitialized(false);
        },
        'error-callback': () => {
          console.log("reCAPTCHA error");
          setRecaptchaInitialized(false);
        }
      });

      window.recaptchaVerifier = verifier;

      // Wait for reCAPTCHA to be ready and verify to get a fresh token
      await verifier.render();
      await verifier.verify();
      setRecaptchaInitialized(true);

      // Send OTP using the verified app verifier
      const confirmationResult = await sendPhoneOTP(countryCode + mobileNumber, verifier);
      window.confirmationResult = confirmationResult;
      console.log("OTP sent successfully");
      setShowMobileOTP(true);
      setHasAttemptedOTP(true);
      setError(null); // Clear any previous errors
      // Start cooldown only after successful send
      setLastOtpRequestTime(Date.now());
    } catch (error: any) {
      console.error("Error in sendOtp:", error);
      setRecaptchaInitialized(false);
      
      if (error.code === 'auth/invalid-app-credential') {
        setError('App verification failed. Please refresh and try again.');
      } else if (error.code === 'auth/captcha-check-failed') {
        setError('Verification failed. Please try again.');
        // Re-initialize reCAPTCHA after a delay
        setTimeout(() => {
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
          setRecaptchaInitialized(false);
        }, 1000);
      } else if (error.code === 'auth/too-many-requests') {
        // Set a longer cooldown for too-many-requests error
        setLastOtpRequestTime(now);
        setOtpCountdown(120); // 2 minutes cooldown
        setError('Too many requests. Please wait 2 minutes before trying again.');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('Daily quota exceeded. Please try again tomorrow.');
      } else {
        setError(error.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const confirmationResult = window.confirmationResult;
      
      if (!confirmationResult) {
        setError("No verification session found. Please request a new OTP.");
        return;
      }

      const result = await confirmationResult.confirm(mobileOTP);
      console.log("OTP verified successfully", result);
      
      // Stop countdown when OTP is verified
      setOtpCountdown(0);
      
      // Check if user exists in the system and hydrate profile for header/sidebar
      try {
        // Try to get user profile to see if they exist
        const token = await result.user.getIdToken();
        const backendUser = await userService.getUserProfile();
        
        // User exists, proceed with sign in
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userPhone", countryCode + mobileNumber);
        
        // Set user data from backend if available
        if (backendUser?.data?.auth) {
          const firstName = backendUser.data.auth.firstName || backendUser.data.profile?.firstName || '';
          const lastName = backendUser.data.auth.lastName || backendUser.data.profile?.lastName || '';
          localStorage.setItem("userType", backendUser.data.auth.userType || "");
          localStorage.setItem("userName", `${firstName} ${lastName}`.trim());
          localStorage.setItem("userFirstName", firstName);
          localStorage.setItem("userLastName", lastName);
          localStorage.setItem("userEmail", backendUser.data.auth.email || "");
          // Cache normalized profile for header/UserProfileContext
          const normalized = {
            firstName,
            lastName,
            avatar: backendUser.data.profile?.avatar || '',
            customUserId: backendUser.data.customUserId,
            userType: backendUser.data.auth.userType,
            email: backendUser.data.auth.email,
          };
          try { localStorage.setItem("userProfile", JSON.stringify(normalized)); } catch {}
        }
        
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } catch (profileError: any) {
        if (profileError.message === 'User not found') {
          // User doesn't exist, redirect to signup
          setError('No account found with this phone number. Please sign up first.');
          setTimeout(() => {
            navigate('/signup');
          }, 2000);
        } else {
          // Other error, but OTP is verified
          console.error("Error fetching user profile:", profileError);
          setError("Phone verified but couldn't load profile. Please try signing in with email.");
        }
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      if (error.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please check and try again.");
      } else if (error.code === 'auth/code-expired') {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        // Email verification will be handled by the backend
        console.log("User signed in successfully");
        console.log("Verification code sent to user's email");
      } else if (!user) {
        console.error("No user found");
      } else {
        console.log("User already verified. No email sent.");
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error.message);
    }
  };

  // Function to switch authentication methods
  const switchAuthMethod = (method: string) => {
    setAuthMethod(method);
    setError(null);
    setMobileOTP('');
    setShowMobileOTP(false);
    setHasAttemptedOTP(false);
    
    // Clear any existing OTP countdown when switching methods
    if (method === 'email') {
      setOtpCountdown(0);
      setLastOtpRequestTime(0);
    }
  };

  // Check if phone number is already registered
  const checkPhoneRegistration = async (phoneNumber: string) => {
    try {
      // Call backend to check if phone number is registered
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/users/check-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.exists; // Backend should return { exists: true/false }
      }
      
      // If backend check fails, assume phone exists to allow the flow
      return true;
    } catch (error) {
      console.error("Error checking phone registration:", error);
      // If check fails, assume phone exists to allow the flow
      return true;
    }
  };

  const handleMobileSignIn = async () => {
    // Use the same rate limiting logic as sendOtp
    const now = Date.now();
    const timeSinceLastRequest = now - lastOtpRequestTime;
    const minInterval = 60000; // 60 seconds
    
    if (timeSinceLastRequest < minInterval) {
      const remainingTime = Math.ceil((minInterval - timeSinceLastRequest) / 1000);
      setError(`Please wait ${remainingTime} seconds before requesting another OTP.`);
      return;
    }

    if (otpCountdown > 0) {
      setError(`Please wait ${otpCountdown} seconds before requesting another OTP.`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Skip backend phone registration check; rely on Firebase Auth linking

      if (!recaptchaInitialized) {
        await sendOtp();
      } else {
        // Ensure existing verifier has a fresh token
        try { await window.recaptchaVerifier!.verify(); } catch {}
        const confirmationResult = await sendPhoneOTP(countryCode + mobileNumber, window.recaptchaVerifier!);
        window.confirmationResult = confirmationResult;
        console.log("OTP sent successfully");
        setShowMobileOTP(true);
        setHasAttemptedOTP(true);
        setError(null); // Clear any previous errors
        // Start cooldown only after successful send
        setLastOtpRequestTime(Date.now());
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setRecaptchaInitialized(false);
      
      if (error.code === 'auth/invalid-app-credential') {
        setError('App verification failed. Please refresh and try again.');
      } else if (error.code === 'auth/captcha-check-failed') {
        setError('Verification failed. Please try again.');
        // Re-initialize reCAPTCHA after a delay
        setTimeout(() => {
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
          setRecaptchaInitialized(false);
        }, 1000);
      } else if (error.code === 'auth/too-many-requests') {
        // Set a longer cooldown for too-many-requests error
        setLastOtpRequestTime(now);
        setOtpCountdown(120); // 2 minutes cooldown
        setError('Too many requests. Please wait 2 minutes before trying again.');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('Daily quota exceeded. Please try again tomorrow.');
      } else {
        setError(error.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileOTPVerify = async () => {
    await verifyOtp();
  };

  const handleMFAVerify = () => {
    console.log("MFA verified:", mfaCode);
    // Handle successful sign in
    // Stop countdown when MFA is verified
    setOtpCountdown(0);
    // Navigate to dashboard
    navigate("/");
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      await resetPassword(forgotPasswordEmail);
      // Show success message
      alert("Password reset link has been sent to your email. Please check your inbox.");
      // Reset the form
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      // Stop countdown when forgot password is successful
      setOtpCountdown(0);
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      alert(error.message || "Failed to send password reset email. Please try again.");
    }
  };

  const handleForgotPasswordOTPVerify = () => {
    console.log("OTP verified:", forgotPasswordOTP);
    // Handle password reset
    if (newPassword === confirmPassword) {
      console.log("Password reset successful");
      // Stop countdown when password reset is successful
      setOtpCountdown(0);
      // Reset to initial state
      setShowForgotPassword(false);
      setShowForgotPasswordOTP(false);
      setForgotPasswordEmail("");
      setForgotPasswordOTP("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    } else {
      setError("Passwords do not match");
    }
  };

  const resetToSignIn = () => {
    setShowMFA(false);
    setShowForgotPassword(false);
    setShowForgotPasswordOTP(false);
    setShowMobileOTP(false);
    setMobileOTP("");
    setMfaCode("");
    setForgotPasswordEmail("");
    setForgotPasswordOTP("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    // Stop countdown when form is reset
    setOtpCountdown(0);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop countdown when auth is successful
      setOtpCountdown(0);
      
      await handleGoogleAuth(navigate, userType);
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop countdown when auth is successful
      setOtpCountdown(0);
      
      await handleGithubAuth(navigate, userType);
    } catch (error: any) {
      console.error("GitHub sign-in failed:", error);
      setError("GitHub sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-2 xs:p-4 relative overflow-hidden">
      <div className="w-full max-w-7xl relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 xs:gap-8">
          {/* Left side - Sign in form */}
          <div className="order-2 lg:order-1 w-full">
            <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-300">
              <CardHeader className="text-center pb-4 xs:pb-6">
                <CardTitle className="font-bold text-gray-900">
                  {showForgotPassword ? "Reset Password" : "Sign In"}
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm lg:text-base text-gray-600">
                  {showForgotPassword
                    ? "Enter your email to receive a verification code"
                    : "Enter your credentials to access your account"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 xs:space-y-6">
                {!showMFA && !showForgotPassword && !showMobileOTP ? (
                  <>
                    {/* Authentication Method Selection */}
                    <div className="space-y-2 lg:space-y-3">
                      <Label className="text-gray-700 font-medium">Sign in with:</Label>
                      <RadioGroup
                        value={authMethod}
                        onValueChange={(value) => {
                          switchAuthMethod(value);
                        }}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email-auth" />
                          <Label htmlFor="email-auth" className="flex items-center space-x-2 cursor-pointer">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobile" id="mobile-auth" />
                          <Label htmlFor="mobile-auth" className="flex items-center space-x-2 cursor-pointer">
                            <Phone className="w-4 h-4" />
                            <span>Mobile</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {authMethod === "email" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {error && authMethod === "email" && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <Label htmlFor="remember" className="text-sm text-gray-600">
                              Remember me
                            </Label>
                          </div>
                          <button
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium text-left sm:text-right"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Button
                          onClick={handleSignIn}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                          disabled={!email || !password || isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                          {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                            <p className="text-xs text-gray-500 mt-1">We'll send you a verification code</p>
                          </div>
                          <div className="flex space-x-2">
                            <Select value={countryCode} onValueChange={setCountryCode}>
                              <SelectTrigger className="w-[60px] sm:w-[80px] h-12 border-2 border-gray-200 focus:border-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    <div className="flex items-center space-x-2">
                                      <span className="hidden sm:inline">{country.code}</span>
                                      <span className="sm:hidden">{country.code}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              id="mobile"
                              type="tel"
                              placeholder="Enter your mobile number"
                              value={mobileNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 10) {
                                  setMobileNumber(value);
                                }
                              }}
                              maxLength={10}
                              className={`flex-1 h-12 text-base transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-2 border-gray-200 focus:border-blue-500 ${
                                mobileNumber.length === 10 ? 'border-green-500 bg-green-50' : ''
                              }`}
                            />
                          </div>
                          {mobileNumber.length > 0 && mobileNumber.length < 10 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Please enter a valid 10-digit mobile number
                            </p>
                          )}
                          {mobileNumber.length === 10 && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <Check className="w-3 h-3" />
                              <span>Valid mobile number</span>
                            </div>
                          )}
                        </div>

                        {error && authMethod === "mobile" && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <Button
                          onClick={handleMobileSignIn}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] group shadow-lg h-12 text-base font-semibold"
                          disabled={!mobileNumber || mobileNumber.length < 10 || isLoading || otpCountdown > 0}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending verification code...
                            </div>
                          ) : otpCountdown > 0 ? (
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 mr-2" />
                              Wait {otpCountdown} seconds
                            </div>
                          ) : (
                            <>
                              {hasAttemptedOTP ? 'Resend Code' : 'Send Verification Code'}
                              <Phone className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                            </>
                          )}
                        </Button>
                        
                      </>
                    )}
                  </>
                ) : showMobileOTP ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Header Section */}
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Enter Verification Code</h3>
                        <p className="text-sm font-medium text-gray-800">{countryCode} {mobileNumber}</p>
                      </div>
                    </div>

                    {/* OTP Input Section */}
                    <div className="space-y-4">
                      <div className="space-y-3 flex flex-col items-center">
                        <InputOTP
                          maxLength={6}
                          value={mobileOTP}
                          onChange={(value) => setMobileOTP(value)}
                          className="justify-center gap-2"
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            <InputOTPSlot index={1} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            <InputOTPSlot index={2} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            <InputOTPSlot index={3} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            <InputOTPSlot index={4} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            <InputOTPSlot index={5} className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      {/* Resend Section */}
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-1 text-sm">
                          <span className="text-gray-600">Didn't receive the code?</span>
                          <button
                            onClick={handleMobileSignIn}
                            disabled={otpCountdown > 0}
                            className={`font-medium transition-colors ${
                              otpCountdown > 0 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend OTP'}
                          </button>
                        </div>
                      
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleMobileOTPVerify}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] group shadow-lg h-12 text-base font-semibold"
                        disabled={mobileOTP.length !== 6}
                      >
                        {mobileOTP.length === 6 ? (
                          <>
                            Verify & Sign In
                            <Check className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                          </>
                        ) : (
                          'Enter 6-digit code'
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={resetToSignIn}
                        className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 h-10"
                      >
                        ← Back to Sign In
                      </Button>
                    </div>
                  </div>
                ) : showForgotPassword ? (
                  <div className="space-y-4 lg:space-y-6 animate-fade-in">
                    {!showForgotPasswordOTP ? (
                      <>
                        <div className="text-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                            <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Reset Your Password</h3>
                          <p className="text-sm text-gray-600">We'll send you a password reset link to your email</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="forgotEmail" className="text-gray-700 font-medium">Email Address</Label>
                          <Input
                            id="forgotEmail"
                            type="email"
                            placeholder="your.email@example.com"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <Button
                          onClick={handleForgotPasswordSubmit}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                          disabled={!forgotPasswordEmail}
                        >
                          Send Reset Link
                          <Mail className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                            <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h3>
                          <p className="text-sm text-gray-600">Code sent to {forgotPasswordEmail}</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">Verification Code</Label>
                          <InputOTP
                            maxLength={6}
                            value={forgotPasswordOTP}
                            onChange={(value) => setForgotPasswordOTP(value)}
                            className="justify-center"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleForgotPasswordOTPVerify}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                          disabled={forgotPasswordOTP.length !== 6 || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        >
                          Reset Password
                          <Check className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      onClick={resetToSignIn}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-6 animate-fade-in">
                    <div className="text-center">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                        <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Multi-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Choose How You Want to Authenticate Yourself Next Time</p>
                    </div>

                    <div className="grid gap-3">
                      {mfaMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setMfaMethod(method.id)}
                            className={`p-3 lg:p-4 rounded-lg border-2 text-left transition-all duration-300 ${mfaMethod === method.id
                                ? "border-blue-500 bg-blue-50 scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:scale-102"
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                              <div>
                                <div className="text-sm lg:text-base font-medium text-gray-900">{method.label}</div>
                                <div className="text-xs lg:text-sm text-gray-600">{method.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Enter verification code</Label>
                      <InputOTP
                        maxLength={6}
                        value={mfaCode}
                        onChange={(value) => setMfaCode(value)}
                        className="justify-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      onClick={handleMFAVerify}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                      disabled={mfaCode.length !== 6}
                    >
                      Verify & Sign In
                      <Shield className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setShowMFA(false)}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                )}

                {!showMFA && !showForgotPassword && !showMobileOTP && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 lg:gap-4">
                      <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </Button>
                      <Button
                        onClick={handleGithubSignIn}
                        variant="outline"
                        className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 flex items-center justify-center"
                      >
                        <Github className="w-4 h-4 lg:w-5 lg:h-5" />
                      </Button>
                    </div>

                    <div className="text-center text-xs lg:text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                        Sign up
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Header and Benefits */}
          <div className="order-1 lg:order-2 w-full space-y-4 xs:space-y-6 lg:space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-white rounded-xl xs:rounded-2xl p-3 xs:p-4 lg:p-8 shadow-xl animate-fade-in">
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2 group">
                  <img src={Logo} alt="AMOGH" className="h-10 xs:h-14 w-auto md:h-8" />
                </Link>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 xs:mb-4 lg:mb-4 leading-tight mobile-text-2xl">
                  Welcome Back to
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Innovation
                  </span>
                </h1>
                <p className="text-base text-gray-600 leading-relaxed mb-2 xs:mb-4 lg:mb-4 mobile-text-base">
                  Continue your journey of building the future with cutting-edge projects and collaborations.
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:scale-105 transition-transform text-xs">
                    <Star className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                    Welcome back
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-700 hover:scale-105 transition-transform text-xs">
                    <Shield className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                    Secure login
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dynamic content based on user type */}
            {currentUserType && (
              <Card className={`
              backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl
              transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-scale-in delay-300
              ${'lg:block'} ${'hidden xs:block'}
            `}>
                <CardHeader className="pb-2 xs:pb-4">
                  <div className="flex items-center space-x-2 xs:space-x-3 mb-2 xs:mb-4">
                    <div className={`w-8 h-8 xs:w-10 xs:h-10 lg:w-12 lg:h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg transition-all duration-500`}>
                      <currentUserType.icon className="w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 text-white transition-all duration-500" />
                    </div>
                    <div className="transition-all duration-500">
                      <CardTitle className="text-xs xs:text-base lg:text-lg text-gray-900 transition-all duration-500">{currentUserType.label} Dashboard</CardTitle>
                      <p className="text-[10px] xs:text-xs lg:text-sm text-gray-600 transition-all duration-500">{currentUserType.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 xs:space-y-3">
                  {currentUserType.features.map((feature, index) => (
                    <div key={`${currentUserType.id}-${index}`} className="flex items-start space-x-2 xs:space-x-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex-shrink-0 w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center mt-0.5 shadow-sm transition-all duration-500">
                        <Check className="w-2 h-2 xs:w-3 xs:h-3 lg:w-3 lg:h-3 text-green-600 transition-all duration-500" />
                      </div>
                      <span className="text-xs lg:text-sm text-gray-700 transition-all duration-500">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default SignIn;