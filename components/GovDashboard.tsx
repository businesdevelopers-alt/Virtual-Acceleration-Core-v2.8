
import React, { useEffect, useState } from 'react';
import { getGovInsights } from '../services/geminiService';
import { GovStats } from '../types';

export const GovDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [stats, setStats] = useState<GovStats | null>(null);

  useEffect(() => {
    getGovInsights().then(setStats);
  }, []);

  if (!stats) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">جاري تحميل الرؤية الوطنية...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900">لوحة الجهات الحكومية</h1>
            <p className="text-slate-500">رؤية وطنية مبنية على بيانات التصدير الذكية</p>
          </div>
          <button onClick={onBack} className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold">خروج</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-red-500">🚩</span> الأسواق الأكثر تسبباً للفشل
              </h3>
              <div className="space-y-4">
                {stats.riskyMarkets.map((m, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm font-bold w-24">{m.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${m.failRate}%` }}></div>
                    </div>
                    <span className="text-xs text-red-500 font-black">{m.failRate}%</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-green-500">🚀</span> القطاعات الأكثر جاهزية للتصدير
              </h3>
              <div className="space-y-4">
                {stats.readySectors.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm font-bold w-24">{s.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${s.score}%` }}></div>
                    </div>
                    <span className="text-xs text-green-500 font-black">{s.score}/100</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-blue-900 text-white p-8 rounded-[2rem] md:col-span-2">
              <h3 className="font-bold mb-6">📉 أسباب التعثر المتكررة (تحليل NEDE)</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.commonFailReasons.map((r, i) => (
                  <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-blue-200 uppercase font-black mb-1">{r.reason}</p>
                    <p className="text-2xl font-black">{r.percentage}%</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">⚖️ فجوات تنظيمية</h3>
              <ul className="space-y-3">
                {stats.regulatoryGaps.map((gap, i) => (
                  <li key={i} className="text-xs text-slate-500 flex gap-2">
                    <span className="text-blue-500">•</span> {gap}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">تصميم سياسة دعم</button>
           </div>
        </div>
      </div>
    </div>
  );
};
