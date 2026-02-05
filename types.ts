export enum ButtonType {
  Number = 'number',
  Action = 'action',
  Function = 'function', // Top row (AC, +/-, %)
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForNewValue: boolean;
  history: HistoryItem[];
  isHistoryOpen: boolean;
  isScannerOpen: boolean;
}

export type Action =
  | { type: 'NUMBER'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENTAGE' }
  | { type: 'EQUALS' }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'TOGGLE_SCANNER' };

export interface MathSolution {
  expression: string;
  steps: string[];
  result: string;
}
