
import React from 'react';
import { UserProfile, DIGITAL_SHIELDS } from '../types';

interface CertificateProps {
  user: UserProfile;
  onClose: () => void;
}

const THEME = {
  containerBg: 'bg-[#FCFAF7]',
  outerBorder: 'border-[#AF9058]',
  innerBorder: 'border-[#C5A059]/30',
  textTitle: 'text-[#4A3F35]',
  textBody: 'text-[#6B5E51]',
  textName: 'text-[#2D241E]',
  accent: 'text-[#AF9058]',
  sealBorder: 'border-[#AF9058]',
  sealBg: 'bg-gradient-to-br from-[#FDFBF7] to-[#E8DCC4]',
  sealIcon: 'text-[#967B4F]',
  logoBg: 'bg-[#4A3F35]',
  logoIcon: 'text-[#E8DCC4]',
  signatureLine: 'border-[#AF9058]/40'
};

export const Certificate: React.FC<CertificateProps> = ({ user, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-2xl">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #certificate-container { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 210mm; 
            height: 297mm; 
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
        .cert-pattern {
          background-image: radial-gradient(#AF9058 0.5px, transparent 0.5px);
          background-size: 20px 20px;
          opacity: 0.03;
        }
      `}</style>

      <div className="relative max-w-4xl w-full rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col bg-white overflow-hidden max-h-[95vh] animate-fade-up">
        {/* Top bar for modal controls */}
        <div className="no-print absolute top-6 left-6 right-6 flex justify-between items-center z-50">
           <button onClick={onClose} className="bg-white/90 backdrop-blur hover:bg-white p-3 rounded-2xl transition-all shadow-xl active:scale-90 font-black text-slate-400 hover:text-slate-900">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           <div className="flex gap-3">
             <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                تنزيل بصيغة PDF
             </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-10 bg-slate-100 no-print">
          {/* Certificate Design Start */}
          <div id="certificate-container" className={`relative p-1 md:p-4 transition-all duration-1000 ${THEME.containerBg} shadow-2xl`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 cert-pattern"></div>
            
            <div className={`relative border-[12px] border-double p-8 md:p-16 text-center min-h-[900px] flex flex-col justify-between shadow-inner transition-colors duration-500 ${THEME.outerBorder} ${THEME.containerBg}`}>
              
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#AF9058] opacity-40"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#AF9058] opacity-40"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#AF9058] opacity-40"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#AF9058] opacity-40"></div>

              {/* Inner Decorative Border */}
              <div className={`absolute inset-4 border border-[#AF9058]/20 pointer-events-none z-10`}></div>
              
              {/* Header Section */}
              <div className="relative z-10 pt-10">
                 <div className={`relative mx-auto w-28 h-28 mb-8 rounded-[2.5rem] flex items-center justify-center border-4 shadow-2xl ${THEME.logoBg} border-[#AF9058] transform -rotate-3`}>
                    <svg className={`h-14 w-14 ${THEME.logoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 <h4 className={`text-[11px] font-black tracking-[0.5em] uppercase ${THEME.accent} mb-4`}>Business Developers Accelerator</h4>
                 <h1 className={`text-6xl md:text-7xl font-black mb-4 ${THEME.textTitle} font-sans tracking-tight`}>شهادة تخرج</h1>
                 <div className="h-0.5 w-32 bg-[#AF9058] mx-auto opacity-30"></div>
              </div>

              {/* Main Content Body */}
              <div className="my-12 space-y-8 relative z-10" dir="rtl">
                <p className={`text-2xl italic font-medium ${THEME.textBody} tracking-wide`}>تتقدم إدارة المسرعة بمنح هذه الشهادة لـ</p>
                
                <div className="relative inline-block px-12 pb-2">
                   <h2 className={`text-6xl md:text-8xl font-black ${THEME.textName} tracking-tighter`}>
                    {user.firstName} {user.lastName}
                   </h2>
                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#AF9058] to-transparent"></div>
                </div>

                <div className="pt-4 space-y-4">
                  <p className={`text-xl font-medium ${THEME.textBody}`}>تقديراً لجهوده الاستثنائية وإتمامه بنجاح كافة متطلبات البرنامج التدريبي</p>
                  <p className={`text-xl font-medium ${THEME.textBody}`}>لبناء وتطوير مشروعه الناشئ</p>
                  <h3 className={`text-4xl font-black py-4 px-12 inline-block rounded-3xl bg-slate-900/5 ${THEME.textTitle} shadow-sm`}>
                    "{user.startupName}"
                  </h3>
                </div>
              </div>

              {/* Digital Shields / Achievements */}
              <div className="relative z-10 py-12 bg-[#AF9058]/5 rounded-[3rem] border border-[#AF9058]/10 mx-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#AF9058] mb-8">Specializations Earned</p>
                  <div className="flex justify-center gap-10">
                      {DIGITAL_SHIELDS.map(s => (
                          <div key={s.id} className="flex flex-col items-center gap-3 transform hover:scale-110 transition-transform cursor-default">
                              <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${s.color} flex items-center justify-center text-4xl shadow-xl border-4 border-white`}>
                                  {s.icon}
                              </div>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.name.split(' ')[1]}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Footer Section: Dates & Signatures */}
              <div className="flex justify-between items-end mt-16 px-16 relative z-10" dir="rtl">
                <div className="text-right flex-1">
                  <p className={`text-[10px] mb-3 uppercase tracking-widest font-black opacity-60 ${THEME.accent}`}>تاريخ الإصدار</p>
                  <div className={`text-xl font-black ${THEME.textTitle} border-b-2 ${THEME.signatureLine} pb-3 w-48 text-center`}>
                    {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                {/* Official Golden Seal */}
                <div className="flex-shrink-0 relative mx-12">
                   <div className={`w-32 h-32 border-4 rounded-full flex flex-col items-center justify-center shadow-2xl ${THEME.sealBg} ${THEME.sealBorder} relative group`}>
                      <div className="absolute inset-2 border border-[#AF9058]/20 rounded-full"></div>
                      <div className="absolute inset-0 animate-spin-slow opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#AF9058]">
                          <path d="M50 0L55 35L90 35L60 55L75 90L50 70L25 90L40 55L10 35L45 35Z" />
                        </svg>
                      </div>
                      <span className="text-4xl mb-1 relative z-10">⚜️</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter relative z-10 ${THEME.sealIcon}">Verified Official</span>
                   </div>
                </div>

                <div className="text-right flex-1 flex flex-col items-end">
                   <p className={`text-[10px] mb-3 uppercase tracking-widest font-black opacity-60 ${THEME.accent}`}>المدير التنفيذي</p>
                   <div className={`w-56 border-b-2 ${THEME.signatureLine} pb-3 h-14 flex items-end justify-center ${THEME.textTitle} relative`}>
                      <span className="italic text-2xl opacity-80 font-serif text-[#4A3F35]">Ahmed Bin Saud</span>
                      {/* Floating Seal Over Signature */}
                      <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 text-[8px] font-black uppercase">Signed</div>
                   </div>
                </div>
              </div>

              {/* Security ID */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <p className="text-[8px] font-mono text-slate-300 tracking-[0.5em] uppercase">Security ID: BD-ACC-CERT-{Math.floor(Date.now()/1000)}</p>
              </div>
            </div>
          </div>
          {/* Certificate Design End */}
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print bg-slate-900 p-8 flex justify-center gap-6 border-t border-white/5">
            <button 
              onClick={handlePrint} 
              className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              <span>تحميل المستند الرسمي</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
            <button 
              onClick={onClose} 
              className="px-12 py-5 bg-white/5 border border-white/10 text-slate-300 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all"
            >
              العودة للمنصة
            </button>
        </div>
      </div>
    </div>
  );
};
