export const formatDate = (dateString?: string) => {
  if (!dateString) return '— Not Provided —';

  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? '— Invalid Date —'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
};

export const formatValue = (value?: any) => {
  if (value === null || value === undefined || value === '') {
    return '— Not Provided —';
  }
  return String(value);
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatWeight = (weight?: number) => {
  if (!weight || weight === 0) return '— Not Provided —';
  return `${formatNumber(weight)} KG`;
};

export const formatCBM = (cbm?: number) => {
  if (!cbm || cbm === 0) return '— Not Provided —';
  return `${formatNumber(cbm, 3)} CBM`;
};

export const formatPaymentModes = (modes: string[]) => {
  if (!modes || modes.length === 0) return '— Not Provided —';
  
  const modeLabels: Record<string, string> = {
    'letter-of-credit': 'LC',
    'tt-wire-transfer': 'TT',
    'advance-payment': 'Advance',
    'documents-against-payment': 'D/P',
    'documents-against-acceptance': 'D/A',
    'open-account': 'Open Account',
    'as-mutually-agreed': 'As Agreed'
  };
  
  return modes.map(mode => modeLabels[mode] || mode).join(' / ');
};

export const formatIncoterms = (incoterms?: { term: string; place: string; iccVersion: string }) => {
  if (!incoterms?.term) return '— Not Provided —';
  
  const place = incoterms.place ? ` ${incoterms.place}` : '';
  const version = incoterms.iccVersion ? ` (${incoterms.iccVersion})` : '';
  
  return `${incoterms.term}${place}${version}`;
};