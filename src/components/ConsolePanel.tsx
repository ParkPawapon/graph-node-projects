import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { cn } from '@/lib/utils';

export default function ConsolePanel() {
  const { logs, isRunning, isFinished } = useGraphStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State สำหรับจัดการหน้าต่าง
  const [isCollapsed, setIsCollapsed] = useState(false); // หุบหน้าต่าง
  const [isMaximized, setIsMaximized] = useState(false); // ขยายใหญ่

  // Auto scroll to bottom เมื่อมี logs ใหม่ (และไม่ได้หุบอยู่)
  useEffect(() => {
    if (scrollRef.current && !isCollapsed) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isCollapsed, isMaximized]);

  // ถ้าไม่มี Logs และไม่ได้รันอยู่ ให้ซ่อนไปเลย
  if (logs.length === 0 && !isRunning && !isFinished) return null;

  return (
    <div 
      className={cn(
        "absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30 transition-all duration-300 ease-in-out",
        isCollapsed ? "bottom-0" : "bottom-6" // ถ้าหุบให้ติดขอบล่าง
      )}
    >
      <div 
        className={cn(
          "bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-t-lg shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
          // จัดการความสูงตาม State
          isCollapsed ? "h-10" : isMaximized ? "h-96" : "h-48",
          !isCollapsed && "rounded-lg" // ถ้าไม่หุบ ให้มนทั้ง 4 มุม
        )}
      >
        
        {/* --- Header / Toolbar --- */}
        <div 
          className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-900/80 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)} // คลิกที่ Header เพื่อหุบ/กางได้เลย
        >
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 select-none">
            <Terminal size={12} className={cn(isRunning && "text-emerald-400 animate-pulse")} />
            <span className="font-bold tracking-wider">CONSOLE</span>
            {logs.length > 0 && (
               <span className="bg-zinc-800 text-zinc-500 px-1.5 rounded text-[10px]">
                 {logs.length}
               </span>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            
            {/* ปุ่ม Maximize/Restore (แสดงเฉพาะตอนเปิดอยู่) */}
            {!isCollapsed && (
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                title={isMaximized ? "Restore size" : "Maximize size"}
              >
                {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              </button>
            )}

            {/* ปุ่ม Collapse/Expand */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* --- Logs Area --- */}
        <div 
          ref={scrollRef}
          className={cn(
            "p-3 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent bg-zinc-950/50",
            isCollapsed && "hidden" // ซ่อนเนื้อหาถ้าหุบอยู่
          )}
        >
          {logs.length === 0 ? (
            <span className="text-zinc-600 italic">Ready to execute...</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-zinc-300 flex gap-2 animate-in fade-in slide-in-from-left-1 duration-100">
                <span className="text-zinc-600 select-none w-6 text-right opacity-50">
                    {(idx + 1).toString()}
                </span>
                <span className={cn(
                    "break-words w-full",
                    log.includes('Finished') && "text-emerald-400 font-bold",
                    log.includes('Starting') && "text-indigo-400 font-bold",
                    log.includes('Selected cheapest') && "text-amber-400",
                    log.includes('Backtracked') && "text-red-400"
                )}>
                  {log}
                </span>
              </div>
            ))
          )}
          
          {/* Cursor กระพริบตอนรัน */}
          {isRunning && (
            <div className="text-emerald-500 animate-pulse pl-8">_</div>
          )}
        </div>

      </div>
    </div>
  );
}