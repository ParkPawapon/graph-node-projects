'use client';

import React, { useEffect, useState } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import GraphEditor from '@/components/GraphEditor';
import ExplanationModal from '@/components/ExplanationModal';
import ResultModal from '@/components/ResultModal';
import ConsolePanel from '@/components/ConsolePanel';
import { 
    Play, RotateCcw, Network, GitGraph, Waypoints, ArrowRightLeft,
    Plus, Trash2, HelpCircle, Activity, Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALGO_MENU = [
    { id: 'DFS', label: 'Depth-First Search', icon: Network },
    { id: 'BFS', label: 'Breadth-First Search', icon: GitGraph },
    { id: 'Dijkstra', label: 'Dijkstra Shortest Path', icon: Waypoints },
    { id: 'MST-Prim', label: "Prim's Algorithm", icon: ArrowRightLeft },
    { id: 'MST-Kruskal', label: "Kruskal's Algorithm", icon: ArrowRightLeft },
];

export default function Page() {
  const { 
      selectedAlgo, 
      setAlgorithm, 
      runAlgorithm, 
      resetGraph, 
      clearCanvas, 
      addNode, 
      isRunning,
      isFinished,
      executionResult,
      animationSpeed,
      setAnimationSpeed
  } = useGraphStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
      setAlgorithm('DFS');
  }, []);

  useEffect(() => {
      if (isFinished && executionResult) {
          setIsResultOpen(true);
      }
  }, [isFinished, executionResult]);

  // Helper to format speed label
  const getSpeedLabel = (ms: number) => {
      if (ms >= 800) return 'Slow';
      if (ms <= 200) return 'Fast';
      return 'Normal';
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-200 font-sans overflow-hidden">
      
      <ExplanationModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        algoKey={selectedAlgo} 
      />

      <ResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        data={executionResult}
        algoName={ALGO_MENU.find(a => a.id === selectedAlgo)?.label || selectedAlgo}
      />

      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
            <h1 className="font-bold text-xl text-white tracking-tight">GraphViz <span className="text-indigo-500">.io</span></h1>
            <p className="text-xs text-zinc-500 mt-1">CSS113 Project</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-medium text-zinc-500 mb-3 px-2 uppercase tracking-wider">Algorithms</p>
            {ALGO_MENU.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setAlgorithm(item.id)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        selectedAlgo === item.id 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    )}
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
            ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full relative">
        
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {ALGO_MENU.find(a => a.id === selectedAlgo)?.label}
                    </h2>
                </div>
                
                <div className="h-6 w-[1px] bg-zinc-800 mx-2" />

                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => addNode()}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium transition-colors border border-zinc-700"
                        title="Add New Node"
                    >
                        <Plus size={14} />
                        Add Node
                    </button>
                    
                    <button 
                        onClick={clearCanvas}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50 text-zinc-400 rounded-md text-xs font-medium transition-all border border-zinc-700"
                        title="Clear All Nodes"
                    >
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                
                {/* ✅ Speed Control UI */}
                <div className="flex items-center bg-zinc-900 rounded-md border border-zinc-800 mr-2 p-0.5">
                    <div className="px-2 text-zinc-500">
                        <Gauge size={14} />
                    </div>
                    {[
                        { label: 'Slow', val: 800 }, 
                        { label: 'Normal', val: 500 }, 
                        { label: 'Fast', val: 150 }
                    ].map((speed) => (
                        <button
                            key={speed.label}
                            onClick={() => setAnimationSpeed(speed.val)}
                            className={cn(
                                "px-2 py-1 text-[10px] font-medium rounded transition-all",
                                animationSpeed === speed.val 
                                    ? "bg-zinc-700 text-white" 
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {speed.label}
                        </button>
                    ))}
                </div>

                {isFinished && (
                    <>
                        <button
                            onClick={() => setIsResultOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 rounded-md text-sm font-medium transition-all animate-in fade-in zoom-in duration-300"
                            title="View Result Summary"
                        >
                            <Activity size={18} />
                            <span className="hidden md:inline">Result</span>
                        </button>

                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded-md text-sm font-medium transition-all animate-in fade-in zoom-in duration-300"
                            title="Algorithm Explanation"
                        >
                            <HelpCircle size={18} />
                            <span className="hidden md:inline">Explain</span>
                        </button>
                    </>
                )}

                <button 
                    onClick={resetGraph}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md text-sm transition-colors"
                >
                    <RotateCcw size={16} />
                    Reset Preset
                </button>

                <button 
                    onClick={runAlgorithm}
                    disabled={isRunning}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 bg-white text-black rounded-md text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                        isRunning && "bg-zinc-600 text-zinc-300 cursor-not-allowed"
                    )}
                >
                    {isRunning ? 'Running...' : (
                        <>
                            <Play size={16} fill="currentColor" /> Run
                        </>
                    )}
                </button>
            </div>
        </header>

        <div className="flex-1 relative bg-zinc-950 cursor-crosshair"> 
             <GraphEditor /> 
             <ConsolePanel />
        </div>

      </main>
    </div>
  );
}