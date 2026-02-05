const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 10,
});

export const formatDisplay = (value: string): string => {
  if (value === 'Error') return value;
  if (value === '') return '0';
  
  // Handle scientific notation for very large/small numbers automatically via Number()
  const num = parseFloat(value);
  
  if (isNaN(num)) return '0';

  // If user is currently typing a decimal, handle it manually to allow "0." or "12."
  if (value.includes('.') && !value.includes('e')) {
    const [integerPart, decimalPart] = value.split('.');
    return `${parseInt(integerPart).toLocaleString('en-US')}.${decimalPart}`;
  }

  // Check bounds for scientific notation preference
  if (Math.abs(num) > 1e9 || (Math.abs(num) < 1e-7 && Math.abs(num) > 0)) {
    return num.toExponential(4); // Clean scientific notation
  }

  return numberFormatter.format(num);
};

export const adjustFontSize = (length: number): string => {
  if (length > 12) return 'text-4xl';
  if (length > 9) return 'text-5xl';
  if (length > 7) return 'text-6xl';
  return 'text-7xl'; // Default large airy size
};