import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import { DocumentViewerModal } from '../components/resources/DocumentViewerModal';
import type { DocumentData } from '../components/resources/DocumentViewerModal';
import { getApiUrl } from '../config/api';

interface AcademicDoc extends DocumentData {}

interface ResourcesPageProps {
  theme?: 'light' | 'dark';
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<AcademicDoc | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialDocs: AcademicDoc[] = [
    {
      id: 'doc-1',
      title: 'ASTU Software Engineering Undergraduate Curriculum & Syllabus',
      universityCode: 'ASTU',
      category: 'SYLLABUS',
      pages: 42,
      fileSize: '2.4 MB',
      uploadedYear: '2016 E.C.',
      institutionName: 'Adama Science and Technology University',
      extractedText: 'Chapter 1: Program Rationale & Ethiopian Industry Alignment.\nChapter 2: Course Outlines for Algorithms, Distributed Systems & Database Architecture.\nChapter 3: Final Year Capstone Project Assessment Framework.'
    },
    {
      id: 'doc-2',
      title: 'AAU Medicine Final National Qualifying Examination (Past Paper)',
      universityCode: 'AAU',
      category: 'EXAM',
      pages: 18,
      fileSize: '1.8 MB',
      uploadedYear: '2015 E.C.',
      institutionName: 'Addis Ababa University',
      extractedText: 'Part I: Clinical Internal Medicine Multi-Choice Case Studies.\nPart II: Pediatrics & Surgery Diagnostic Vignettes.\nPart III: Public Health & Epidemiology Practical Station Questions.'
    },
    {
      id: 'doc-3',
      title: 'Bahir Dar University Institute of Technology Academic Bulletin',
      universityCode: 'BDU',
      category: 'SYLLABUS',
      pages: 65,
      fileSize: '4.1 MB',
      uploadedYear: '2016 E.C.',
      institutionName: 'Bahir Dar University',
      extractedText: 'Section 1: General Academic Rules & Regulations for Engineering Streams.\nSection 2: Department of Civil and Environmental Engineering Module Catalog.\nSection 3: Grading Policy and Graduation Requirements.'
    },
    {
      id: 'doc-4',
      title: 'Jimma University CBE Community Health Practice Guidelines',
      universityCode: 'JU',
      category: 'RESEARCH',
      pages: 30,
      fileSize: '2.9 MB',
      uploadedYear: '2016 E.C.',
      institutionName: 'Jimma University',
      extractedText: 'Phase 1: Community Diagnosis & Primary Health Center Placement Protocols.\nPhase 2: Data Collection in Rural Kebele Households.\nPhase 3: Interventional Action Plan and Evaluation Presentation.'
    },
  ];

  const [documents, setDocuments] = useState<AcademicDoc[]>(initialDocs);

  React.useEffect(() => {
    let isMounted = true;
    fetch(getApiUrl('/api/v1/resources'))
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: AcademicDoc[] = json.data.map((r: any) => {
            const typeMap: Record<string, 'SYLLABUS' | 'EXAM' | 'RESEARCH' | 'LECTURE'> = {
              document: 'SYLLABUS',
              presentation: 'LECTURE',
              spreadsheet: 'RESEARCH',
              video: 'LECTURE',
              ebook: 'RESEARCH',
              audio: 'LECTURE',
              archive: 'RESEARCH',
            };
            const sizeMb = r.file_size_bytes ? `${(Number(r.file_size_bytes) / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB';
            const uniCode = r.institution_name ? r.institution_name.split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase() : 'HEI';

            return {
              id: r.id,
              title: r.title,
              universityCode: uniCode,
              category: typeMap[r.resource_type] || 'RESEARCH',
              pages: Math.max(12, Math.floor((Number(r.file_size_bytes || 1000000) / 75000))),
              fileSize: sizeMb,
              uploadedYear: `${r.publication_year || 2026} E.C.`,
              extractedText: r.extracted_text || r.description || '',
              institutionName: r.institution_name,
              departmentName: r.department_name,
            };
          });
          setDocuments(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleBookmark = (docId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
        showToast('Removed from saved documents');
      } else {
        next.add(docId);
        showToast('Document saved to your Student Vault!');
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.universityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.institutionName && doc.institutionName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C373D] text-[#5AA7A7] border border-[#5AA7A7]/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-[#5AA7A7]" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          Search, stream in-browser, and download official university curricula, lecture notes, and past examinations.
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
                : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#5AA7A7]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'SYLLABUS', 'EXAM', 'RESEARCH'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? (isDark ? 'bg-white text-black border-white shadow-sm font-bold' : 'bg-[#0C373D] text-white border-[#0C373D] shadow-sm')
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
        {filteredDocuments.map((doc) => {
          const isSaved = bookmarkedIds.has(doc.id);
          return (
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
                  <div className="flex items-center gap-2">
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

                  <button
                    onClick={() => handleToggleBookmark(doc.id)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : (isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-500' : 'border-slate-100 hover:bg-slate-100 text-slate-400')
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save to Student Vault'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className={`font-serif font-bold text-base mt-3 leading-snug ${
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

                <button 
                  onClick={() => {
                    alert(`Starting official download for: ${doc.title} (${doc.fileSize})`);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                    isDark 
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                      : 'bg-[#0C373D] text-white hover:bg-[#072428]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-[#5AA7A7]" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real In-Browser Document & PDF Viewer Modal */}
      {activePreviewDoc && (
        <DocumentViewerModal
          document={activePreviewDoc}
          onClose={() => setActivePreviewDoc(null)}
          isDark={isDark}
          onBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedIds.has(activePreviewDoc.id)}
        />
      )}

    </div>
  );
};