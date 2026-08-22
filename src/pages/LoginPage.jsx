import React from 'react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage({ onNavigate }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4 relative">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 space-y-2">
          <img src="/logo.jpg" alt="GIBI-Connect Logo" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-lg mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to GIBI-Connect</h2>
          <p className="text-xs text-slate-500">Access saved universities, scholarship applications, and AI chat history.</p>
        </div>

        <LoginForm
          onSubmit={(data) => {
            alert(`Signed in as ${data.email}`);
            onNavigate('/');
          }}
          onForgotPassword={() => alert('Password reset link sent to your email.')}
        />
        <p className="text-center text-xs text-slate-500 mt-4">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('/register')} className="text-blue-600 font-bold hover:underline cursor-pointer">
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
}
