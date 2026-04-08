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
    loading,
    errorMessage,
    successMessage,
    pendingVerificationEmail,
    setSuccessMessage,
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // toggle state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState(''); // only for registration

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'success') {
      setSuccessMessage('Password reset successful. You can now log in with your new password.');
      params.delete('reset');
      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `/login?${nextQuery}` : '/login';
      window.history.replaceState({}, '', nextUrl);
    }
  }, [setSuccessMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (isLogin) {
      success = await login(email, password);
      if (success) window.location.href = '/admin/users';
    } else {
      if (password !== confirmPassword) {
        return;
      }
      success = await register({ username, email, password }); // username вместо name
      if (success) {
        setSuccessMessage('Registration successful! Check your email, then login.');
        setIsLogin(true);
        setPassword('');
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
            {loading ? <span className="spinner-border spinner-border-sm" /> : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-3 text-center">
          {isLogin && (
            <div className="mb-2">
              <a href="/reset-password" className="btn btn-link p-0">
                Forgot password?
              </a>
            </div>
          )}
          <button
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
