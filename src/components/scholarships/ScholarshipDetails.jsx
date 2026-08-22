import React from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../common/Card';
import ScholarshipEligibility from './ScholarshipEligibility';
import ScholarshipDeadline from './ScholarshipDeadline';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ScholarshipDetails = ({
  scholarship,
  onSave,
  isSaved = false,
  onApply,
  onAskAI
}) => {
  if (!scholarship) return null;

  const {
    title,
    coverageType = 'Full Tuition',
    amount,
    provider,
    institution,
    deadline,
    description,
    eligibilityCriteria = [],
    requiredDocuments = [],
    applicationProcess,
    contactEmail
  } = scholarship;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success">{coverageType}</Badge>
              <ScholarshipDeadline deadlineDate={deadline} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{title}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Provided by: <span className="font-semibold text-slate-800">{institution || provider}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onAskAI && (
              <Button variant="primary" size="sm" onClick={onAskAI}>
                Ask AI About Eligibility
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

        {/* Grant Summary box */}
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Financial Grant Coverage</span>
            <p className="text-lg font-black text-emerald-950 mt-0.5">{amount || 'Full Tuition + Academic Stipend'}</p>
          </div>
          {onApply && (
            <Button variant="success" size="md" onClick={onApply}>
              Apply For Scholarship
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Overview</CardTitle>
        </CardHeader>
        <CardBody className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>{description || 'Financial aid and merit-based scholarship granted to qualified students meeting academic excellence and criteria.'}</p>
        </CardBody>
      </Card>

      {/* Eligibility & Documents Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardBody>
            <ScholarshipEligibility criteria={eligibilityCriteria} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Required Documents</CardTitle>
          </CardHeader>
          <CardBody>
            {requiredDocuments.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-600">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{typeof doc === 'string' ? doc : doc.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Official transcripts, application letter, and ID copy required.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Application Process */}
      {applicationProcess && (
        <Card>
          <CardHeader>
            <CardTitle>How To Apply</CardTitle>
          </CardHeader>
          <CardBody className="text-sm text-slate-700 leading-relaxed">
            <p>{applicationProcess}</p>
            {contactEmail && (
              <p className="mt-3 text-xs text-slate-500">
                Inquiries: <a href={`mailto:${contactEmail}`} className="text-blue-600 underline">{contactEmail}</a>
              </p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ScholarshipDetails;
