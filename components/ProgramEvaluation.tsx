
import React, { useState } from 'react';
import { ProgramRating } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface ProgramEvaluationProps {
  onClose: () => void;
  onSubmit: (rating: ProgramRating) => void;
}

export const ProgramEvaluation: React.FC<ProgramEvaluationProps> = ({ onClose, onSubmit }) => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [favoriteFeature, setFavoriteFeature] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const features = [
    'المستشار الذكي (AI)',
    'خريطة نضج المشروع',
    'أدوات مولد الأفكار',
    'الجلسات الإرشادية',
    'نظام التحديات والمهام'
  ];

  const handleSubmit = () => {
    if (stars === 0) return alert('يرجى اختيار عدد النجوم للتقييم.');
    
    const rating: ProgramRating = {
      stars,
      feedback,
      favoriteFeature,
      submittedAt: new Date().toISOString()
    };
    
    playCelebrationSound();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(rating);
    }, 1500);
  };

  return (
    <div className="animate-fade-in-up" dir="rtl">
      <div className="bg-white rounded-[3.5rem] w-full shadow-2xl border border-slate-100 overflow-hidden">
        {isSubmitted ? (
          <div className="p-16 text-center space-y-8">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-5xl animate-bounce">✓</div>
            <h2 className="text-4xl font-black text-slate-900">تم الاستلام بنجاح</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              رأيك هو المحرك الأساسي لتطوير خدماتنا في "بيزنس ديفلوبرز".
            </p>
          </div>
        ) : (
          <div className="p-10 md:p-14">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900">تقييم تجربة الاحتضان</h3>
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-2">Program Impact Metrics</p>
              </div>
            </div>

            <div className="space-y-12">
              {/* Stars Selection */}
              <div className="flex flex-col items-center gap-6 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Overall Satisfaction</p>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => { setStars(star); playPositiveSound(); }}
                      className={`text-6xl transition-all transform hover:scale-110 active:scale-90 ${
                        star <= (hover || stars) ? 'text-amber-400 drop-shadow-lg' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Feature */}
              <div className="space-y-6">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pr-2">ما هو الجزء الأكثر تأثيراً في مشروعك؟</label>
                <div className="flex flex-wrap gap-3">
                  {features.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFavoriteFeature(f); playPositiveSound(); }}
                      className={`px-6 py-4 rounded-[1.4rem] text-sm font-black border-2 transition-all ${
                        favoriteFeature === f 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pr-2">توصيات إضافية لتحسين المنصة:</label>
                <textarea
                  className="w-full h-40 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium resize-none shadow-inner text-lg leading-relaxed"
                  placeholder="نحن نقدر نقدك البناء..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xl shadow-2xl transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4 group"
                >
                  <span>إرسال التقرير النهائي</span>
                  <svg className="w-8 h-8 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
