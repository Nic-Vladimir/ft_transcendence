'use client'

import { useState } from 'react';
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
  const [username, setUsername] = useState(''); // only for registration

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (isLogin) {
      success = await login(email, password);
      if (success) window.location.href = '/admin/users';
    } else {
      success = await register({ username, email, password }); // username вместо name
      if (success) {
        setSuccessMessage('Registration successful! Check your email, then login.');
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '360px' }}>
        <h3 className="mb-3 text-center">{isLogin ? 'Login' : 'Register'}</h3>

        {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
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
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-3 text-center">
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
