import { numberToWords } from '@/utils/numberToWords';

describe('numberToWords', () => {
  describe('Basic numbers', () => {
    it('should convert zero', () => {
      expect(numberToWords(0)).toBe('Zero Dollars Only');
    });

    it('should convert single digits', () => {
      expect(numberToWords(1)).toBe('One Dollar Only');
      expect(numberToWords(5)).toBe('Five Dollars Only');
      expect(numberToWords(9)).toBe('Nine Dollars Only');
    });

    it('should convert teens', () => {
      expect(numberToWords(10)).toBe('Ten Dollars Only');
      expect(numberToWords(15)).toBe('Fifteen Dollars Only');
      expect(numberToWords(19)).toBe('Nineteen Dollars Only');
    });

    it('should convert tens', () => {
      expect(numberToWords(20)).toBe('Twenty Dollars Only');
      expect(numberToWords(50)).toBe('Fifty Dollars Only');
      expect(numberToWords(90)).toBe('Ninety Dollars Only');
    });

    it('should convert compound numbers', () => {
      expect(numberToWords(21)).toBe('Twenty-one Dollars Only');
      expect(numberToWords(99)).toBe('Ninety-nine Dollars Only');
    });
  });

  describe('Hundreds', () => {
    it('should convert hundreds', () => {
      expect(numberToWords(100)).toBe('One hundred Dollars Only');
      expect(numberToWords(500)).toBe('Five hundred Dollars Only');
      expect(numberToWords(999)).toBe('Nine hundred ninety-nine Dollars Only');
    });

    it('should convert compound hundreds', () => {
      expect(numberToWords(123)).toBe('One hundred twenty-three Dollars Only');
      expect(numberToWords(456)).toBe('Four hundred fifty-six Dollars Only');
    });
  });

  describe('Thousands', () => {
    it('should convert thousands', () => {
      expect(numberToWords(1000)).toBe('One thousand Dollars Only');
      expect(numberToWords(5000)).toBe('Five thousand Dollars Only');
      expect(numberToWords(10000)).toBe('Ten thousand Dollars Only');
    });

    it('should convert compound thousands', () => {
      expect(numberToWords(1234)).toBe('One thousand two hundred thirty-four Dollars Only');
      expect(numberToWords(12345)).toBe('Twelve thousand three hundred forty-five Dollars Only');
    });
  });

  describe('Millions', () => {
    it('should convert millions', () => {
      expect(numberToWords(1000000)).toBe('One million Dollars Only');
      expect(numberToWords(2500000)).toBe('Two million five hundred thousand Dollars Only');
    });

    it('should convert compound millions', () => {
      expect(numberToWords(1234567)).toBe('One million two hundred thirty-four thousand five hundred sixty-seven Dollars Only');
    });
  });

  describe('Decimal amounts', () => {
    it('should handle cents', () => {
      expect(numberToWords(1.50)).toBe('One Dollar and Fifty Cents Only');
      expect(numberToWords(10.25)).toBe('Ten Dollars and Twenty-five Cents Only');
      expect(numberToWords(100.01)).toBe('One hundred Dollars and One Cents Only');
    });

    it('should handle no cents', () => {
      expect(numberToWords(1.00)).toBe('One Dollar Only');
      expect(numberToWords(100.00)).toBe('One hundred Dollars Only');
    });

    it('should round cents properly', () => {
      expect(numberToWords(1.999)).toBe('Two Dollars Only');
      expect(numberToWords(1.001)).toBe('One Dollar Only');
    });
  });

  describe('Different currencies', () => {
    it('should handle EUR', () => {
      expect(numberToWords(100, 'EUR')).toBe('One hundred Euros Only');
      expect(numberToWords(1.50, 'EUR')).toBe('One Euro and Fifty Cents Only');
    });

    it('should handle GBP', () => {
      expect(numberToWords(100, 'GBP')).toBe('One hundred Pounds Only');
      expect(numberToWords(1.50, 'GBP')).toBe('One Pound and Fifty Pence Only');
    });

    it('should handle unknown currency', () => {
      expect(numberToWords(100, 'XYZ')).toBe('One hundred Dollars Only');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid amounts', () => {
      expect(numberToWords(NaN)).toBe('Invalid amount');
      expect(numberToWords(-1)).toBe('Invalid amount');
    });

    it('should handle very large amounts', () => {
      expect(numberToWords(1000000000)).toBe('One billion Dollars Only');
      expect(numberToWords(1000000000000)).toBe('One trillion Dollars Only');
    });
  });
});