import React, { useState, useCallback } from 'react';
import { History, ScanLine } from 'lucide-react';
import Button from './components/Button';
import Display from './components/Display';
import HistoryPanel from './components/HistoryPanel';
import MathScanner from './components/MathScanner';
import { CalculatorState, ButtonType, HistoryItem, MathSolution } from './types';

// Constants
const MAX_DIGITS = 9;

const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  waitingForNewValue: false,
  history: [],
  isHistoryOpen: false,
  isScannerOpen: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  // --- Logic Helpers ---

  const handleNumber = (num: string) => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        currentValue: num,
        waitingForNewValue: false,
      }));
    } else {
      if (state.currentValue === '0' && num !== '.') {
        setState(prev => ({ ...prev, currentValue: num }));
      } else {
        // Prevent multiple decimals
        if (num === '.' && state.currentValue.includes('.')) return;
        // Limit length
        if (state.currentValue.replace('.', '').length >= MAX_DIGITS) return;
        
        setState(prev => ({ ...prev, currentValue: prev.currentValue + num }));
      }
    }
  };

  const calculateResult = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const handleOperator = (nextOperator: string) => {
    const { currentValue, previousValue, operator } = state;
    const current = parseFloat(currentValue);

    if (previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: currentValue,
        waitingForNewValue: true,
        operator: nextOperator,
      }));
    } else if (operator) {
      if (state.waitingForNewValue) {
        // Just switching operator
        setState(prev => ({ ...prev, operator: nextOperator }));
      } else {
        // Perform pending calculation
        const previous = parseFloat(previousValue);
        const result = calculateResult(previous, current, operator);
        
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          expression: `${previousValue} ${operator} ${currentValue}`,
          result: String(result),
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          currentValue: String(result),
          previousValue: String(result),
          operator: nextOperator,
          waitingForNewValue: true,
          history: [...prev.history, newHistoryItem]
        }));
      }
    }
  };

  const handleEquals = () => {
    const { currentValue, previousValue, operator } = state;
    if (!previousValue || !operator) return;

    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    const result = calculateResult(previous, current, operator);

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      expression: `${previousValue} ${operator} ${currentValue}`,
      result: String(result),
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      currentValue: String(result),
      previousValue: null,
      operator: null,
      waitingForNewValue: true,
      history: [...prev.history, newHistoryItem]
    }));
  };

  const handleClear = () => {
    // If just cleared, clear everything
    if (state.currentValue === '0' && state.previousValue === null) {
        return;
    }
    // AC behavior: Clear all
    setState(prev => ({
      ...initialState,
      history: prev.history,
      isHistoryOpen: prev.isHistoryOpen,
      isScannerOpen: prev.isScannerOpen
    }));
  };

  const handleToggleSign = () => {
    const current = parseFloat(state.currentValue);
    if (current === 0) return;
    setState(prev => ({
      ...prev,
      currentValue: String(current * -1)
    }));
  };

  const handlePercentage = () => {
    const current = parseFloat(state.currentValue);
    if (current === 0) return;
    setState(prev => ({
      ...prev,
      currentValue: String(current / 100)
    }));
  };

  // --- Handlers ---

  const onHistorySelect = useCallback((val: string) => {
    setState(prev => ({
      ...prev,
      currentValue: val,
      waitingForNewValue: false
    }));
  }, []);

  const handleScannerResult = useCallback((solution: MathSolution) => {
    // Insert result into calculator
    setState(prev => ({
      ...prev,
      currentValue: solution.result,
      waitingForNewValue: true // Treat it like a calculated result
    }));
  }, []);

  const handleScannerSave = useCallback((solution: MathSolution) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: solution.expression,
      result: solution.result,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      history: [...prev.history, newItem]
    }));
  }, []);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center sm:py-8 font-sans selection:bg-transparent">
      <div className="relative w-full max-w-[380px] h-[100dvh] sm:h-auto sm:aspect-[9/18.5] bg-apple-bg sm:rounded-[3rem] sm:border sm:border-white/10 shadow-soft flex flex-col overflow-hidden">
        
        {/* Header / Utility Bar */}
        <div className="flex justify-end items-center px-6 pt-6 sm:pt-8 z-10 relative">
            <div className="flex items-center gap-1">
              <button 
                  onClick={() => setState(prev => ({ ...prev, isScannerOpen: true }))}
                  className="p-2 rounded-full text-apple-textMuted hover:text-white transition-colors"
                  aria-label="Scan Math"
              >
                  <ScanLine size={20} strokeWidth={1.5} />
              </button>
              <button 
                  onClick={() => setState(prev => ({ ...prev, isHistoryOpen: true }))}
                  className="p-2 rounded-full text-apple-btnAction hover:bg-white/5 transition-colors"
                  aria-label="History"
              >
                  <History size={22} strokeWidth={1.5} />
              </button>
            </div>
        </div>

        {/* Math Scanner Overlay */}
        <MathScanner 
          isOpen={state.isScannerOpen}
          onClose={() => setState(prev => ({ ...prev, isScannerOpen: false }))}
          onResult={handleScannerResult}
          onSaveToHistory={handleScannerSave}
        />

        {/* History Overlay */}
        <HistoryPanel 
            isOpen={state.isHistoryOpen} 
            history={state.history}
            onClose={() => setState(prev => ({ ...prev, isHistoryOpen: false }))}
            onClear={() => setState(prev => ({ ...prev, history: [] }))}
            onSelect={onHistorySelect}
        />

        {/* Display Area */}
        <div className="flex-1 flex items-end justify-end w-full">
          <Display 
            value={state.currentValue} 
            previousValue={state.previousValue}
            operator={state.operator}
          />
        </div>

        {/* Keypad */}
        <div className="p-6 pb-12 grid grid-cols-4 gap-4">
          {/* Row 1 */}
          <Button label={state.currentValue === '0' && !state.previousValue ? 'AC' : 'C'} type={ButtonType.Function} onClick={handleClear} />
          <Button label="+/-" type={ButtonType.Function} onClick={handleToggleSign} />
          <Button label="%" type={ButtonType.Function} onClick={handlePercentage} />
          <Button label="÷" type={ButtonType.Action} onClick={() => handleOperator('÷')} isActive={state.operator === '÷'} />

          {/* Row 2 */}
          <Button label="7" onClick={() => handleNumber('7')} />
          <Button label="8" onClick={() => handleNumber('8')} />
          <Button label="9" onClick={() => handleNumber('9')} />
          <Button label="×" type={ButtonType.Action} onClick={() => handleOperator('×')} isActive={state.operator === '×'} />

          {/* Row 3 */}
          <Button label="4" onClick={() => handleNumber('4')} />
          <Button label="5" onClick={() => handleNumber('5')} />
          <Button label="6" onClick={() => handleNumber('6')} />
          <Button label="-" type={ButtonType.Action} onClick={() => handleOperator('-')} isActive={state.operator === '-'} />

          {/* Row 4 */}
          <Button label="1" onClick={() => handleNumber('1')} />
          <Button label="2" onClick={() => handleNumber('2')} />
          <Button label="3" onClick={() => handleNumber('3')} />
          <Button label="+" type={ButtonType.Action} onClick={() => handleOperator('+')} isActive={state.operator === '+'} />

          {/* Row 5 */}
          <Button label="0" doubleWidth onClick={() => handleNumber('0')} />
          <Button label="." onClick={() => handleNumber('.')} />
          <Button label="=" type={ButtonType.Action} onClick={handleEquals} />
        </div>
      </div>
    </div>
  );
};

export default App;