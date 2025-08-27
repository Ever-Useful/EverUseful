import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles, Star, Users, BookOpen, Building2, Check, Github, Linkedin, Shield, Smartphone, Mail, Phone } from "lucide-react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  Auth,
  RecaptchaVerifier,
  ConfirmationResult,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth, handleGoogleAuth, handleGithubAuth } from "../lib/firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
// Removed Firestore imports - using DynamoDB now
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import userService from '@/services/userService';
// Removed Firestore import - using DynamoDB now
import { API_ENDPOINTS } from '../config/api';
import Logo from '../assets/Logo/Logo Side.png'

const SignUp = () => {
  const [selectedCode, setSelectedCode] = useState("+91");
  const [user, setUser] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    agreeToTerms: false,
    subscribeToNewsletter: false,
    enableMFA: true,
    mfaMethod: "authenticator"
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const userTypes = [
    { 
      id: "student", 
      label: "Student", 
      icon: BookOpen, 
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      gradient: "from-blue-50 to-cyan-50",
      description: "Undergrad, grad, or PhD student",
      benefits: [
        "Access to exclusive academic projects",
        "Collaborate with peers worldwide",
        "Free premium tools and resources",
        "GitHub/LinkedIn integration for portfolio"
      ]
    },
    { 
      id: "professor", 
      label: "Professor", 
      icon: Star, 
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      gradient: "from-purple-50 to-pink-50",
      description: "Academic researcher or educator",
      benefits: [
        "Course and project management tools",
        "Student mentorship platform",
        "Research collaboration network",
        "Professional networking via LinkedIn"
      ]
    },
    { 
      id: "business", 
      label: "Business", 
      icon: Building2, 
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      gradient: "from-green-50 to-emerald-50",
      description: "Company or organization",
      benefits: [
        "Access to top-tier talent pipeline",
        "Project sponsorship opportunities",
        "Industry partnership network",
        "Advanced analytics and reporting"
      ]
    },
  ];

  const currentUserType = userTypes.find(type => type.id === formData.userType);
  useEffect(() => {
    if (window.location.hostname === "localhost") {
      auth.settings.appVerificationDisabledForTesting = true;
    }
  }, []);

  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
  ];

  const mfaMethods = [
    { id: "authenticator", label: "Authenticator App", icon: Smartphone, description: "Most secure option" },
    { id: "sms", label: "SMS Code", icon: Phone, description: "Receive codes via text" },
    { id: "email", label: "Email Code", icon: Mail, description: "Receive codes via email" },
  ];

  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
      return 'strong';
    } else if (isLongEnough && ((hasUpperCase && hasLowerCase) || (hasNumbers && hasSpecialChar))) {
      return 'medium';
    }
    return 'weak';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value as string));
    }
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Function to validate all required fields
  const validateFields = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength === 'weak') {
      errors.password = 'Please use a stronger password';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.email.trim() && 
           /\S+@\S+\.\S+/.test(formData.email) &&
           formData.phone.trim() && 
           formData.phone.length === 10 &&
           formData.password && 
           passwordStrength !== 'weak' &&
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           formData.agreeToTerms;
  };

  const handleContinue = async () => {
    // Validate all fields first
    if (!validateFields()) {
      return; // Stop if validation fails
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await signUpWithEmailAndPassword();
    } catch (error: any) {
      // Error is already handled in signUpWithEmailAndPassword
      console.error("Signup failed:", error);
      // Don't set loading to false here as it's handled in signUpWithEmailAndPassword
    }
  };

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const sendOTP = async () => {
    try {
      console.log(selectedCode+formData.phone);
      // Only create reCAPTCHA verifier if not in development
      if (!recaptchaVerifierRef.current && !auth.settings.appVerificationDisabledForTesting) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth, 
          "recaptcha",
          { 
            size: "normal", // Changed from "invisible"
            callback: () => {},
            'expired-callback': () => {
              recaptchaVerifierRef.current?.clear();
            }
          }
        );
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        selectedCode + formData.phone,
        recaptchaVerifierRef.current || undefined
      );

      setConfirmationResult(confirmation);
      setOtpValue("");
    } catch (err) {
      console.error("OTP Error:", err);
      recaptchaVerifierRef.current?.clear();
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      console.error("No confirmation result");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otpValue);
      console.log("Authentication successful:", result);
      // Handle successful authentication
    } catch (error) {
      console.error("Verification Error:", error);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification code sent to user's email");
      } else {
        console.error("No user found");
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error.message);
    }
  };

  const signUpWithEmailAndPassword = async () => {
    try {
      // First, create the Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      console.log('Firebase account created successfully:', userCredential.user.uid);
      console.log('Sending user data to backend:', {
        userType: formData.userType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: selectedCode + formData.phone,
        email: formData.email,
      });

      // Save user data to DynamoDB via backend with all form data
      const response = await fetch(API_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userType: formData.userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: selectedCode + formData.phone,
          email: formData.email,
          username: formData.email.split('@')[0], // Send username derived from email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || `Failed to save user data to backend: ${response.status}`);
      }

      const result = await response.json();
      console.log('User data saved successfully:', result);
      
      // Set localStorage to indicate user is logged in and store user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", formData.userType);
      localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem("userFirstName", formData.firstName);
      localStorage.setItem("userLastName", formData.lastName);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userPhone", selectedCode + formData.phone);
      localStorage.setItem("userUsername", formData.email.split('@')[0]); // Store username derived from email
      localStorage.setItem("userDataSaved", "true");
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"));
      
      // Navigate to profile page
      navigate('/profile');
    } catch (error: any) {
      console.error("Error creating account:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists. Please sign in instead.");
        // Add a link to signin page
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address");
      } else if (error.code === 'auth/weak-password') {
        setError("Please use a stronger password");
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection and try again.");
      } else if (error.message.includes('Failed to save user data')) {
        setError("Account created but failed to save profile. Please try signing in.");
      } else {
        setError("An error occurred while creating your account. Please try again.");
      }
      throw error; // Re-throw to be caught by handleContinue
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Simulate email verification
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };
  const handleCreateAccount = () => {
    console.log("Account created:", formData);
  };
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Back Button - Mobile optimized */}
      {currentStep > 1 && (
        <button
          onClick={handleBackStep}
          className="fixed top-3 left-3 z-30 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors bg-white/90 rounded-full px-3 py-1 shadow-md lg:static lg:top-6 lg:left-6"
          aria-label="Go back"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Back</span>
        </button>
      )}

      {/* Right side - Header, Progress, User Types, and Benefits */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 to-slate-400 flex flex-col p-3 xs:p-4 sm:p-6 lg:p-8 relative overflow-hidden order-1 lg:order-2">
        {/* Header */}
        <div className="text-center mb-5 xs:mb-6 lg:mb-8 animate-fade-in">
          <div className="bg-white rounded-xl px-3 xs:px-4 lg:px-6 items-center justify-around shadow-md w-fit mx-auto">
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={Logo} alt="AMOGH" className="h-10 xs:h-14 w-auto md:h-8" />
              </Link>
            </div>
          </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 lg:mb-4 mobile-text-2xl">Join the Innovation Network</h1>
        <p className="text-base text-gray-600 mb-2 xs:mb-3 lg:mb-4 mobile-text-base">Create your account and start building the future</p>
          <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:scale-105 transition-transform text-xs lg:text-sm">
              <Star className="w-3 h-3 mr-1" />
              Free to get started
            </Badge>
            <Badge variant="outline" className="bg-white border-green-500 text-green-700 hover:scale-105 transition-transform text-xs lg:text-sm">
              <Shield className="w-3 h-3 mr-1" />
              Secure & Private
            </Badge>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-5 xs:mb-6 lg:mb-8 animate-scale-in delay-200">
          <div className="flex items-center space-x-2 lg:space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-7 h-7 xs:w-8 xs:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-medium transition-all duration-500 ${
                  step <= currentStep 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-6 xs:w-8 lg:w-16 h-1 mx-1 lg:mx-2 transition-all duration-500 ${
                    step < currentStep ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* User Type Selection */}
        {currentStep === 1 && (
          <div className="animate-scale-in delay-400 mb-5 xs:mb-6 lg:mb-8">
            <Label className="text-xs xs:text-sm font-medium text-gray-700 mb-3 xs:mb-4 block text-center">I am a:</Label>
            <div className="grid grid-cols-3 gap-2 xs:gap-3">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('userType', type.id)}
                    className={`p-2 xs:p-3 lg:p-4 rounded-xl border-2 transition-all duration-500 text-center ${formData.userType === type.id
                        ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                        : "bg-white/70 hover:scale-102 hover:shadow-md"
                      }`}
                  >
                    <div className={`w-6 h-6 lg:w-8 lg:h-8 ${type.color} rounded-xl mb-1 xs:mb-2 flex items-center justify-center shadow-md mx-auto`}>
                      <IconComponent className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-600 mt-1 hidden sm:block">{type.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Benefits sidebar */}
        <div className="mb-6 xs:mb-8 lg:mb-20 flex-1 flex items-center justify-center">
          {currentUserType && (
            <Card className={`backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 w-full max-w-md`}>
              <CardHeader className="pb-2 xs:pb-3 lg:pb-4">
                <div className="flex items-center space-x-2 xs:space-x-3 mb-2 xs:mb-3 lg:mb-4">
                  <div className={`w-8 h-8 xs:w-10 xs:h-10 lg:w-12 lg:h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <currentUserType.icon className="w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm xs:text-base lg:text-lg text-gray-900">{currentUserType.label} Benefits</CardTitle>
                    <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">{currentUserType.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 xs:space-y-2 lg:space-y-3">
                {currentUserType.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2 xs:space-x-3 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex-shrink-0 w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                      <Check className="w-2 h-2 xs:w-3 xs:h-3 lg:w-3 lg:h-3 text-green-600" />
                    </div>
                    <span className="text-xs lg:text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 order-2 lg:order-1 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Sign Up Form */}
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-500">
                <CardHeader className="text-center pb-4 lg:pb-6">
                  <CardTitle className="font-bold text-gray-900">Create Account</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">
                    Fill in your information to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium text-sm">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                          fieldErrors.firstName ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-xs text-red-600">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                          fieldErrors.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-xs text-red-600">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                        fieldErrors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Select value={selectedCode} onValueChange={setSelectedCode}>
                        <SelectTrigger className="w-[100px] sm:w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center space-x-2">
                                <span>{country.flag}</span>
                                <span className="hidden sm:inline">{country.code}</span>
                                <span className="sm:hidden">{country.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="1234567890"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            handleInputChange('phone', value);
                          }
                        }}
                        maxLength={10}
                        className={`flex-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                          formData.phone.length === 10 ? 'border-green-500' : fieldErrors.phone ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-600">{fieldErrors.phone}</p>
                    )}
                    {formData.phone.length > 0 && formData.phone.length < 10 && !fieldErrors.phone && (
                      <p className="text-xs text-amber-600 mt-1">
                        Please enter a valid 10-digit mobile number
                      </p>
                    )}
                    {formData.phone.length === 10 && !fieldErrors.phone && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Valid mobile number
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className={`pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                          passwordStrength === 'strong' ? 'border-green-500' :
                          passwordStrength === 'medium' ? 'border-yellow-500' :
                          fieldErrors.password ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        
                      >
                        {/* {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />} */}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-xs text-red-600">{fieldErrors.password}</p>
                    )}
                    {isPasswordFocused && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <div className={`h-1 flex-1 rounded-full ${
                            passwordStrength === 'weak' ? 'bg-red-500' :
                            passwordStrength === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className={`text-xs ${
                            passwordStrength === 'weak' ? 'text-red-500' :
                            passwordStrength === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            {passwordStrength === 'weak' ? 'Weak' :
                             passwordStrength === 'medium' ? 'Medium' :
                             'Strong'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm ${
                          formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' :
                          formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' :
                          fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        style={{ zIndex: 10 }}
                      >
                        {/* {showConfirmPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />} */}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                    {formData.confirmPassword && !fieldErrors.confirmPassword && (
                      <div className="mt-1">
                        {formData.password === formData.confirmPassword ? (
                          <p className="text-xs text-green-600">
                            ✓ Passwords match
                          </p>
                        ) : (
                          <p className="text-xs text-red-600">
                            ✗ Passwords do not match
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                      {error.includes("already exists") && (
                        <div className="mt-2">
                          <Link 
                            to="/signin" 
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Click here to sign in →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="newsletter" 
                        checked={formData.subscribeToNewsletter}
                        onCheckedChange={(checked) => handleInputChange('subscribeToNewsletter', checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-xs lg:text-sm text-gray-600">
                        Subscribe to our newsletter for project updates and opportunities
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="enableMFA" 
                        checked={formData.enableMFA}
                        onCheckedChange={(checked) => handleInputChange('enableMFA', checked as boolean)}
                      />
                      <Label htmlFor="enableMFA" className="text-xs lg:text-sm text-gray-600">
                        Enable multi-factor authentication (recommended)
                      </Label>
                    </div>
                  </div>

                  <Button 
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
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
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        setError(null);
                        await handleGoogleAuth(navigate, formData.userType);
                      } catch (error: any) {
                        console.error("Google auth error:", error);
                        setError("Google sign-in failed. Please try again.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    variant="outline" className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button 
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        setError(null);
                        await handleGithubAuth(navigate, formData.userType);
                      } catch (error: any) {
                        console.error("GitHub auth error:", error);
                        setError("GitHub sign-in failed. Please try again.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    variant="outline" className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <Github className="w-4 h-4 lg:w-5 lg:h-5" />
                    </Button>
                  </div>

                  <div className="text-center text-xs lg:text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <Card className="border-0 shadow-none p-0 animate-fade-in">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-bold text-gray-900">Verify Your Email</CardTitle>
                <CardDescription className="text-gray-600">
                  We've sent a verification code to {formData.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-0">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Enter verification code</Label>
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
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
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                  disabled={verificationCode.length !== 6}
                >
                  Verify Email
                  <Check className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>

                <div className="text-center">
                  <Button variant="ghost" className="text-sm">
                    Didn't receive the code? Resend
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && formData.enableMFA && (
            <Card className="border-0 shadow-none p-0 animate-fade-in">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-bold text-gray-900">Setup Multi-Factor Authentication</CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your preferred authentication method for enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-0">
                <div className="grid gap-4">
                  {mfaMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => handleInputChange('mfaMethod', method.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                          formData.mfaMethod === method.id
                            ? "border-blue-500 bg-blue-50 scale-105"
                            : "border-gray-200 hover:border-gray-300 hover:scale-102"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button 
                  onClick={handleCreateAccount}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                >
                  Complete Setup
                  <Shield className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && !formData.enableMFA && (
            <Card className="border-0 shadow-none p-0 animate-fade-in">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-bold text-gray-900">Welcome to ProjectBridge!</CardTitle>
                <CardDescription className="text-gray-600">
                  Your account has been created successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-0">
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;