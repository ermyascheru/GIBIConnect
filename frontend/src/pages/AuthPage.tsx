import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    onSuccess();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm">
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0C373D] text-[#5AA7A7] flex items-center justify-center font-bold text-xl mx-auto shadow-md border border-[#5AA7A7]/30">
            G
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-4 font-serif">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            {isRegister
              ? 'Join GIBIConnect to save universities and track deadlines'
              : 'Sign in to access your saved bookmarks and AI advisor history'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Abebe Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@example.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0C373D] hover:bg-[#072428] text-white font-semibold text-xs shadow-md transition-all mt-6 cursor-pointer"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-6 text-center text-xs text-[#64748B]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold text-[#5AA7A7] hover:underline cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};