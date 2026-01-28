import React from 'react';
import { usePreviewMode, useSelectedDocument, useSetPreviewMode } from '@/lib/store';
import { DocumentSelector } from './DocumentSelector';
import { DocumentPreview } from './DocumentPreview';

export const PreviewModal: React.FC = () => {
  const previewMode = usePreviewMode();
  const selectedDocument = useSelectedDocument();
  const setPreviewMode = useSetPreviewMode();

  if (!previewMode) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setPreviewMode(false)}
      />

      {/* Modal */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Document Preview
            </h2>
            <DocumentSelector />
          </div>

          <button
            onClick={() => setPreviewMode(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content - Now includes integrated download controls */}
        <div className="flex-1 overflow-hidden">
          <DocumentPreview documentType={selectedDocument} />
        </div>
      </div>
    </div>
  );
};