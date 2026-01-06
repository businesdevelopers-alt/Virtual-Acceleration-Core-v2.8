
import React, { useState } from 'react';
import { Template, TemplateSubmission } from '../types';
import { evaluateTemplateAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface TemplateFormProps {
  template: Template;
  onSave: (submission: Partial<TemplateSubmission>) => void;
  onClose: () => void;
  isDark?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSave, onClose, isDark }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<{ score: number, feedback: string, approved: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    
    try {
      const evaluation = await evaluateTemplateAI(template.title, formData);
      setResult(evaluation);
      
      if (evaluation.approved) {
        playCelebrationSound();
      } else {
        playPositiveSound();
      }
      
      onSave({
        templateId: template.id,
        data: formData,
        aiScore: evaluation.score,
        aiFeedback: evaluation.feedback,
        status: evaluation.approved ? 'APPROVED' : 'REVISION_REQUIRED'
      });
    } catch (err) {
      alert("فشل التقييم الذكي. حاول مرة أخرى.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in" dir="rtl">
      <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-[3.5rem] border ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} p-10 md:p-14 shadow-3xl animate-fade-in-up`}>
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">{template.icon}</div>
            <div>
              <h3 className="text-3xl font-black">{template.title}</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Smart Executive Template</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">✕</button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              {template.fields.map(field => (
                <div key={field.id} className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-sm font-black text-blue-500 uppercase tracking-widest">{field.label}</label>
                    <span className="text-[10px] text-slate-500 font-bold italic">{field.instruction}</span>
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required
                      className={`w-full h-32 p-6 rounded-3xl border outline-none focus:ring-4 transition-all font-medium resize-none
                        ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500/10' : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/5'}
                      `}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                    />
                  ) : (
                    <input 
                      required
                      className={`w-full p-6 rounded-2xl border outline-none focus:ring-4 transition-all font-bold
                        ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500/10' : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/5'}
                      `}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={isEvaluating}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isEvaluating ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري التدقيق الذكي...</span>
                </>
              ) : (
                <>
                  <span>اعتماد المخرج والتقييم</span>
                  <span className="text-2xl">✨</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-10 animate-fade-in">
             <div className={`p-10 rounded-[3rem] border-4 ${result.approved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="flex justify-between items-center mb-8">
                   <h4 className={`text-2xl font-black ${result.approved ? 'text-emerald-500' : 'text-amber-500'}`}>
                     {result.approved ? 'تم الاعتماد بنجاح' : 'يتطلب تحسين المحتوى'}
                   </h4>
                   <div className="text-center">
                      <p className="text-4xl font-black">{result.score}%</p>
                      <p className="text-[10px] font-bold uppercase text-slate-500">Quality Score</p>
                   </div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">توصية المستشار الذكي:</p>
                   <p className="text-lg font-medium leading-relaxed italic">"{result.feedback}"</p>
                </div>
             </div>

             <div className="flex gap-4">
                {!result.approved && (
                  <button onClick={() => setResult(null)} className="flex-1 py-5 bg-slate-800 text-white rounded-2xl font-black transition-all hover:bg-slate-700">تعديل البيانات</button>
                )}
                <button onClick={onClose} className={`flex-1 py-5 rounded-2xl font-black shadow-xl transition-all ${result.approved ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {result.approved ? 'إنهاء وحفظ' : 'حفظ كمسودة والعودة'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
