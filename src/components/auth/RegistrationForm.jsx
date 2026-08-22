import React, { useState } from 'react';
import Input from '../common/Input';
import PasswordField from './PasswordField';
import AuthError from './AuthError';
import Button from '../common/Button';

const RegistrationForm = ({
  onSubmit,
  loading = false,
  error,
  onNavigateToLogin,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    onSubmit(formData);
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
        <h2 className="text-xl font-bold text-slate-900">Create GIBIConnect Account</h2>
        <p className="text-xs text-slate-500">Join students discovering higher education and AI guidance</p>
      </div>

      {error && <AuthError message={error} />}

      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            id="reg-first-name"
            placeholder="Abebe"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={formErrors.firstName}
            required
          />
          <Input
            label="Last Name"
            id="reg-last-name"
            placeholder="Kebede"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={formErrors.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          id="reg-email"
          type="email"
          placeholder="abebe@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={formErrors.email}
          required
        />

        <PasswordField
          label="Password"
          id="reg-password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={formErrors.password}
          showStrength={true}
          required
        />

        <PasswordField
          label="Confirm Password"
          id="reg-confirm-password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={formErrors.confirmPassword}
          required
        />

        {/* Terms agreement */}
        <div>
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>
              I agree to the <span className="text-blue-600 font-medium">Terms of Service</span> and <span className="text-blue-600 font-medium">Privacy Policy</span>.
            </span>
          </label>
          {formErrors.agreeToTerms && (
            <p className="text-xs text-red-600 font-medium mt-1">{formErrors.agreeToTerms}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={loading}
      >
        Create Account
      </Button>

      {onNavigateToLogin && (
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;
