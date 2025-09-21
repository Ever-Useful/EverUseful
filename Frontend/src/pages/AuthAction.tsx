import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import Header from '@/components/Header';

const AuthAction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    const handle = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (!mode || !oobCode) {
        setStatus('error');
        setMessage('Invalid action link.');
        return;
      }

      try {
        if (mode === 'verifyEmail') {
          await applyActionCode(auth, oobCode);
          setStatus('success');
          setMessage('Email verified successfully. Redirecting...');
          setTimeout(() => navigate('/signin'), 1500);
        } else if (mode === 'resetPassword') {
          // First verify the code; if valid, show reset form
          await verifyPasswordResetCode(auth, oobCode);
          setShowResetForm(true);
          setStatus('success');
          setMessage('Enter your new password.');
        } else {
          setStatus('error');
          setMessage('Unsupported action.');
        }
      } catch (e: any) {
        setStatus('error');
        // Convert Firebase error codes to user-friendly messages
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (e?.code === 'auth/invalid-action-code') {
          errorMessage = 'This verification link has expired or is invalid. Please request a new one.';
        } else if (e?.code === 'auth/expired-action-code') {
          errorMessage = 'This verification link has expired. Please request a new one.';
        } else if (e?.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled. Please contact support.';
        } else if (e?.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address.';
        } else if (e?.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (e?.message) {
          errorMessage = e.message;
        }
        
        setMessage(errorMessage);
      }
    };
    handle();
  }, [searchParams, navigate]);

  const handleConfirmReset = async () => {
    const oobCode = searchParams.get('oobCode');
    if (!oobCode) return;
    // Basic validations following common UX patterns
    if (!newPassword || newPassword.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setMessage('Password reset successful. Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (e: any) {
      setStatus('error');
      // Convert Firebase error codes to user-friendly messages
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (e?.code === 'auth/invalid-action-code') {
        errorMessage = 'This reset link has expired or is invalid. Please request a new one.';
      } else if (e?.code === 'auth/expired-action-code') {
        errorMessage = 'This reset link has expired. Please request a new one.';
      } else if (e?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      setMessage(errorMessage);
    }
  };

  // Success state for email verification
  if (status === 'success' && !showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
          <Card className="w-full max-w-md text-center shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 pt-8 px-6 sm:px-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Email Verified!</CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Your email has been successfully verified. You can now access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-6 sm:px-8">
              <Button 
                onClick={() => navigate('/signin')}
                className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue to Sign In
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {showResetForm ? 'Reset your password' : 'Account Action'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                {showResetForm 
                  ? 'Enter your new password below to complete the reset process.'
                  : 'Completing your account verification or password reset process'
                }
              </p>
            </div>

            {/* Loading State */}
            {status === 'loading' && (
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
                </div>
                <p className="text-sm sm:text-base text-gray-600">Processing your request...</p>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                  <p className="text-sm sm:text-base text-red-700 leading-relaxed">{message}</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={() => navigate('/signin')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 sm:h-12 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Go to Sign In
                  </Button>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Need help? <a href="/SendFeedback" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Contact customer support</a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Reset Form */}
            {showResetForm && (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setFormError(''); }}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFormError(''); }}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-red-700">{formError}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleConfirmReset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 sm:h-12 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>

                <div className="text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Remember your password? <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Sign in instead</a>
                  </p>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default AuthAction;

