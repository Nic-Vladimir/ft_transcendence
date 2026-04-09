'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/admin.css';

export default function AuthPage() {
  const {
    login,
    register,
    resendVerification,
    verifyTwoFactor,
    loading,
    errorMessage,
    successMessage,
    pendingVerificationEmail,
    twoFactorRequired,
    setTwoFactorRequired,
    setErrorMessage,
    setSuccessMessage,
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // toggle state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState(''); // only for registration
  const [socialError, setSocialError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSocialError(null);
    setErrorMessage(null);
    if (params.get('reset') === 'success') {
      setSuccessMessage('Password reset successful. You can now log in with your new password.');
    }
    const verificationStatus = params.get('verification');
    if (verificationStatus === 'success') {
      setSuccessMessage('Email verified successfully. You can now log in.');
    } else if (verificationStatus === 'used') {
      setSuccessMessage(null);
      setErrorMessage('This verification link was already used. Try logging in.');
    } else if (verificationStatus === 'expired') {
      setSuccessMessage(null);
      setErrorMessage('This verification link has expired. Request a new one from the login page.');
    } else if (verificationStatus === 'invalid') {
      setSuccessMessage(null);
      setErrorMessage('This verification link is invalid.');
    } else if (verificationStatus === 'error') {
      setSuccessMessage(null);
      setErrorMessage('We could not verify your email. Please try again.');
    }
    if (params.get('twoFactor') === 'required') {
      setTwoFactorRequired(true);
      setSuccessMessage('Enter your 2FA code to finish logging in.');
    }
    const socialStatus = params.get('social');
    if (socialStatus === 'error' || socialStatus === 'oauth_failed' || socialStatus === 'invalid_state' || socialStatus === 'unsupported') {
      setSuccessMessage(null);
    }
    if (socialStatus === 'oauth_failed' || socialStatus === 'error') {
      setSocialError('Google login failed. Please try again.');
    } else if (socialStatus === 'invalid_state') {
      setSocialError('Social login session expired. Please try again.');
    } else if (socialStatus === 'unsupported') {
      setSocialError('Unsupported social login provider.');
    }
    params.delete('reset');
    params.delete('verification');
    params.delete('twoFactor');
    params.delete('social');
    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `/login?${nextQuery}` : '/login';
    window.history.replaceState({}, '', nextUrl);
  }, [setErrorMessage, setSuccessMessage, setTwoFactorRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin && twoFactorRequired) {
      const authResult = await verifyTwoFactor(twoFactorCode);
      if (authResult) window.location.href = authResult.redirectTo;
      return;
    }

    if (isLogin) {
      const authResult = await login(email, password);
      if (authResult) window.location.href = authResult.redirectTo;
    } else {
      if (password !== confirmPassword) {
        return;
      }
      const success = await register({ username, email, password }); // username вместо name
      if (success) {
        setSuccessMessage('Registration successful! Check your email, then login.');
        setIsLogin(true);
        setPassword('');
        setTwoFactorCode('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '360px' }}>
        <h3 className="mb-3 text-center">{isLogin ? 'Login' : 'Register'}</h3>

        {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
        {socialError && <div className="alert alert-danger py-2">{socialError}</div>}
        {!isLogin && password && confirmPassword && password !== confirmPassword && (
          <div className="alert alert-danger py-2">Passwords do not match.</div>
        )}
        {isLogin && pendingVerificationEmail && (
          <div className="alert alert-warning py-2">
            <div className="mb-2">Your email is not verified yet.</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              disabled={loading}
              onClick={() => resendVerification(pendingVerificationEmail)}
            >
              Resend verification email
            </button>
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success py-2">
            {successMessage}
            <button className="btn-close float-end" onClick={() => setSuccessMessage(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {isLogin && twoFactorRequired ? (
            <div className="mb-3">
              <label className="form-label">2FA code</label>
              <input
                type="text"
                className="form-control"
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                required
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Confirm password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || (!isLogin && password !== confirmPassword)}
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : isLogin ? (twoFactorRequired ? 'Verify 2FA' : 'Login') : 'Register'}
          </button>
        </form>

        {isLogin && !twoFactorRequired && (
          <>
            <div className="text-center text-muted my-3">or</div>
            <a href="/api/auth/social/google/start" className="btn btn-outline-dark w-100">
              Continue with Google
            </a>
          </>
        )}

        <div className="mt-3 text-center">
          {isLogin && !twoFactorRequired && (
            <div className="mb-2">
              <a href="/reset-password" className="btn btn-link p-0">
                Forgot password?
              </a>
            </div>
          )}
          {isLogin && twoFactorRequired && (
            <button
              className="btn btn-link"
              onClick={() => {
                window.location.reload();
              }}
              disabled={loading}
            >
              Back to login
            </button>
          )}
          {!twoFactorRequired && (
          <button
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
