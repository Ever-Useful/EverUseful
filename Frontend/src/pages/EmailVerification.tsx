import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, sendEmailVerificationLink } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Please check your email and click the verification link to activate your account.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleCheckVerification}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Verification Status
              </Button>
              
              <Button 
                onClick={handleResendVerification}
                disabled={isResending || resendCountdown > 0}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendCountdown > 0 ? (
                  `Resend in ${resendCountdown}s`
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {verificationStatus === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">
                  Failed to resend verification email. Please try again.
                </span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>Didn't receive the email?</p>
            <p>Check your spam folder or try resending the verification email.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification; 