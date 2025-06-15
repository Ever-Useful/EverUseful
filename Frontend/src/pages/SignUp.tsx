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
  ConfirmationResult,
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, handleGithubAuth, handleGoogleAuth } from "../lib/firebase"; 
import { createUserWithEmailAndPassword} from "firebase/auth";
import { error } from "console";
import { formatDate } from "date-fns";

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


  // Add this inside your component before return
  const countryCodes = ["+91", "+1", "+44", "+61", "+81"]; // Extend as needed
  // window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {});

  const mfaMethods = [
    { id: "authenticator", label: "Authenticator App", icon: Smartphone, description: "Most secure option" },
    { id: "sms", label: "SMS Code", icon: Phone, description: "Receive codes via text" },
    { id: "email", label: "Email Code", icon: Mail, description: "Receive codes via email" },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await signUpWithEmailAndPassword();
      // Send verification code to user's email
      sendVerificationCode();
      // Proceed to next step
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };
  // In your component
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

  return (
    
    <div className="min-h-screen g-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -z-10 top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"></div>
        <div className="absolute -z-10 top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse-slow"></div>
        <div
          className="absolute -z-10 bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
        <div
          className="absolute -z-10 bottom-40 right-1/3 w-28 h-28 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-30 flex items-left space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  AMOGH
                </span>
                <span className="text-xs text-slate-500 -mt-1">
                  ever useful
                </span>
              </div>
              <Badge
                variant="secondary"
                className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200"
              >
                Beta
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the Innovation Network
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Create your account and start building the future
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:scale-105 transition-transform">
              <Star className="w-3 h-3 mr-1" />
              Free to get started
            </Badge>

            <Badge
              variant="outline"
              className="border-green-500 text-green-700 hover:scale-105 transition-transform"
            >
              <Shield className="w-3 h-3 mr-1" />
              Secure & Private
            </Badge>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8 animate-scale-in delay-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-500 ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-500 ${
                      step < currentStep
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits sidebar */}
          <div className="lg:col-span-1 space-y-6 animate-scale-in delay-300">
            {/* User type benefits */}
            {currentUserType && (
              <Card
                className={`backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <currentUserType.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        {currentUserType.label} Benefits
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {currentUserType.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentUserType.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sign up form */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* User Type Selection */}
                <div className="animate-scale-in delay-400">
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    I am a:
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    {userTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleInputChange("userType", type.id)}
                          className={`p-5 rounded-xl border-2 transition-all duration-500 text-left ${
                            formData.userType === type.id
                              ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 ${type.color} rounded-xl mb-3 flex items-center justify-center shadow-md`}
                          >
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {type.label}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {type.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sign Up Form */}
                <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-500">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill in your information to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-gray-700 font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-gray-700 font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 font-medium"
                        >
                          Phone Number
                        </Label>
                        <div className="flex space-x-2 items-center">
                          <select
                            className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
                            value={selectedCode}
                            onChange={(e) => setSelectedCode(e.target.value)}
                          >
                            {countryCodes.map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>

                          <Input
                            id="phone"
                            type="tel"
                            placeholder="1234567890"
                            value={formData.phone}
                            maxLength={10}
                            onChange={(e) => {
                              const onlyNums = e.target.value.replace(/\D/g, "");
                              if (onlyNums.length <= 10) handleInputChange("phone", onlyNums);
                            }}
                            className="flex-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                          />

                          <Button
                            type="button"
                            onClick={sendOTP}
                            disabled={formData.phone.length !== 10}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                          >
                            Send OTP
                          </Button>
                        </div>
                      </div>

                      
                      <div id="recaptcha" className="mb-4"></div>

                      {/* In your OTP input section */}
                      {confirmationResult && (
                        <div className="space-y-2 pt-4">
                          <div id= "recaptcha"></div>
                          <Label
                            htmlFor="otp"
                            className="text-gray-700 font-medium"
                          >
                            Enter OTP
                          </Label>
                          <div className="flex space-x-2 items-center">
                            <Input
                              id="otp"
                              type="text"
                              placeholder="Enter OTP"
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value)}
                              className="flex-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                            />
                            <Button
                              type="button"
                              onClick={verifyOTP}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700 font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "agreeToTerms",
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm text-gray-600 leading-relaxed"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="newsletter"
                          checked={formData.subscribeToNewsletter}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "subscribeToNewsletter",
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor="newsletter"
                          className="text-sm text-gray-600"
                        >
                          Subscribe to our newsletter for project updates and
                          opportunities
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="enableMFA"
                          checked={formData.enableMFA}
                          onCheckedChange={(checked) =>
                            handleInputChange("enableMFA", checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="enableMFA"
                          className="text-sm text-gray-600"
                        >
                          Enable multi-factor authentication (recommended)
                        </Label>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        handleNextStep();
                        handleContinue();
                      }}
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
                        <span className="bg-white px-3 text-gray-500 font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full hover:scale-105 transition-all duration-300 hover:shadow-md"
                      onClick={() => handleGoogleAuth(navigate)}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>

                    {/* GitHub/LinkedIn for students and professors */}
                    {(formData.userType === "student" ||
                      formData.userType === "professor") && (
                      <Button
                        onClick={() => handleGithubAuth(navigate)}
                        variant="outline"
                        className="w-full hover:scale-105 transition-all duration-300 hover:shadow-md"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    )}

                    <div className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/signin"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Sign in
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-fade-in">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Verify Your Email
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    We've sent a verification email to {formData.email}. Please
                    check your email and click on the verification link to
                    verify your email address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <Button variant="ghost" className="text-sm">
                      Didn't receive the email? Resend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && formData.enableMFA && (
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-fade-in">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Setup Multi-Factor Authentication
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Choose your preferred authentication method for enhanced
                    security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {mfaMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() =>
                            handleInputChange("mfaMethod", method.id)
                          }
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
                              <div className="font-medium text-gray-900">
                                {method.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {method.description}
                              </div>
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
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-fade-in">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Welcome to ProjectBridge!
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your account has been created successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
    </div>
  );
};

export default SignUp;