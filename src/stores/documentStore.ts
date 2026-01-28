import { create } from 'zustand';
import { DocumentType, ValidationWarning } from '@/lib/schemas';

export type DocumentTypeKey = 'invoice' | 'proforma' | 'packing' | 'coo';

interface DocumentStore {
  // Document state
  document: DocumentType | null;
  
  // Actions
  updateDocument: (document: DocumentType) => void;
  clearDocument: () => void;
  
  // Validation state (non-blocking)
  validationWarnings: ValidationWarning[];
  updateValidationWarnings: (warnings: ValidationWarning[]) => void;
  
  // UI state
  previewMode: boolean;
  selectedDocument: DocumentTypeKey;
  setPreviewMode: (mode: boolean) => void;
  setSelectedDocument: (doc: DocumentTypeKey) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  // Initial state
  document: null,
  validationWarnings: [],
  previewMode: false,
  selectedDocument: 'invoice',
  
  // Actions
  updateDocument: (document: DocumentType) => {
    set({ document });
  },
  
  clearDocument: () => {
    set({ 
      document: null,
      validationWarnings: []
    });
  },
  
  updateValidationWarnings: (warnings: ValidationWarning[]) => {
    set({ validationWarnings: warnings });
  },
  
  setPreviewMode: (mode: boolean) => {
    set({ previewMode: mode });
  },
  
  setSelectedDocument: (doc: DocumentTypeKey) => {
    set({ selectedDocument: doc });
  }
}));

// Selector hooks for specific parts of the store
export const useDocument = () => useDocumentStore((state) => state.document);
export const useValidationWarnings = () => useDocumentStore((state) => state.validationWarnings);
export const usePreviewMode = () => useDocumentStore((state) => state.previewMode);
export const useSelectedDocument = () => useDocumentStore((state) => state.selectedDocument);

// Action hooks
export const useDocumentActions = () => useDocumentStore((state) => ({
  updateDocument: state.updateDocument,
  clearDocument: state.clearDocument,
  updateValidationWarnings: state.updateValidationWarnings,
  setPreviewMode: state.setPreviewMode,
  setSelectedDocument: state.setSelectedDocument
}));