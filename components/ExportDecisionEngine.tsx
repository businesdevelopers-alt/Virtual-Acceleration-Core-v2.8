
import React, { useState, useEffect } from 'react';
import { analyzeExportOpportunity } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface ExportDecisionEngineProps {
  onBack: () => void;
}

export const ExportDecisionEngine: React.FC<ExportDecisionEngineProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '',
    sector: 'Industrial',
    readiness: 'High',
    targetMarket: '',
    timing: 'Q4 2024'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.productType || !formData.targetMarket) return;
      setIsAnalyzing(true);
      setStep(2);
      
      try {
        const analysisResult = await analyzeExportOpportunity(formData);
        setResult(analysisResult);
        playPositiveSound();
        
        // Auto progress to step 3 after simulation
        setTimeout(() => {
          setStep(3);
          playCelebrationSound();
        }, 3000);
      } catch (e) {
        setStep(1);
      } finally {
        setIsAnalyzing(false);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">كيف تعمل المنصة؟</h1>
            <p className="text-slate-500">سير عمل محرك NEDE لاتخاذ قرار التصدير الذكي</p>
          </div>
          <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500
                ${step >= s ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-400'}
              `}>
                {s}
              </div>
              <span className={`text-[10px] font-bold ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? 'إدخال البيانات' : s === 2 ? 'التحليل الذكي' : s === 3 ? 'القرار' : 'التوصيات'}
              </span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 min-h-[500px] flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-fade-in-up space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 border-r-4 border-blue-600 pr-4">الخطوة 1: إدخال بيانات المنتج</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">نوع المنتج</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="مثال: زيت زيتون بكر ممتاز"
                    value={formData.productType}
                    onChange={e => setFormData({...formData, productType: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">القطاع</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none"
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value})}
                  >
                    <option value="Industrial">صناعي وإنتاجي</option>
                    <option value="Food">أغذية ومشروبات</option>
                    <option value="Tech">تقني وتكنولوجي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">جاهزية الإنتاج</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none"
                    value={formData.readiness}
                    onChange={e => setFormData({...formData, readiness: e.target.value})}
                  >
                    <option value="High">إنتاج كثيف (تصديري)</option>
                    <option value="Medium">متوسط</option>
                    <option value="Low">محدود</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">السوق المستهدف</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none"
                    placeholder="مثال: السوق الأوروبي"
                    value={formData.targetMarket}
                    onChange={e => setFormData({...formData, targetMarket: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={handleNext}
                disabled={!formData.productType || !formData.targetMarket}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
              >
                بدء التحليل الذكي NEDE
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center animate-fade-in text-center space-y-8">
               <div className="relative w-32 h-32">
                 <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                 <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-3xl animate-pulse">⚙️</span>
                 </div>
               </div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900 mb-4">الخطوة 2: التحليل الذكي</h2>
                 <p className="text-slate-500 max-w-md mx-auto">يقوم محرك NEDE بفحص الطلب العالمي، المتطلبات التنظيمية، والمخاطر اللوجستية لضمان قرار تصديري آمن.</p>
               </div>
               <div className="flex gap-2">
                 {['الطلب', 'التنظيمات', 'اللوجستيات', 'الموسمية'].map(tag => (
                   <span key={tag} className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 animate-pulse">فحص {tag}...</span>
                 ))}
               </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="animate-fade-in-up space-y-10">
               <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-slate-800 border-r-4 border-blue-600 pr-4">الخطوة 3: القرار</h2>
                  <div className={`px-6 py-2 rounded-full font-black text-sm border-2
                    ${result.decision === 'EXPORT_NOW' ? 'bg-green-50 text-green-700 border-green-200' : 
                      result.decision === 'WAIT' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}
                  `}>
                    {result.decision === 'EXPORT_NOW' ? 'صدّر الآن' : result.decision === 'WAIT' ? 'انتظر قليلاً' : 'لا تصدّر لهذا السوق'}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'الطلب العالمي', content: result.analysis.demand, icon: '🌍' },
                    { title: 'المتطلبات التنظيمية', content: result.analysis.regulations, icon: '📜' },
                    { title: 'المخاطر اللوجستية', content: result.analysis.risks, icon: '🚛' },
                    { title: 'التوقيت والموسمية', content: result.analysis.seasonality, icon: '📅' }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-4">
                       <span className="text-2xl shrink-0">{item.icon}</span>
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <button 
                onClick={handleNext}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all"
              >
                عرض التوصيات والأسواق البديلة
              </button>
            </div>
          )}

          {step === 4 && result && (
            <div className="animate-fade-in-up space-y-10">
               <h2 className="text-2xl font-bold text-slate-800 border-r-4 border-blue-600 pr-4">الخطوة 4: التوصيات</h2>
               
               <div className="space-y-4">
                  <p className="text-slate-600 font-medium">بناءً على تحليل NEDE، إليك أفضل الخيارات الاستراتيجية:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl shadow-blue-100">
                        <h4 className="font-black text-lg mb-4">💡 أسواق بديلة مقترحة</h4>
                        <ul className="space-y-3">
                           {result.recommendations.map((rec: string, i: number) => (
                             <li key={i} className="flex gap-2 items-center text-sm">
                               <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</span>
                               {rec}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100">
                        <h4 className="font-black text-lg text-slate-800 mb-4">🚀 تحسينات مقترحة</h4>
                        <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
                           <p>• تعديل التوقيت ليتناسب مع ذروة الطلب في الربع الثاني.</p>
                           <p>• مواءمة مواصفات التغليف مع المعايير البيئية للسوق المستهدف.</p>
                           <p>• التعاقد مع شركاء لوجستيين محليين لتقليل مخاطر التوزيع.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={onBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">العودة للرئيسية</button>
                  <button onClick={() => setStep(1)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">تحليل منتج آخر</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
