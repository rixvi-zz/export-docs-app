import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentSchema, DocumentType } from '@/lib/schemas';
import { useUpdateDocument, useSetValidationWarnings, defaultDocument } from '@/lib/store';
import { validateDocument } from '@/utils/validation';

import { CompanySection } from './forms/CompanySection';
import { BuyerSection } from './forms/BuyerSection';
import GoodsSection from './forms/GoodsSection';
import ShipmentSection from './forms/ShipmentSection';
import TradeTermsSection from './forms/TradeTermsSection';
import BankingSection from './forms/BankingSection';
import TermsSection from './forms/TermsSection';
import DeclarationSection from './forms/DeclarationSection';
import { PackingDetailsSection } from './forms/PackingDetailsSection';
import OriginDetailsSection from './forms/OriginDetailsSection';

export function DocumentForm() {
  const updateDocument = useUpdateDocument();
  const setValidationWarnings = useSetValidationWarnings();

  const methods = useForm<DocumentType>({
    defaultValues: defaultDocument,
    mode: 'onChange' as const
  });

  const { watch } = methods;
  const formData = watch();

  // Update store and validation on form changes (one-way data flow)
  useEffect(() => {
    // Always update the store with current form data, even if validation fails
    updateDocument(formData);

    // Try to validate and update warnings
    try {
      const validatedData = DocumentSchema.parse(formData);
      const warnings = validateDocument(validatedData);
      setValidationWarnings(warnings);
    } catch (error) {
      // Handle validation errors gracefully - don't block the form
      console.log('Form validation in progress...');
    }
  }, [formData, updateDocument, setValidationWarnings]);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Export Documentation System</h1>
            <p className="mt-2 text-gray-600">
              Generate professional trade documents including Commercial Invoice, Packing List, and Certificate of Origin
            </p>
          </div>

          <div className="space-y-6">
            <CompanySection />
            <BuyerSection />
            <GoodsSection />
            <ShipmentSection />
            <TradeTermsSection />
            <BankingSection />
            <TermsSection />
            <DeclarationSection />
            <PackingDetailsSection />
            <OriginDetailsSection />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            Use the "Preview Documents" button to view and download your documents
          </div>
        </div>
      </div>
    </FormProvider>
  );
}