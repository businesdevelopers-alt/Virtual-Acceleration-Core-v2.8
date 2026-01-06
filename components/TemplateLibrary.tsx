
import React, { useState } from 'react';
import { TEMPLATES_LIBRARY, Template, TemplateSubmission, UserRole } from '../types';
import { TemplateForm } from './TemplateForm';

interface TemplateLibraryProps {
  userRole: UserRole;
  isDark?: boolean;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ userRole, isDark }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, TemplateSubmission>>({});

  const userTemplates = TEMPLATES_LIBRARY.filter(t => t.role.includes(userRole));

  const handleSave = (submission: Partial<TemplateSubmission>) => {
    if (submission.templateId) {
      setSubmissions(prev => ({
        ...prev,
        [submission.templateId!]: {
          ...submission,
          updatedAt: new Date().toISOString()
        } as TemplateSubmission
      }));
    }
  };

  const getStatusBadge = (templateId: string) => {
    const sub = submissions[templateId];
    if (!sub) return <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg border border-slate-200">لم يبدأ</span>;
    
    switch (sub.status) {
      case 'APPROVED': return <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg border border-emerald-500/20">معتمد ✓</span>;
      case 'REVISION_REQUIRED': return <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg border border-amber-500/20">يحتاج تعديل !</span>;
      default: return <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg border border-blue-500/20">مسودة</span>;
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-black">مختبر القوالب التنفيذية</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">أدوات عملية لبناء مخرجات مشروعك بجودة استثمارية.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-2 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 text-xs font-black">
             قوالب إلزامية: {userTemplates.filter(t => t.isMandatory).length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userTemplates.map(template => (
          <div 
            key={template.id} 
            onClick={() => setSelectedTemplate(template)}
            className={`card-premium p-10 cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden
              ${submissions[template.id]?.status === 'APPROVED' ? 'border-emerald-500/30' : ''}
            `}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
            
            <div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                {getStatusBadge(template.id)}
              </div>

              <h3 className="text-2xl font-black mb-3 group-hover:text-blue-500 transition-colors">{template.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{template.description}</p>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
               <span className={`text-[10px] font-black uppercase tracking-widest ${template.isMandatory ? 'text-rose-500' : 'text-slate-400'}`}>
                 {template.isMandatory ? '● متطلب إلزامي' : 'اختياري'}
               </span>
               <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all">
                  <span>فتح القالب</span>
                  <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7" strokeWidth={3} /></svg>
               </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <TemplateForm 
          template={selectedTemplate} 
          isDark={isDark}
          onClose={() => setSelectedTemplate(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
