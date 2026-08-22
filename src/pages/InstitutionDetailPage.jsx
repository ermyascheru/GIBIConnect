import React, { useState } from 'react';
import InstitutionHeader from '../components/institutions/InstitutionHeader';
import InstitutionTabs from '../components/institutions/InstitutionTabs';
import InstitutionOverview from '../components/institutions/InstitutionOverview';
import ProgramCard from '../components/programs/ProgramCard';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import Button from '../components/common/Button';

export default function InstitutionDetailPage({
  institution,
  programs = [],
  reviews = [],
  onBack,
  onCompare,
  isCompared = false,
  onAskAI,
  onSelectProgram
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  if (!institution) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <p className="text-slate-700 font-bold">Institution profile not found.</p>
        <Button variant="primary" onClick={onBack}>&larr; Back to Institutions</Button>
      </div>
    );
  }

  const instPrograms = programs.filter(p => p.institution === institution.name);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>&larr;</span> Back to Directory
        </button>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-white">
        <div className="h-44 sm:h-52 relative overflow-hidden bg-slate-950">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt={institution.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        <div className="p-6 sm:p-8 -mt-16 relative z-10">
          <InstitutionHeader
            institution={institution}
            onCompare={() => onCompare(institution)}
            isCompared={isCompared}
            onAskAI={() => onAskAI(`Tell me about admissions, cutoffs, and programs at ${institution.name}`)}
          />
        </div>
      </div>

      <InstitutionTabs
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
        counts={{
          departments: 12,
          programs: instPrograms.length || institution.programsCount,
          scholarships: 3,
          facilities: 8,
          reviews: reviews.length
        }}
      />

      {activeSubTab === 'overview' && (
        <InstitutionOverview institution={institution} />
      )}

      {activeSubTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Offered Academic Degree Programs ({instPrograms.length || 3})
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(instPrograms.length > 0 ? instPrograms : programs).map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onSelect={() => onSelectProgram(prog)}
              />
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'reviews' && (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Student & Alumni Feedback</h3>
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
          <div>
            <ReviewForm
              institutionName={institution.name}
              departments={['Computer Science', 'Software Engineering', 'Medicine', 'Civil Engineering', 'Business']}
              onSubmit={(data) => {
                alert(`Review submitted for ${institution.name} (${data.rating} Stars, "${data.title}")! Status: Under moderation review.`);
              }}
            />
          </div>
        </div>
      )}

      {activeSubTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Admissions & Entrance Cutoffs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Admissions for regular undergraduate programs are conducted through the Ministry of Education centralized national placement. Extension and postgraduate applicants should register via the university admissions desk.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
            <p><strong>Minimum Cutoff Score:</strong> Grade 12 National Exam &ge; 380 (Natural Science)</p>
            <p><strong>Extension Degree Tuition:</strong> 1,800 - 4,200 ETB per credit hour</p>
            <p><strong>Next Application Deadline:</strong> October 15, 2026</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => onAskAI(`What are specific admission requirements for ${institution.name}?`)}>
            Ask AI Advisor About Admission Details
          </Button>
        </div>
      )}

      {activeSubTab === 'facilities' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Campus Facilities & Infrastructure</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm mb-1">Central Library</span>
              <p className="text-slate-500">Over 500,000 physical volumes and 24/7 digital academic database access.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm mb-1">Research Laboratories</span>
              <p className="text-slate-500">Modern computing labs, IoT hubs, and advanced physics/biotech facilities.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm mb-1">Student Dormitories</span>
              <p className="text-slate-500">On-campus housing and dining facilities for regular undergraduate students.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
