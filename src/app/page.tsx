'use client';

import React from 'react';
import { DocumentForm } from '@/components/DocumentForm';
import { PreviewModal } from '@/components/preview/PreviewModal';
import { PreviewButton } from '@/components/ui/PreviewButton';

export default function Home() {
  const testLayout = () => {
    if (typeof window !== 'undefined' && (window as any).testInvoiceLayout) {
      (window as any).testInvoiceLayout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Button for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={testLayout}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Test Layout
          </button>
        </div>
      )}
      <DocumentForm />
      <PreviewButton />
      <PreviewModal />
    </div>
  );
}
