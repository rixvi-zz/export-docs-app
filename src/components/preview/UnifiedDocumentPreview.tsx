import React, { useState } from 'react';
import { useDocument, useSelectedDocument, DocumentTypeKey } from '@/lib/store';
import { generatePDF } from '@/utils/pdfGenerator';
import { InvoicePreview } from './documents/InvoicePreview';
import { PackingListPreview } from './documents/PackingListPreview';
import { COOPreview } from './documents/COOPreview';

interface UnifiedDocumentPreviewProps {
  documentType: DocumentTypeKey;
}

export function UnifiedDocumentPreview({ documentType }: UnifiedDocumentPreviewProps) {
  const document = useDocument();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // 🧪 CRITICAL DEBUG: Check what's actually in the document
      console.log('🧾 GOODS BEFORE PDF:', document.goods);
      console.log('🧾 FULL DOCUMENT:', JSON.stringify(document, null, 2));
      console.log('🧾 Document goods length:', document.goods?.length);

      await generatePDF(document, documentType);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderDocumentPreview = () => {
    switch (documentType) {
      case 'commercial-invoice':
        return <InvoicePreview />;
      case 'proforma-invoice':
        return <InvoicePreview isProforma />;
      case 'packing-list':
        return <PackingListPreview />;
      case 'certificate-of-origin':
        return <COOPreview />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a document type to preview
          </div>
        );
    }
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'commercial-invoice':
        return 'Commercial Invoice';
      case 'proforma-invoice':
        return 'Proforma Invoice';
      case 'packing-list':
        return 'Packing List';
      case 'certificate-of-origin':
        return 'Certificate of Origin';
      default:
        return 'Document Preview';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with download controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {getDocumentTitle()}
        </h3>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isGeneratingPDF && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* A4 Format Container - 794px width for A4 at 96 DPI */}
          <div
            className="bg-white shadow-lg mx-auto"
            style={{
              width: '794px',
              minHeight: '1123px',
              padding: '40px',
              boxSizing: 'border-box'
            }}
          >
            {renderDocumentPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}