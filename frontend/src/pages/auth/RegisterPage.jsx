import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  function validate() {
    if (!form.name.trim()) {
      return 'Please enter your full name.';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/login', {
        replace: true,
        state: {
          from: location.state?.from,
          registeredEmail: form.email.trim()
        }
      });
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Join GIBIConnect and start planning your academic journey.
        </p>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <label className="auth-label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          className="auth-input"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={updateField('name')}
          required
        />

        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField('email')}
          required
        />

        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={updateField('password')}
          required
        />

        <label className="auth-label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          required
        />

        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" state={location.state}>
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
