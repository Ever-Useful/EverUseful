import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowRight, Sparkles, Star, Users, BookOpen, Building2, Github, Linkedin, Shield, Smartphone, Mail, Check, Phone } from "lucide-react";

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
  const [countryCode, setCountryCode] = useState("+1");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");  
  
  const navigate = useNavigate();

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

  const currentUserType = userTypes.find(type => type.id === userType);

  const mfaMethods = [
    { id: "authenticator", label: "Authenticator App", icon: Smartphone, description: "Use your authenticator app" },
    { id: "sms", label: "SMS Code", icon: Mail, description: "Receive code via SMS" },
    { id: "email", label: "Email Code", icon: Mail, description: "Receive code via email" },
  ];

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

  const handleSignIn = async () => {
    try {
      console.log("User signed in:", email);
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      alert("Invalid email or password");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      console.log("User signed in with Github");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing in with Github:", error.message);
      alert("Error signing in with Github");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("User signed in with Google");
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      alert("Error signing in with Google");
    }
  };

  const handleMobileSignIn = () => {
    console.log("Sending OTP to:", countryCode + mobileNumber);
    setShowMobileOTP(true);
  };

  const handleMobileOTPVerify = () => {
    console.log("Mobile OTP verified:", mobileOTP);
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleMFAVerify = () => {
    console.log("MFA verified:", mfaCode);
    // Handle successful sign in
  };

  const handleForgotPasswordSubmit = () => {
    console.log("Sending OTP to:", forgotPasswordEmail);
    setShowForgotPasswordOTP(true);
  };

  const handleForgotPasswordOTPVerify = () => {
    console.log("OTP verified:", forgotPasswordOTP);
    // Handle password reset
    if (newPassword === confirmPassword) {
      console.log("Password reset successful");
      // Reset to initial state
      setShowForgotPassword(false);
      setShowForgotPasswordOTP(false);
      setForgotPasswordEmail("");
      setForgotPasswordOTP("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const resetToSignIn = () => {
    setShowMFA(false);
    setShowForgotPassword(false);
    setShowForgotPasswordOTP(false);
    setForgotPasswordEmail("");
    setForgotPasswordOTP("");
    setNewPassword("");
    setConfirmPassword("");
    setMfaCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Sign in form */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            {/* User Type Selection - moved to left */}
            <div className="animate-scale-in delay-200">
              <Label className="text-sm font-medium text-gray-700 mb-3 lg:mb-4 block">Sign in as:</Label>
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setUserType(type.id)}
                      className={`p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 transition-all duration-500 bg-white ${
                        userType === type.id
                          ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md"
                      }`}
                    >
                      <div className={`w-6 h-6 lg:w-10 lg:h-10 ${type.color} rounded-lg lg:rounded-xl mx-auto mb-1 lg:mb-3 flex items-center justify-center shadow-md`}>
                        <IconComponent className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-gray-700">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sign In Form */}
            <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-300">
              <CardHeader className="text-center pb-4 lg:pb-6">
                <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">
                  {showForgotPassword ? "Reset Password" : "Sign In"}
                </CardTitle>
                <CardDescription className="text-sm lg:text-base text-gray-600">
                  {showForgotPassword 
                    ? "Enter your email to receive a verification code"
                    : "Enter your credentials to access your account"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                {!showMFA && !showForgotPassword && !showMobileOTP ? (
                  <>
                    {/* Authentication Method Selection */}
                    <div className="space-y-2 lg:space-y-3">
                      <Label className="text-gray-700 font-medium">Sign in with:</Label>
                      <RadioGroup value={authMethod} onValueChange={setAuthMethod} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
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
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

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
                          disabled={!email || !password}
                        >
                          Sign In
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number</Label>
                          <div className="flex space-x-2">
                            <Select value={countryCode} onValueChange={setCountryCode}>
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
                              id="mobile"
                              type="tel"
                              placeholder="1234567890"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-gray-200 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={handleMobileSignIn}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                          disabled={!mobileNumber || mobileNumber.length < 10}
                        >
                          Send OTP
                          <Phone className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </>
                    )}
                  </>
                ) : showMobileOTP ? (
                  <div className="space-y-4 lg:space-y-6 animate-fade-in">
                    <div className="text-center">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                        <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Enter OTP</h3>
                      <p className="text-sm text-gray-600">Code sent to {countryCode} {mobileNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Enter 6-digit OTP</Label>
                      <InputOTP
                        maxLength={6}
                        value={mobileOTP}
                        onChange={(value) => setMobileOTP(value)}
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

                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <span>Didn't receive the code?</span>
                      <button 
                        onClick={handleMobileSignIn}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <Button 
                      onClick={handleMobileOTPVerify}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-500 hover:scale-105 group shadow-lg"
                      disabled={mobileOTP.length !== 6}
                    >
                      Verify & Sign In
                      <Check className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>

                    <Button 
                      variant="ghost" 
                      onClick={resetToSignIn}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
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
                          <p className="text-sm text-gray-600">We'll send you a verification code</p>
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
                          Send Verification Code
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
                            className={`p-3 lg:p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              mfaMethod === method.id
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
                      <Button variant="outline" className="hover:scale-110 transition-all duration-300 hover:shadow-md p-2 w-10 h-10 flex items-center justify-center">
                        <Linkedin className="w-4 h-4 lg:w-5 lg:h-5" />
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Sign up
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Header and Benefits */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in order-1 lg:order-2">
            {/* Header */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-8 shadow-xl animate-fade-in">
              <div className="w-30 flex items-left space-x-2 mb-4 lg:mb-8">
                <Link to="/" className="flex items-center space-x-2 group">
                  <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Sparkles className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                      AMOGH
                    </span>
                    <span className="text-xs text-slate-500 -mt-1">ever useful</span>
                  </div>
                  <Badge variant="secondary" className="hidden w-8 h-5 lg:w-10 lg:h-6 text-xs lg:text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">Beta</Badge>
                </Link>
              </div>
              <div className="text-center">
                <h1 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4 leading-tight">
                  Welcome Back to
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Innovation
                  </span>
                </h1>
                <p className="text-sm lg:text-xl text-gray-600 leading-relaxed mb-2 lg:mb-4">
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
              <Card className={`backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-scale-in delay-300 lg:block hidden`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <currentUserType.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base lg:text-lg text-gray-900">{currentUserType.label} Dashboard</CardTitle>
                      <p className="text-xs lg:text-sm text-gray-600">{currentUserType.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentUserType.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                        <Check className="w-2 h-2 lg:w-3 lg:h-3 text-green-600" />
                      </div>
                      <span className="text-xs lg:text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;