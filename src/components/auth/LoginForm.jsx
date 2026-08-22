import React, { useState } from 'react';
import Input from '../common/Input';
import PasswordField from './PasswordField';
import AuthError from './AuthError';
import Button from '../common/Button';

const LoginForm = ({
  onSubmit,
  loading = false,
  error,
  onForgotPassword,
  onNavigateToRegister,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email address is required.';
    if (!password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-md mx-auto bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 ${className}`}
    >
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
          G
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to GIBIConnect</h2>
        <p className="text-xs text-slate-500">Access saved universities, programs, reviews, and AI consultations</p>
      </div>

      {error && <AuthError message={error} />}

      <div className="space-y-3.5">
        <Input
          label="Email Address"
          id="login-email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFormErrors({ ...formErrors, email: null }); }}
          error={formErrors.email}
          required
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
            </svg>
          }
        />

        <PasswordField
          label="Password"
          id="login-password"
          name="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setFormErrors({ ...formErrors, password: null }); }}
          error={formErrors.password}
          required
        />
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span>Remember me</span>
        </label>

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Forgot password?
          </button>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={loading}
      >
        Sign In
      </Button>

      {onNavigateToRegister && (
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Create account
          </button>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
