import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, X } from 'lucide-react';
import { formatDisplay } from '../utils/formatter';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onClear: () => void;
  onSelect: (val: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, history, onClose, onClear, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-[3rem]">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-lg font-medium text-white">History</h2>
        <div className="flex gap-4">
          <button onClick={onClear} className="p-2 text-apple-textMuted hover:text-red-400 transition-colors">
            <Trash2 size={20} strokeWidth={1.5} />
          </button>
          <button onClick={onClose} className="p-2 text-white bg-apple-surface rounded-full">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-apple-textMuted font-light">
            <p>No calculations yet</p>
          </div>
        ) : (
          history.slice().reverse().map((item) => (
            <div 
              key={item.id} 
              onClick={() => {
                onSelect(item.result);
                onClose();
              }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="text-right text-apple-textMuted font-light text-sm mb-1 group-hover:text-apple-textMain transition-colors">
                {item.expression}
              </div>
              <div className="text-right text-2xl font-light text-apple-btnAction">
                = {formatDisplay(item.result)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;