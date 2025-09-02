import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Logo from '../assets/Logo/Logo Side.png';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [user, setUser] = useState<any>(null);
  const [countdown, setCountdown] = useState(30);

  const email = location.state?.email || '';
  const message = location.state?.message || 'Please check your email and click the verification link to complete your registration.';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.emailVerified) {
          setVerificationStatus('verified');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (verificationStatus === 'pending' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, verificationStatus]);

  const handleResendVerification = async () => {
    if (!user) return;
    
    setIsVerifying(true);
    try {
      await user.sendEmailVerification();
      setCountdown(30);
      alert('Verification email resent successfully!');
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    
    setIsVerifying(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        setVerificationStatus('verified');
        // Update backend about email verification
        const token = await user.getIdToken();
        await fetch('/api/users/verify-email', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    navigate('/profile');
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Access</h2>
              <p className="text-gray-600 mb-4">This page requires a valid email verification session.</p>
              <Button onClick={() => navigate('/signup')} className="w-full">
                Go to Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="AMOGH" className="h-12 w-auto" />
          </div>
          
          {verificationStatus === 'pending' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Check Your Email</CardTitle>
              <CardDescription className="text-gray-600">
                {message}
              </CardDescription>
            </>
          )}
          
          {verificationStatus === 'verified' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Email Verified!</CardTitle>
              <CardDescription className="text-gray-600">
                Your email has been successfully verified. You can now access your account.
              </CardDescription>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Verification Failed</CardTitle>
              <CardDescription className="text-gray-600">
                There was an issue verifying your email. Please try again.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {verificationStatus === 'pending' && (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Verification email sent to:</p>
                <p className="text-sm font-medium text-gray-900 bg-gray-100 p-2 rounded">{email}</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleCheckVerification}
                  disabled={isVerifying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'I\'ve Verified My Email'
                  )}
                </Button>
                
                <Button
                  onClick={handleResendVerification}
                  disabled={isVerifying || countdown > 0}
                  variant="outline"
                  className="w-full"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-500">
                <p>Didn't receive the email? Check your spam folder.</p>
                <p>Make sure to click the verification link in the email.</p>
              </div>
            </>
          )}
          
          {verificationStatus === 'verified' && (
            <Button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {verificationStatus === 'error' && (
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isVerifying}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/signin')}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification; 