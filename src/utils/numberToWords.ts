const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const scales = [
  '', 'thousand', 'million', 'billion', 'trillion'
];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += '-' + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }
  
  return result;
}

function convertNumber(num: number): string {
  if (num === 0) return 'zero';
  
  let result = '';
  let scaleIndex = 0;
  
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      const scale = scales[scaleIndex];
      result = chunkWords + (scale ? ' ' + scale : '') + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  
  return result;
}

export function numberToWords(amount: number, currency: string = 'USD'): string {
  if (isNaN(amount) || amount < 0) {
    return 'Invalid amount';
  }
  
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);
  
  let result = '';
  
  if (dollars === 0) {
    result = 'zero';
  } else {
    result = convertNumber(dollars);
  }
  
  // Capitalize first letter
  result = result.charAt(0).toUpperCase() + result.slice(1);
  
  // Add currency
  const currencyNames: Record<string, { singular: string; plural: string; subunit: string }> = {
    'USD': { singular: 'Dollar', plural: 'Dollars', subunit: 'Cents' },
    'EUR': { singular: 'Euro', plural: 'Euros', subunit: 'Cents' },
    'GBP': { singular: 'Pound', plural: 'Pounds', subunit: 'Pence' },
    'JPY': { singular: 'Yen', plural: 'Yen', subunit: 'Sen' },
    'CAD': { singular: 'Canadian Dollar', plural: 'Canadian Dollars', subunit: 'Cents' },
    'AUD': { singular: 'Australian Dollar', plural: 'Australian Dollars', subunit: 'Cents' },
    'CHF': { singular: 'Swiss Franc', plural: 'Swiss Francs', subunit: 'Rappen' },
    'CNY': { singular: 'Yuan', plural: 'Yuan', subunit: 'Jiao' },
    'INR': { singular: 'Rupee', plural: 'Rupees', subunit: 'Paisa' },
    'SGD': { singular: 'Singapore Dollar', plural: 'Singapore Dollars', subunit: 'Cents' },
    'HKD': { singular: 'Hong Kong Dollar', plural: 'Hong Kong Dollars', subunit: 'Cents' },
    'SEK': { singular: 'Krona', plural: 'Kronor', subunit: 'Öre' },
    'NOK': { singular: 'Krone', plural: 'Kroner', subunit: 'Øre' },
    'DKK': { singular: 'Krone', plural: 'Kroner', subunit: 'Øre' },
    'NZD': { singular: 'New Zealand Dollar', plural: 'New Zealand Dollars', subunit: 'Cents' },
    'ZAR': { singular: 'Rand', plural: 'Rand', subunit: 'Cents' },
    'BRL': { singular: 'Real', plural: 'Reais', subunit: 'Centavos' },
    'MXN': { singular: 'Peso', plural: 'Pesos', subunit: 'Centavos' },
    'KRW': { singular: 'Won', plural: 'Won', subunit: 'Jeon' },
    'THB': { singular: 'Baht', plural: 'Baht', subunit: 'Satang' }
  };
  
  const currencyInfo = currencyNames[currency] || { singular: 'Dollar', plural: 'Dollars', subunit: 'Cents' };
  
  if (dollars === 1) {
    result += ` ${currencyInfo.singular}`;
  } else {
    result += ` ${currencyInfo.plural}`;
  }
  
  if (cents > 0) {
    const centsWords = convertNumber(cents);
    result += ` and ${centsWords.charAt(0).toUpperCase() + centsWords.slice(1)} ${currencyInfo.subunit}`;
  }
  
  result += ' Only';
  
  return result;
}