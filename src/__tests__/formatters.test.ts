import { 
  formatDate, 
  formatValue, 
  formatCurrency, 
  formatNumber, 
  formatPaymentModes, 
  formatIncoterms 
} from '@/utils/formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format valid dates', () => {
      const date = '2024-01-15';
      const result = formatDate(date);
      expect(result).toBe('January 15, 2024');
    });

    it('should handle invalid dates', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('— Invalid Date —');
    });

    it('should handle empty dates', () => {
      const result = formatDate('');
      expect(result).toBe('— Not Provided —');
    });

    it('should handle undefined dates', () => {
      const result = formatDate(undefined);
      expect(result).toBe('— Not Provided —');
    });
  });

  describe('formatValue', () => {
    it('should return value as string', () => {
      expect(formatValue('test')).toBe('test');
      expect(formatValue(123)).toBe('123');
      expect(formatValue(true)).toBe('true');
    });

    it('should handle empty values', () => {
      expect(formatValue('')).toBe('— Not Provided —');
      expect(formatValue(null)).toBe('— Not Provided —');
      expect(formatValue(undefined)).toBe('— Not Provided —');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with specified decimals', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
      expect(formatNumber(1000, 0)).toBe('1,000');
      expect(formatNumber(0.123456, 4)).toBe('0.1235');
    });
  });

  describe('formatPaymentModes', () => {
    it('should format single payment mode', () => {
      const result = formatPaymentModes(['letter-of-credit']);
      expect(result).toBe('LC');
    });

    it('should format multiple payment modes', () => {
      const result = formatPaymentModes(['letter-of-credit', 'tt-wire-transfer', 'advance-payment']);
      expect(result).toBe('LC / TT / Advance');
    });

    it('should handle empty array', () => {
      const result = formatPaymentModes([]);
      expect(result).toBe('— Not Provided —');
    });

    it('should handle unknown payment modes', () => {
      const result = formatPaymentModes(['unknown-mode']);
      expect(result).toBe('unknown-mode');
    });
  });

  describe('formatIncoterms', () => {
    it('should format complete incoterms', () => {
      const incoterms = {
        term: 'FOB',
        place: 'New York',
        iccVersion: '2020'
      };
      const result = formatIncoterms(incoterms);
      expect(result).toBe('FOB New York (2020)');
    });

    it('should handle missing place', () => {
      const incoterms = {
        term: 'CIF',
        place: '',
        iccVersion: '2020'
      };
      const result = formatIncoterms(incoterms);
      expect(result).toBe('CIF (2020)');
    });

    it('should handle missing term', () => {
      const incoterms = {
        term: '',
        place: 'London',
        iccVersion: '2020'
      };
      const result = formatIncoterms(incoterms);
      expect(result).toBe('— Not Provided —');
    });

    it('should handle undefined incoterms', () => {
      const result = formatIncoterms(undefined);
      expect(result).toBe('— Not Provided —');
    });
  });
});