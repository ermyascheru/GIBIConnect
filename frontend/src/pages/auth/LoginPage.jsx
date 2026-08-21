import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email.trim(), password);

      const fallbackPath = user.role === 'admin' ? '/admin' : '/';
      const destination = location.state?.from?.pathname || fallbackPath;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isAuthenticated) {
    navigate(isAdmin ? '/admin' : '/', { replace: true });
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Log in to explore institutions, programs and scholarships across
          Ethiopia.
        </p>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-footer">
          New to GIBIConnect?{' '}
          <Link to="/register" state={location.state}>
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
