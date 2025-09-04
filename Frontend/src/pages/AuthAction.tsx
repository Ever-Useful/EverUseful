import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/assets/Logo/Logo Side.png';

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
        setMessage(e?.message || 'Action failed.');
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
      setMessage(e?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-slate-100 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src={Logo} alt="AMOGH" className="h-10 w-auto" />
            </Link>
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Account Action</h1>
          <p className="text-sm text-gray-600 text-center mb-6">Securely verify your email or reset your password</p>

          {status === 'loading' && (
            <div className="text-gray-700 text-center">Processing...</div>
          )}

          {status !== 'loading' && (
            <div className="text-gray-800 text-center mb-4">{message}</div>
          )}

          {showResetForm && (
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setFormError(''); }}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFormError(''); }}
              />
              {formError && <div className="text-sm text-red-600">{formError}</div>}
              <Button onClick={handleConfirmReset} className="w-full">
                Reset Password
              </Button>
            </div>
          )}

          {!showResetForm && status === 'success' && (
            <div className="mt-4 text-center">
              <Link to="/signin">
                <Button variant="outline" className="w-full">Go to Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthAction;

