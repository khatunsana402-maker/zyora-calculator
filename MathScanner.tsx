import React, { useEffect } from 'react';
import { MathSolution } from '../types';

interface MathScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (solution: MathSolution) => void;
  onSaveToHistory: (solution: MathSolution) => void;
}

const MathScanner: React.FC<MathScannerProps> = ({ isOpen, onClose }) => {
  
  // Auto-dismiss the overlay
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, 1800);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="animate-fade-in-up bg-[#1c1c1e] border border-white/10 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
         <span className="text-apple-textMuted font-light text-base tracking-wide select-none">
           Scan coming soon
         </span>
      </div>
    </div>
  );
};

export default MathScanner;