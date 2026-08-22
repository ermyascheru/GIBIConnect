import React from 'react';

const ProgramMetadata = ({
  duration = '4 Years',
  degree = 'Bachelor',
  studyMode = 'Full-Time',
  tuition,
  language = 'English',
  credits
}) => {
  const items = [
    { label: 'Degree Level', value: degree, icon: '🎓' },
    { label: 'Study Mode', value: studyMode, icon: '⏱️' },
    { label: 'Program Duration', value: duration, icon: '📅' },
    { label: 'Estimated Tuition', value: tuition || 'Government Scale', icon: '💵' },
    { label: 'Language', value: language, icon: '🌐' },
    { label: 'Total Credits', value: credits ? `${credits} ECTS / Credits` : 'Standard Curriculum', icon: '📚' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 border-t border-slate-100">
      {items.map((item, idx) => (
        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="text-base mb-1">{item.icon}</div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {item.label}
          </span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgramMetadata;
