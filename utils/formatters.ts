
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const numberToWords = (n: number): string => {
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (n === 0) return 'zero reais';
  if (n === 100) return 'cem reais';
  if (n === 1000) return 'mil reais';

  const parts: string[] = [];
  const integerPart = Math.floor(n);
  const centsPart = Math.round((n - integerPart) * 100);

  const formatPart = (num: number) => {
    if (num === 0) return '';
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const d = Math.floor(num / 10);
      const u = num % 10;
      return tens[d] + (u > 0 ? ' e ' + units[u] : '');
    }
    if (num < 1000) {
      const c = Math.floor(num / 100);
      const rest = num % 100;
      return (num === 100 ? 'cem' : hundreds[c]) + (rest > 0 ? ' e ' + formatPart(rest) : '');
    }
    return '';
  };

  const words = formatPart(integerPart);
  parts.push(words + (integerPart === 1 ? ' real' : ' reais'));

  if (centsPart > 0) {
    parts.push(' e ' + formatPart(centsPart) + (centsPart === 1 ? ' centavo' : ' centavos'));
  }

  return parts.join('');
};

export const generateInstallmentDates = (startDate: Date, count: number): string[] => {
  const dates: string[] = [];
  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + (i * 30));
    dates.push(nextDate.toLocaleDateString('pt-BR'));
  }
  return dates;
};
