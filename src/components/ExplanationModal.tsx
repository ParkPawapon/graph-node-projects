import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { EXPLANATIONS } from '@/data/explanations';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  algoKey: string;
}

export default function ExplanationModal({ isOpen, onClose, algoKey }: ExplanationModalProps) {
  if (!isOpen) return null;

  const data = EXPLANATIONS[algoKey];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-indigo-500" />
            {data.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-zinc-300">
          
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
            <h3 className="text-indigo-400 font-semibold mb-2 text-sm uppercase tracking-wider">Concept (หลักการ)</h3>
            <p className="text-zinc-200 leading-relaxed text-sm md:text-base">{data.concept}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-800">
               <h3 className="text-emerald-400 font-semibold mb-2 text-sm uppercase tracking-wider">Data Structure</h3>
               <p className="text-sm">{data.dataStructure}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-800">
               <h3 className="text-amber-400 font-semibold mb-2 text-sm uppercase tracking-wider">Complexity</h3>
               <p className="text-sm">{data.complexity}</p>
            </div>
          </div>

          <div>
            <h3 className="text-zinc-100 font-semibold mb-3 text-sm uppercase tracking-wider">Algorithm Steps (ขั้นตอนการทำงาน)</h3>
            <ul className="space-y-2">
                {data.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm p-3 bg-zinc-950/50 rounded-md border border-zinc-800/50">
                        <span className="text-zinc-500 font-mono shrink-0">{index + 1}.</span>
                        <span>{step}</span>
                    </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-100 font-semibold mb-2 text-sm uppercase tracking-wider">Application (การนำไปใช้)</h3>
            <p className="text-sm text-zinc-400">{data.application}</p>
          </div>

        </div>
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/30 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors"
            >
                Close
            </button>
        </div>

      </div>
    </div>
  );
}