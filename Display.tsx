import React from 'react';
import { formatDisplay, adjustFontSize } from '../utils/formatter';

interface DisplayProps {
  value: string;
  previousValue: string | null;
  operator: string | null;
}

const Display: React.FC<DisplayProps> = ({ value, previousValue, operator }) => {
  const formattedValue = formatDisplay(value);
  const fontSize = adjustFontSize(formattedValue.length);

  // Determine if we show a subtle history hint above
  const showHistoryHint = previousValue !== null && operator !== null;

  return (
    <div className="flex flex-col items-end justify-end h-40 px-6 pb-2 w-full pointer-events-none">
      {/* Subtle indicator of previous operation */}
      <div className={`text-apple-textMuted text-lg font-light transition-opacity duration-300 h-8 flex items-center gap-2 ${showHistoryHint ? 'opacity-100' : 'opacity-0'}`}>
        <span>{previousValue ? formatDisplay(previousValue) : ''}</span>
        <span className="text-apple-btnAction">{operator}</span>
      </div>
      
      {/* Main Display */}
      <div 
        className={`font-light text-white tracking-tight transition-all duration-200 ease-out origin-right ${fontSize}`}
      >
        {formattedValue}
      </div>
    </div>
  );
};

export default Display;