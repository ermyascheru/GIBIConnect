import React, { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const RESOURCES_LIST = [
  {
    id: 'res-1',
    title: 'AAU 2026/2027 Official Admission & Cutoff Handbook',
    category: 'Admission Guide',
    institution: 'Addis Ababa University',
    format: 'PDF',
    size: '2.8 MB',
    downloads: 1420,
    description: 'Complete institutional guidelines containing department cutoffs, registration timelines, semester cost sharing tables, and campus accommodation details.'
  },
  {
    id: 'res-2',
    title: 'ASTU School of Engineering 4-Year Curriculum Handbook',
    category: 'Curriculum',
    institution: 'Adama Science & Technology University',
    format: 'PDF',
    size: '4.1 MB',
    downloads: 980,
    description: 'Detailed modular course outlines, ECTS credit distributions, laboratory requirements, and senior capstone guidelines for all undergraduate engineering tracks.'
  },
  {
    id: 'res-3',
    title: 'National STEM Merit Scholarship Application Form & Dossier Guide',
    category: 'Scholarship Form',
    institution: 'Ministry of Education',
    format: 'DOCX',
    size: '640 KB',
    downloads: 2150,
    description: 'Official standard application document and endorsement template required when applying for governmental higher education STEM funding.'
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  const filtered = RESOURCES_LIST.filter(res => 
    !searchQuery || 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/Butler-Exterior-2-scaled.jpg"
            alt="Library Resources Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400">Library</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Educational Resources & Guides</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Download verified institutional admission booklets, university curricula, scholarship forms, and academic calendars.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search guides, curricula, forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Showing <strong>{filtered.length}</strong> Resources
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(res => (
          <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">{res.category}</span>
                <span className="text-xs text-slate-500 font-medium">{res.format} • {res.size}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-500">{res.institution}</p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">{res.downloads.toLocaleString()} downloads</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewItem(res)}>
                  Preview
                </Button>
                <Button variant="primary" size="sm" onClick={() => alert(`Downloading "${res.title}" (${res.format})`)}>
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewItem && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
          size="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <p>{previewItem.description}</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p><strong>Affiliated Institution:</strong> {previewItem.institution}</p>
              <p><strong>Document Category:</strong> {previewItem.category}</p>
              <p><strong>File Type & Size:</strong> {previewItem.format} ({previewItem.size})</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="primary" size="sm" onClick={() => {
                alert(`Downloading ${previewItem.title}`);
                setPreviewItem(null);
              }}>
                Download Official File
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
