
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles, Star, Users, BookOpen, Building2, Github, Shield, Smartphone, Mail } from "lucide-react";
import { handleGithubAuth, handleGoogleAuth, loginWithEmailPassword } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMethod, setMfaMethod] = useState("authenticator");
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');

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

  const handleSignIn = async () => {
    try {
      const idToken = await loginWithEmailPassword(email, password);
      const response = await fetch('http://localhost:3000/token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      navigate(data.redirectUrl);
    } catch (error) {
      console.error("Login failed", error);
    }
  };
 
  const handleMFAVerify = () => {
    console.log("MFA verified:", mfaCode);
    // Handle successful sign in
  };

  return (
    <div className="min-h-screen g-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -z-10 top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"></div>
        <div className="absolute -z-10 top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute -z-10 bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute -z-10 bottom-40 right-1/3 w-28 h-28 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div className="space-y-8 animate-fade-in">
          <div className="w-30 flex items-left space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  AMOGH
                </span>
                <span className="text-xs text-slate-500 -mt-1">ever useful</span>
              </div>
              <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">Beta</Badge>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Welcome Back to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Continue your journey of building the future with cutting-edge projects and collaborations.
              </p>
            </div>

            {/* Dynamic content based on user type */}
            {currentUserType && (
              <Card className={`backdrop-blur-lg bg-gradient-to-br ${currentUserType.gradient} border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${currentUserType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <currentUserType.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{currentUserType.label} Dashboard</h3>
                      <p className="text-sm text-gray-600">{currentUserType.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentUserType.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="space-y-6">
          {/* User Type Selection */}
          <div className="animate-scale-in delay-200">
            <Label className="text-sm font-medium text-gray-700 mb-4 block">Sign in as:</Label>
            <div className="grid grid-cols-3 gap-3">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                      userType === type.id
                        ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md"
                    }`}
                  >
                    <div className={`w-10 h-10 ${type.color} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign In Form */}
          <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl animate-scale-in delay-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showMFA ? (
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    onClick={handleSignIn}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl"
                  >
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Choose your preferred authentication method</p>
                  </div>

                  <div className="grid gap-3">
                    {mfaMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setMfaMethod(method.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                            mfaMethod === method.id
                              ? "border-blue-500 bg-blue-50 scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:scale-102"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{method.label}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
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

              {!showMFA && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  
                    <Button 
                    onClick={() => handleGoogleAuth(navigate)}
                    variant="outline" className="w-full hover:scale-105 transition-all duration-300 hover:shadow-md" >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    
                  

                  {/* GitHub/LinkedIn for students and professors */}
                  {(userType === "student" || userType === "professor") && (
                    
                      <Button 
                      onClick={() => handleGithubAuth(navigate)}
                      variant="outline" className="w-full hover:scale-105 transition-all duration-300 hover:shadow-md">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    
                  )}

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
      </div>
    </div>
  );
};

export default SignIn;
