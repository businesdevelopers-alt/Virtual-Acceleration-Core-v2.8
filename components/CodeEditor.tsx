
import React from 'react';
import Editor from "https://esm.sh/@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  onChange?: (value: string | undefined) => void;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language = 'typescript', 
  theme = 'vs-dark', 
  onChange,
  height = "500px"
}) => {
  return (
    <div className="w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-900">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
            {language.toUpperCase()} Core Source
          </span>
        </div>
        <div className="flex gap-4">
           <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
             AI Optimized
           </span>
        </div>
      </div>
      <div className="relative">
        <Editor
          height={height}
          defaultLanguage={language}
          defaultValue={code}
          theme={theme}
          onChange={onChange}
          options={{
            minimap: { enabled: true },
            folding: true,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            padding: { top: 20, bottom: 20 }
          }}
        />
      </div>
    </div>
  );
};
