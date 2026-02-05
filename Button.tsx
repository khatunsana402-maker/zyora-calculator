import React, { memo } from 'react';
import { ButtonType } from '../types';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  type?: ButtonType;
  doubleWidth?: boolean;
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = ButtonType.Number, 
  doubleWidth = false,
  isActive = false
}) => {
  
  // Apple Style Color Logic
  const getColors = () => {
    if (type === ButtonType.Action) {
      // Muted Violet for Primary Actions (Operator currently active or normal state)
      return isActive 
        ? 'bg-[#ffffff] text-[#5e5ce6]' // Inverted when active
        : 'bg-apple-btnAction text-white hover:opacity-90'; 
    }
    if (type === ButtonType.Function) {
      // Top row lighter grey
      return 'bg-apple-btnFunc text-white hover:bg-[#4a4a4c]'; 
    }
    // Default Number keys - Deep grey
    return 'bg-apple-btnNum text-apple-textMain hover:bg-[#3a3a3c]';
  };

  const baseStyles = "relative flex items-center justify-center text-3xl font-light rounded-full transition-all duration-200 active:scale-95 active:brightness-125 select-none touch-manipulation";
  const sizeStyles = doubleWidth ? "col-span-2 w-full aspect-[2/1] rounded-[4rem] pl-8 justify-start" : "w-20 h-20 aspect-square";
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${getColors()} outline-none`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={doubleWidth ? "ml-2" : ""}>{label}</span>
    </button>
  );
};

export default memo(Button);