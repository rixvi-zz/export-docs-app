import React from 'react';
import { useSelectedDocument, useSetSelectedDocument } from '@/lib/store';

const documentOptions = [
  { value: 'commercial-invoice', label: 'Commercial Invoice' },
  { value: 'proforma-invoice', label: 'Proforma Invoice' },
  { value: 'packing-list', label: 'Packing List' },
  { value: 'certificate-of-origin', label: 'Certificate of Origin' }
] as const;

export const DocumentSelector: React.FC = () => {
  const selectedDocument = useSelectedDocument();
  const setSelectedDocument = useSetSelectedDocument();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="document-selector" className="text-sm font-medium text-gray-700">
        Document:
      </label>
      <select
        id="document-selector"
        value={selectedDocument}
        onChange={(e) => setSelectedDocument(e.target.value as any)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {documentOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};