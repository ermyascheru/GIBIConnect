import React, { useState } from 'react';
import { Search, FileText, Download, Eye, CheckCircle2 } from 'lucide-react';

interface AcademicDoc {
  id: string;
  title: string;
  universityCode: string;
  category: 'SYLLABUS' | 'EXAM' | 'RESEARCH' | 'LECTURE';
  pages: number;
  fileSize: string;
  uploadedYear: string;
}

interface ResourcesPageProps {
  theme?: 'light' | 'dark';
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<AcademicDoc | null>(null);

  const documents: AcademicDoc[] = [
    {
      id: 'doc-1',
      title: 'ASTU Software Engineering Undergraduate Curriculum & Syllabus',
      universityCode: 'ASTU',
      category: 'SYLLABUS',
      pages: 42,
      fileSize: '2.4 MB',
      uploadedYear: '2016 E.C.',
    },
    {
      id: 'doc-2',
      title: 'AAU Medicine Final National Qualifying Examination (Past Paper)',
      universityCode: 'AAU',
      category: 'EXAM',
      pages: 18,
      fileSize: '1.8 MB',
      uploadedYear: '2015 E.C.',
    },
    {
      id: 'doc-3',
      title: 'Bahir Dar University Institute of Technology Academic Bulletin',
      universityCode: 'BDU',
      category: 'SYLLABUS',
      pages: 65,
      fileSize: '4.1 MB',
      uploadedYear: '2016 E.C.',
    },
    {
      id: 'doc-4',
      title: 'Jimma University CBE Community Health Practice Guidelines',
      universityCode: 'JU',
      category: 'RESEARCH',
      pages: 30,
      fileSize: '2.9 MB',
      uploadedYear: '2016 E.C.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className={`text-3xl font-serif font-bold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Academic Resource & Research Repository
        </h1>
        <p className={`mt-2 text-sm leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-slate-500'
        }`}>
          Search, stream, and download official university syllabi, lecture slides, and past examinations.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search documents (e.g. Software Syllabus, Past Exams)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-600' 
                : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'SYLLABUS', 'EXAM', 'RESEARCH'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? (isDark ? 'bg-white text-black border-white shadow-sm font-bold' : 'bg-slate-900 text-white border-slate-900 shadow-sm')
                  : (isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700 shadow-none' 
                : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'text-slate-700 bg-slate-100'
                }`}>
                  {doc.universityCode}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 border ${
                  isDark 
                    ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/60' 
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> Verified Document
                </span>
              </div>

              <h3 className={`font-serif font-bold text-base mt-3 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {doc.title}
              </h3>

              <div className={`mt-4 flex items-center gap-4 text-xs ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                <span>{doc.pages} Pages</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span>Uploaded {doc.uploadedYear}</span>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
              isDark ? 'border-zinc-800' : 'border-slate-100'
            }`}>
              <button
                onClick={() => setActivePreviewDoc(doc)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isDark ? 'text-[#5AA7A7] hover:text-white' : 'text-[#0C373D] hover:text-[#5AA7A7]'
                }`}
              >
                <Eye className="w-4 h-4 text-[#5AA7A7]" />
                <span>In-Browser Stream</span>
              </button>

              <button className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                isDark 
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                  : 'bg-[#0C373D] text-white hover:bg-[#072428]'
              }`}>
                <Download className="w-3.5 h-3.5 text-[#5AA7A7]" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* In-Browser PDF Previewer Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className={`w-full max-w-3xl rounded-3xl p-8 border shadow-2xl relative max-h-[90vh] flex flex-col justify-between ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
          }`}>
            <div>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-zinc-800' : 'border-[#E2E8F0]'
              }`}>
                <div>
                  <span className="text-xs font-bold text-[#5AA7A7] uppercase tracking-wider">
                    Official Document Stream
                  </span>
                  <h3 className={`text-lg font-serif font-bold mt-0.5 ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}>
                    {activePreviewDoc.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className={`font-bold text-xl px-2 cursor-pointer ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* Simulated PDF Viewer Window */}
              <div className={`mt-6 h-80 rounded-2xl border flex flex-col items-center justify-center text-center p-8 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}>
                <FileText className={`w-12 h-12 mb-3 ${isDark ? 'text-zinc-600' : 'text-[#5AA7A7]'}`} />
                <p className={`font-bold text-sm ${isDark ? 'text-zinc-200' : 'text-[#0F172A]'}`}>PDF Document Stream Viewer</p>
                <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  Official registrar document streamed securely outside public web root with watermarked verification provenance.
                </p>
              </div>
            </div>

            <div className={`mt-6 flex justify-end gap-3 pt-4 border-t ${
              isDark ? 'border-zinc-800' : 'border-[#E2E8F0]'
            }`}>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className={`px-5 py-2 text-xs font-semibold cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Close Preview
              </button>
              <button className="px-6 py-2 bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer">
                Save to Student Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};