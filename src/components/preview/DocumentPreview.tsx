import React from 'react';
import { DocumentTypeKey } from '@/lib/store';
import { UnifiedDocumentPreview } from './UnifiedDocumentPreview';

interface DocumentPreviewProps {
  documentType: DocumentTypeKey;
}

export function DocumentPreview({ documentType }: DocumentPreviewProps) {
  return <UnifiedDocumentPreview documentType={documentType} />;
}