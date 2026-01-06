
import React, { useEffect, useState } from 'react';
import { FinalResult } from '../../types';
import { playCelebrationSound, playErrorSound } from '../../services/audioService';

interface AssessmentResultProps {
  result: FinalResult;
  onContinue: () => void;
}

const getRadarPoints = (metrics: any, scale: number = 100, center: number = 150) => {
  const keys = ['readiness', 'analysis', 'tech', 'personality', 'strategy', 'ethics'];
  const total = keys.length;
  const angleStep = (Math.PI * 2) / total;
  
  const points = keys.map((key, i) => {
    const value = (metrics[key as keyof typeof metrics] / 100) * scale;
    const angle = i * angleStep - Math.PI / 2;
    const x = center + value * Math.cos(angle);
    const y = center + value * Math.sin(angle);
    return `${x},${y}`;
  });
  
  return points.join(' ');
};

export const AssessmentResult: React.FC<AssessmentResultProps> = ({ result, onContinue }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (result.isQualified) {
      playCelebrationSound();
    } else {
      playErrorSound();
    }
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev >= result.score) {
          clearInterval(interval);
          return result.score;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [result.score, result.isQualified]);

  const radarPath = getRadarPoints(result.metrics);
  const fullPath = getRadarPoints({ readiness: 100, analysis: 100, tech: 100, personality: 100, strategy: 100, ethics: 100 });

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-right" dir="rtl">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Visual Analytics */}
        <div className="flex flex-col items-center animate-fade-in-up order-2 lg:order-1">
           <div className="mb-10 text-center">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest mb-4 inline-block">Competency Radar Map</span>
              <h2 className="text-3xl font-black">تحليل الجاهزية الشامل</h2>
           </div>
           <div className="relative w-[340px] h-[340px] group">
             <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[80px] -z-0"></div>
             <svg width="340" height="340" viewBox="0 0 300 300" className="relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <polygon points={fullPath} fill="rgba(30, 41, 59, 0.5)" stroke="#334155" strokeWidth="1" />
                {[75, 50, 25].map(scale => (
                   <polygon key={scale} points={getRadarPoints({ readiness: scale, analysis: scale, tech: scale, personality: scale, strategy: scale, ethics: scale })} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 2" />
                ))}
                <polygon points={radarPath} fill={result.isQualified ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)"} stroke={result.isQualified ? "#22c55e" : "#ef4444"} strokeWidth="4" className="transition-all duration-1000 ease-out" />
                
                {/* Labels */}
                <text x="150" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">الجاهزية</text>
                <text x="270" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">التحليل</text>
                <text x="270" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">التقنية</text>
                <text x="150" y="280" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">الشخصية</text>
                <text x="30" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">الاستراتيجية</text>
                <text x="30" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">الأخلاقيات</text>
             </svg>
           </div>
        </div>

        {/* Decision Summary */}
        <div className="bg-slate-900/50 p-10 md:p-14 rounded-[3.5rem] border border-white/5 animate-fade-in-up shadow-2xl relative overflow-hidden backdrop-blur-xl order-1 lg:order-2">
           <div className={`absolute top-0 right-0 w-2.5 h-full ${result.isQualified ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}></div>
           
           <div className="flex justify-between items-center mb-10">
             <div className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Admission Score Verdict</div>
             <div className={`text-7xl font-black ${result.isQualified ? 'text-green-400' : 'text-red-400'} tracking-tighter`}>
               {animatedScore}<span className="text-xl text-slate-600 ml-1">/100</span>
             </div>
           </div>

           <div className="mb-12 space-y-6">
             <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest
                ${result.isQualified ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
             `}>
               <span className={`w-2 h-2 rounded-full animate-pulse ${result.isQualified ? 'bg-green-400' : 'bg-red-400'}`}></span>
               {result.isQualified ? "قرار القبول: معتمد للاحتضان" : "قرار القبول: يتطلب تحسين"}
             </div>
             
             <h3 className="text-4xl font-black text-white leading-tight">
               {result.isQualified ? "تهانينا! أنت رائد أعمال مسرعة بيزنس ديفلوبرز" : "تحتاج فكرتك إلى صقل وتطوير أعمق"}
             </h3>
             <p className="text-slate-400 text-lg leading-relaxed font-medium">
               {result.isQualified 
                 ? "لقد تجاوزت عتبة القبول (70%) بنجاح باهر. مشروعك الآن مؤهل لبدء البرنامج التدريبي الافتراضي المكون من 6 مستويات تفاعلية." 
                 : "لم تصل درجتك النهائية إلى الحد الأدنى المطلوب. قمنا بإعداد خطة تطوير مخصصة لمساعدتك في معالجة الثغرات وإعادة المحاولة."}
             </p>
           </div>

           <button 
             onClick={onContinue}
             className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4
               ${result.isQualified 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
               }`}
           >
             <span>{result.isQualified ? "بدء برنامج الاحتضان الآن" : "استلام خطة التحسين"}</span>
             <svg className="w-7 h-7 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           
           <p className="text-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Business Developers Accelerator Hub • AI Verified Admission</p>
        </div>
      </div>
    </div>
  );
};
