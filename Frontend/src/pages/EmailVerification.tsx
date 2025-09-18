import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, sendEmailVerificationLink } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import Header from '@/components/Header';
const ILLUSTRATION_URL = 'https://amogh-assets.s3.ap-south-1.amazonaws.com/content/business-email-service-banner-2.png';

const EmailVerification = () => {
  const [user, setUser] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('userEmail') || '';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.emailVerified) {
          setVerificationStatus('verified');
        }
      } else {
        navigate('/signin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendVerification = async () => {
    if (!user || resendCountdown > 0) return;
    
    try {
      setIsResending(true);
      await sendEmailVerificationLink(user);
      setResendCountdown(60); // 60 second cooldown
      console.log('Verification email resent successfully');
    } catch (error: any) {
      console.error('Error resending verification:', error);
      setVerificationStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    
    try {
      await user.reload();
      if (user.emailVerified) {
        setVerificationStatus('verified');
        localStorage.setItem("isLoggedIn", "true");
        localStorage.removeItem("isSignedUp");
        
        // Update backend verification status
        try {
          const token = await user.getIdToken();
          await fetch(API_ENDPOINTS.VERIFY_EMAIL, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (backendError) {
          console.error('Backend verification update failed:', backendError);
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  const handleContinue = () => {
    localStorage.removeItem("isSignedUp");
    navigate('/profile');
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Email Verified!</CardTitle>
              <CardDescription className="text-gray-600">
                Your email has been successfully verified. You can now access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-200">
      <Header />
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left illustration pane */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-200/20"></div>
          <div className="relative z-10 max-w-2xl w-full px-12 py-16">
            <img src={ILLUSTRATION_URL} alt="Email verification" className="w-full h-auto drop-shadow-2xl" />
          </div>
        </div>

        {/* Right content pane - centered */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Verify your email address
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                To start using your account, confirm your email address with the email we sent to:
              </p>
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm">
                <p className="font-semibold text-gray-900 text-sm sm:text-base break-all">{email || 'your email'}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Button
                onClick={handleResendVerification}
                disabled={isResending || resendCountdown > 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 sm:h-12 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendCountdown > 0 ? (
                  `Resend email in ${resendCountdown}s`
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend email
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Need help? <a href="/SendFeedback" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Contact customer support</a>
                </p>
              </div>
            </div>

            {verificationStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-red-700">Failed to resend verification email. Please try again.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 