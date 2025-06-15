import { useState } from "react";
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
  Auth 
} from "firebase/auth";
import { auth, handleGoogleAuth, handleGithubAuth } from "../lib/firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, addDoc, getFirestore, collection, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Make sure db is exported from your firebase config
const SignUp = () => {
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

  const mfaMethods = [
    { id: "authenticator", label: "Authenticator App", icon: Smartphone, description: "Most secure option" },
    { id: "sms", label: "SMS Code", icon: Phone, description: "Receive codes via text" },
    { id: "email", label: "Email Code", icon: Mail, description: "Receive codes via email" },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // This function is for Google authentication via Firebase
  //  const loginWithGoogle = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const userCred = await signInWithPopup(auth, provider);
  //     console.log("Google sign-up successful:", userCred.user);
  //     navigate("/signin");
  //   } catch (err: any) {
  //     console.error("Google sign-up error:", err.message);
  //     alert("Google login failed: " + err.message);
  //   }
  // };
  const handleContinue = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signUpWithEmailAndPassword();
      // Proceed to OTP verification
    } catch (error) {
      console.error("Error creating account:", error);
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      await fetch('http://localhost:3000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          userType: formData.userType,
        }),
      });
      navigate('/signin');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log("User already exists. Logging that instead of throwing.");
      } else {
        console.error("Error creating account:", error.message || error);
      }
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Back Button - Mobile optimized */}
      {currentStep > 1 && (
        <button
          onClick={handleBackStep}
          className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors z-10 bg-white/80 rounded-full px-3 py-1 shadow-md"
          aria-label="Go back"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Back</span>
        </button>
      )}

      {/* Right side - Header, Progress, User Types, and Benefits - Mobile first */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 to-slate-400 flex flex-col p-4 lg:p-8 relative overflow-hidden order-1 lg:order-2">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8 animate-fade-in">
          <div className="bg-white rounded-xl px-4 lg:px-6 items-center justify-around shadow-md w-fit mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-6">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
                  <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                    AMOGH
                  </span>
                  <span className="text-xs text-slate-500 -mt-1">ever useful</span>
                </div>
                <Badge variant="secondary" className="hidden w-8 h-5 lg:w-10 lg:h-6 text-xs lg:text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  Beta
                </Badge>
              </Link>
            </div>
          </div>

          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">Join the Innovation Network</h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-3 lg:mb-4">Create your account and start building the future</p>
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
        <div className="flex items-center justify-center mb-6 lg:mb-8 animate-scale-in delay-200">
          <div className="flex items-center space-x-2 lg:space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-medium transition-all duration-500 ${
                  step <= currentStep 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 lg:w-16 h-1 mx-1 lg:mx-2 transition-all duration-500 ${
                    step < currentStep ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Type Selection - Mobile optimized */}
        {currentStep === 1 && (
          <div className="animate-scale-in delay-400 mb-6 lg:mb-8">
            <Label className="text-sm font-medium text-gray-700 mb-4 block text-center">I am a:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('userType', type.id)}
                    className={`p-3 lg:p-4 rounded-xl border-2 transition-all duration-500 text-center ${formData.userType === type.id
                        ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                        : "bg-white/70 hover:scale-102 hover:shadow-md"
                      }`}
                  >
                    <div className={`w-6 h-6 lg:w-8 lg:h-8 ${type.color} rounded-xl mb-2 flex items-center justify-center shadow-md mx-auto`}>
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

        {/* Benefits sidebar - Mobile optimized */}
        <div className="mb-8 lg:mb-20 flex-1 flex items-center justify-center">
          {currentUserType && (
            <Card className={`backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 w-full max-w-md`}>
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <currentUserType.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base lg:text-lg text-gray-900">{currentUserType.label} Benefits</CardTitle>
                    <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">{currentUserType.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 lg:space-y-3">
                {currentUserType.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                      <Check className="w-2 h-2 lg:w-3 lg:h-3 text-green-600" />
                    </div>
                    <span className="text-xs lg:text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Left side - Form - Mobile optimized */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 lg:p-8 order-2 lg:order-1 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Sign Up Form */}
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-500">
                <CardHeader className="text-center pb-4 lg:pb-6">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">Create Account</CardTitle>
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
                        className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                      />
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
                      className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                    />
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
                        className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                    </div>
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
                        className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                    </div>
                  </div>

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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                    disabled={!formData.agreeToTerms}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    onClick={() => handleGoogleAuth(navigate)}
                    variant="outline" className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button 
                    onClick={() => handleGithubAuth(navigate)}
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
                <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
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
                <CardTitle className="text-2xl font-bold text-gray-900">Setup Multi-Factor Authentication</CardTitle>
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
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome to ProjectBridge!</CardTitle>
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