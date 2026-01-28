import { create } from 'zustand';
import { DocumentSchema, DocumentType, ValidationWarning } from './schemas';

// Document type keys for different document types
export type DocumentTypeKey = 'commercial-invoice' | 'proforma-invoice' | 'packing-list' | 'certificate-of-origin';

// Document Store Interface
interface DocumentStore {
  // Document State
  document: DocumentType;
  
  // UI State
  previewMode: boolean;
  selectedDocument: DocumentTypeKey;
  validationWarnings: ValidationWarning[];
  
  // Actions (One-way data flow - forms update store, store never updates forms)
  updateDocument: (updates: Partial<DocumentType>) => void;
  clearDocument: () => void;
  setPreviewMode: (mode: boolean) => void;
  setSelectedDocument: (docType: DocumentTypeKey) => void;
  setValidationWarnings: (warnings: ValidationWarning[]) => void;
  addValidationWarning: (warning: ValidationWarning) => void;
  clearValidationWarnings: () => void;
}

// Proper default document that matches Zod schema exactly
const createDefaultDocument = (): DocumentType => ({
  logo: undefined,
  currency: 'USD',
  seller: {
    companyName: 'AOA FOODS PRIVATE LIMITED',
    address: '4th Floor, A 19, Gali 1, Johri Farm Noor Nagar Ext, Jamia Nagar',
    city: 'New Delhi',
    country: 'India',
    postalCode: '110025',
    phone: '+91-9971409567',
    email: 'ahmarabyadtrading@gmail.com',
    taxId: '07ABECA1554F1ZZ',
    exportLicense: 'ABECA1554F'
  },
  buyer: {
    companyName: '',
    contactPerson: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    email: ''
  },
  consignee: undefined,
  sameAsBuyer: false,
  goods: [],
  shipment: {
    shippingMethod: 'sea-freight',
    customShippingMethod: '',
    portOfLoading: '',
    portOfDischarge: '',
    countryOfOrigin: '',
    countryOfDestination: '',
    vesselName: '',
    voyageNumber: '',
    billOfLadingDate: '',
    estimatedDeparture: '',
    estimatedArrival: ''
  },
  incoterms: {
    term: '',
    place: '',
    iccVersion: '2020'
  },
  paymentTerms: '',
  paymentModes: [],
  banking: undefined,
  terms: '',
  declaration: {
    declarationText: '',
    signatoryName: '',
    signatoryTitle: '',
    companyName: '',
    placeOfSigning: '',
    dateOfSigning: ''
  },
  packingDetails: {
    totalPackages: 1,
    packageType: '',
    totalNetWeight: 0,
    totalGrossWeight: 0,
    totalCBM: 0,
    containerNumber: '',
    sealNumber: ''
  },
  originDetails: {
    countryOfOrigin: '',
    manufacturerName: '',
    manufacturerAddress: '',
    declarationStatement: '',
    authorizedSignatory: '',
    signatoryTitle: '',
    placeOfIssue: '',
    dateOfIssue: ''
  }
});

// Export the default document for use in forms
export const defaultDocument = createDefaultDocument();

// Create Zustand store
export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial State
  document: defaultDocument,
  previewMode: false,
  selectedDocument: 'commercial-invoice',
  validationWarnings: [],
  
  // Actions
  updateDocument: (updates) => {
    set((state) => ({
      document: {
        ...state.document,
        ...updates
      }
    }));
  },
  
  clearDocument: () => {
    set({
      document: createDefaultDocument(),
      validationWarnings: []
    });
  },
  
  setPreviewMode: (mode) => {
    set({ previewMode: mode });
  },
  
  setSelectedDocument: (docType) => {
    set({ selectedDocument: docType });
  },
  
  setValidationWarnings: (warnings) => {
    set({ validationWarnings: warnings });
  },
  
  addValidationWarning: (warning) => {
    set((state) => ({
      validationWarnings: [...state.validationWarnings, warning]
    }));
  },
  
  clearValidationWarnings: () => {
    set({ validationWarnings: [] });
  }
}));

// Store hooks for component consumption (single selectors - no object creation)
export const useDocument = () => useDocumentStore((state) => state.document);
export const usePreviewMode = () => useDocumentStore((state) => state.previewMode);
export const useSelectedDocument = () => useDocumentStore((state) => state.selectedDocument);
export const useValidationWarnings = () => useDocumentStore((state) => state.validationWarnings);

// Individual action hooks (preferred - no object creation)
export const useUpdateDocument = () => useDocumentStore((state) => state.updateDocument);
export const useClearDocument = () => useDocumentStore((state) => state.clearDocument);
export const useSetPreviewMode = () => useDocumentStore((state) => state.setPreviewMode);
export const useSetSelectedDocument = () => useDocumentStore((state) => state.setSelectedDocument);
export const useSetValidationWarnings = () => useDocumentStore((state) => state.setValidationWarnings);
export const useAddValidationWarning = () => useDocumentStore((state) => state.addValidationWarning);
export const useClearValidationWarnings = () => useDocumentStore((state) => state.clearValidationWarnings);

// Action hooks (with shallow comparison to prevent infinite loops)
export const useDocumentActions = () => useDocumentStore(
  (state) => ({
    updateDocument: state.updateDocument,
    clearDocument: state.clearDocument,
    setPreviewMode: state.setPreviewMode,
    setSelectedDocument: state.setSelectedDocument,
    setValidationWarnings: state.setValidationWarnings,
    addValidationWarning: state.addValidationWarning,
    clearValidationWarnings: state.clearValidationWarnings
  })
);