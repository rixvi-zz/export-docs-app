import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentSchema, DocumentType } from '@/lib/schemas';
import { useDocument, useUpdateDocument, defaultDocument } from '@/lib/store';

interface DocumentFormProps {
  children: React.ReactNode;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ children }) => {
  const document = useDocument();
  const updateDocument = useUpdateDocument();

  const methods = useForm({
    defaultValues: defaultDocument,
    mode: 'onChange' as const
  });

  const { watch, reset } = methods;

  // Watch all form changes and update store (one-way data flow)
  useEffect(() => {
    const subscription = watch((data) => {
      // Only update if data is valid and different
      if (data && JSON.stringify(data) !== JSON.stringify(document)) {
        updateDocument(data as DocumentType);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateDocument, document]);

  // Reset form when document changes externally (e.g., clear document)
  useEffect(() => {
    reset(document);
  }, [document, reset]);

  return (
    <FormProvider {...methods}>
      <form className="space-y-6">
        {children}
      </form>
    </FormProvider>
  );
};