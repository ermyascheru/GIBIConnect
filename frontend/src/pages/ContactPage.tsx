import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquareText } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#EBF4F7] min-h-[85vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Contact Info */}
        <div className="md:col-span-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF6F6] text-[#1E5C64] border border-[#5AA7A7]/30 mb-4">
            <MessageSquareText className="w-3.5 h-3.5 text-[#5AA7A7]" />
            <span>Support & Inquiries</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#0C373D]">
            Get in Touch
          </h2>
          <p className="mt-3 text-sm text-[#0F172A] font-medium">
            We'd like to hear from you!
          </p>
          <p className="mt-3 text-xs text-[#64748B] leading-relaxed">
            If you have any inquiries regarding university accreditation, partnership, registrar data verification, or general feedback, please reach out to us.
          </p>

          <div className="mt-8 space-y-4 text-xs text-[#0F172A]">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-xl bg-[#EBF6F6] flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#5AA7A7]" />
              </div>
              <span className="font-medium">contact@gibiconnect.edu.et</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-xl bg-[#EBF6F6] flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#5AA7A7]" />
              </div>
              <span className="font-medium">+251 11 123 4567</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-xl bg-[#EBF6F6] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#5AA7A7]" />
              </div>
              <span className="font-medium">Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-[#5AA7A7] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#0F172A]">Message Received!</h3>
              <p className="text-xs text-[#64748B] mt-1">Thank you for reaching out. Our academic team will respond within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs text-[#5AA7A7] font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#EBF4F7] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#EBF4F7] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#EBF4F7] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#EBF4F7] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#5AA7A7] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5 text-[#5AA7A7]" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};