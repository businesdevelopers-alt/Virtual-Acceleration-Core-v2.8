
import React, { useState } from 'react';
import { simulateBrutalTruth } from '../services/geminiService';
import { FailureSimulation } from '../types';

export const SmartFeatures: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FailureSimulation | null>(null);
  const [formData, setFormData] = useState({ productType: '', targetMarket: '', readiness: 'Medium' });

  const handleBrutalTruth = async () => {
    if (!formData.productType || !formData.targetMarket) return;
    setLoading(true);
    try {
      const data = await simulateBrutalTruth(formData);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">الميزات الذكية: محرك المواجهة</h1>
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">إغلاق</button>
        </div>

        {!result ? (
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md animate-fade-in-up">
            <h2 className="text-xl font-bold mb-6">أدخل بيانات التصدير للحصول على "الحقيقة القاسية"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">نوع المنتج</label>
                <input 
                  className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/50" 
                  placeholder="مثال: تمور فاخرة"
                  onChange={e => setFormData({...formData, productType: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">السوق المستهدف</label>
                <input 
                  className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/50" 
                  placeholder="مثال: السوق الصيني"
                  onChange={e => setFormData({...formData, targetMarket: e.target.value})}
                />
              </div>
            </div>
            
            <button 
              onClick={handleBrutalTruth}
              disabled={loading}
              className="group relative w-full py-6 bg-red-600 hover:bg-red-700 rounded-3xl font-black text-xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {loading ? 'جاري تحليل الثغرات...' : '🔥 اضغط للحصول على الحقيقة القاسية'}
            </button>
            <p className="text-center mt-4 text-xs text-slate-500 italic">ملاحظة: هذا المحرك مصمم لكشف المخاطر التي لا تريد سماعها.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-red-950/30 border-2 border-red-500 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-4 left-4 text-5xl opacity-20">⚠️</div>
               <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-2">تصريح محرك الحقيقة</h3>
               <p className="text-3xl font-black leading-tight">"{result.brutalTruth}"</p>
               <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/20 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-400 mb-1">احتمالية الفشل</p>
                    <p className="text-2xl font-black text-red-500">{result.probability}%</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-400 mb-1">الخسارة المالية المتوقعة</p>
                    <p className="text-2xl font-black text-orange-500">{result.financialLoss}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-400 mb-1">التأثير التشغيلي</p>
                    <p className="text-sm font-bold">{result.operationalImpact}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">🔍</span>
                    محرك الأسئلة المفقودة
                  </h4>
                  <div className="space-y-4">
                    {result.missingQuestions.map((q, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border-r-4 border-blue-500 text-sm">
                        {q}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-sm">🛡️</span>
                    نظام التعافي الذكي
                  </h4>
                  <div className="space-y-4">
                    {result.recoveryPlan.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-xs flex items-center justify-center font-bold shrink-0">{i+1}</span>
                        <p className="text-sm text-slate-300">{step}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <button onClick={() => setResult(null)} className="w-full py-4 text-slate-400 hover:text-white transition-colors">محاولة تحليل أخرى</button>
          </div>
        )}
      </div>
    </div>
  );
};
