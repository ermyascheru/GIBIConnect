import React from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../common/Card';
import ProgramMetadata from './ProgramMetadata';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ProgramDetails = ({
  program,
  onSave,
  isSaved = false,
  onAskAI
}) => {
  if (!program) return null;

  const {
    name,
    degree = 'Bachelor',
    department,
    institution,
    description,
    duration,
    studyMode,
    tuition,
    languageOfInstruction,
    credits,
    admissionRequirements = [],
    careerOpportunities = []
  } = program;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{degree}</Badge>
              <Badge variant="default">{studyMode || 'Full-Time'}</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{name}</h1>
            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5">
              <span>{institution}</span>
              {department && (
                <>
                  <span>•</span>
                  <span>{department}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onAskAI && (
              <Button variant="primary" size="sm" onClick={onAskAI}>
                Ask AI About This Program
              </Button>
            )}
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                leftIcon={
                  <svg className="w-4 h-4 text-amber-500" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                }
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            )}
          </div>
        </div>

        <ProgramMetadata
          duration={duration}
          degree={degree}
          studyMode={studyMode}
          tuition={tuition}
          language={languageOfInstruction}
          credits={credits}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Description</CardTitle>
        </CardHeader>
        <CardBody className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>{description || 'Comprehensive academic program structured to provide foundational theory and advanced practical competence.'}</p>
        </CardBody>
      </Card>

      {admissionRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Admission Requirements</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm text-slate-700">
              {admissionRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{typeof req === 'string' ? req : req.requirement}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {careerOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Career Opportunities & Pathways</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid sm:grid-cols-2 gap-3">
              {careerOpportunities.map((career, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    💼
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{typeof career === 'string' ? career : career.title}</h4>
                    {career.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{career.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ProgramDetails;
