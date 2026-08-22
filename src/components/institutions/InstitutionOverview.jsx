import React from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../common/Card';

const InstitutionOverview = ({ institution }) => {
  if (!institution) return null;

  const {
    description,
    mission,
    vision,
    ownership = 'Public',
    type = 'University',
    establishedYear,
    campusSize,
    studentEnrollment,
    facultyCount,
    accreditationStatus,
    dormitoryCapacity,
    address
  } = institution;

  const stats = [
    { label: 'Institution Type', value: type, icon: '🏛️' },
    { label: 'Ownership', value: `${ownership} Higher Ed`, icon: '🏢' },
    { label: 'Established', value: establishedYear || 'N/A', icon: '📅' },
    { label: 'Accreditation', value: accreditationStatus || 'National Accredited', icon: '✅' },
    { label: 'Estimated Students', value: studentEnrollment ? Number(studentEnrollment).toLocaleString() : 'N/A', icon: '🎓' },
    { label: 'Academic Faculty', value: facultyCount ? Number(facultyCount).toLocaleString() : 'N/A', icon: '👨‍🏫' },
    { label: 'Campus Size', value: campusSize || 'Main Campus', icon: '📍' },
    { label: 'Housing / Dorm', value: dormitoryCapacity ? `${dormitoryCapacity} beds` : 'Available', icon: '🏠' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-xl mb-1">{stat.icon}</div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Institution</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            {description || 'No detailed background description provided for this institution.'}
          </p>
          {address && (
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center gap-2 border border-slate-200/60">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span><strong>Campus Address:</strong> {address}</span>
            </div>
          )}
        </CardBody>
      </Card>

      {(mission || vision) && (
        <div className="grid md:grid-cols-2 gap-6">
          {mission && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-blue-600">🎯</span> Mission
                </CardTitle>
              </CardHeader>
              <CardBody className="text-sm text-slate-600 leading-relaxed">
                {mission}
              </CardBody>
            </Card>
          )}
          {vision && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-indigo-600">🔭</span> Vision
                </CardTitle>
              </CardHeader>
              <CardBody className="text-sm text-slate-600 leading-relaxed">
                {vision}
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InstitutionOverview;
