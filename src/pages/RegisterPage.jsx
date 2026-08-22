import React from 'react';
import RegistrationForm from '../components/auth/RegistrationForm';

export default function RegisterPage({ onNavigate }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4 relative">
      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-6 space-y-2">
          <img src="/logo.jpg" alt="GIBI-Connect Logo" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-lg mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Join GIBI-Connect</h2>
          <p className="text-xs text-slate-500">Create your student or faculty profile to unlock full platform features.</p>
        </div>

        <RegistrationForm
          onSubmit={(data) => {
            alert(`Account registered for ${data.firstName} ${data.lastName}! Please check your email to verify.`);
            onNavigate('/login');
          }}
        />
        <p className="text-center text-xs text-slate-500 mt-4">
          Already have an account?{' '}
          <button onClick={() => onNavigate('/login')} className="text-blue-600 font-bold hover:underline cursor-pointer">
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
}
