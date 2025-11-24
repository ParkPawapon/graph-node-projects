import React from 'react';
import { X, Activity, Zap, GitCommit, Route } from 'lucide-react';

interface ResultData {
  type: 'traversal' | 'path' | 'mst';
  summary: string;
  stats: { label: string; value: string | number; icon?: React.ElementType }[];
  details?: string;
}

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResultData | null;
  algoName: string;
}

export default function ResultModal({ isOpen, onClose, data, algoName }: ResultModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Activity className="text-emerald-500" size={20} />
            <span>Execution Result</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-3 ring-1 ring-emerald-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{data.summary}</h2>
            <p className="text-sm text-zinc-400 uppercase tracking-wide font-medium">{algoName} Completed</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {data.stats.map((stat, index) => (
              <div key={index} className="bg-zinc-800/50 border border-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-zinc-800/80 transition-colors">
                {stat.icon && <stat.icon className="text-zinc-500 mb-2" size={16} />}
                <span className="text-lg font-bold text-zinc-100">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {data.details && (
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Route size={12} />
                Details
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {data.details}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end">
            <button 
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
            >
                Done
            </button>
        </div>

      </div>
    </div>
  );
}