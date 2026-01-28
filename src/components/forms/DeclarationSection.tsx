'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormSection } from '@/components/ui/FormSection';

const commonDeclarations = [
  {
    label: 'Standard Export Declaration',
    value: 'We hereby certify that the particulars given above are true and correct and that the goods described are in accordance with the specifications and comply with all applicable regulations.'
  },
  {
    label: 'Food Safety Declaration',
    value: 'We certify that the food products described herein are safe for human consumption, meet all applicable food safety standards, and have been produced, processed, and stored under hygienic conditions in accordance with international food safety regulations.'
  },
  {
    label: 'Organic Certification Declaration',
    value: 'We certify that the products described herein have been produced and processed in accordance with organic standards and regulations, and are free from synthetic pesticides, fertilizers, and genetically modified organisms.'
  },
  {
    label: 'Quality Assurance Declaration',
    value: 'We certify that all goods described have been inspected and tested according to agreed specifications and quality standards, and conform to the requirements specified in the purchase order and applicable international standards.'
  }
];

export default function DeclarationSection() {
  const { control, setValue, watch } = useFormContext<DocumentType>();
  
  const currentDeclaration = watch('declaration.declarationText');

  const handleDeclarationSelect = (declaration: string) => {
    setValue('declaration.declarationText', declaration);
  };

  return (
    <FormSection 
      title="Declaration & Signature" 
      description="Official declaration and signatory information"
    >
      <div className="space-y-4">
        {/* Declaration Templates */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Declaration Templates (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonDeclarations.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDeclarationSelect(template.value)}
                className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-blue-600">
                  {template.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {template.value.substring(0, 100)}...
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Declaration Text */}
        <Textarea
          name="declaration.declarationText"
          control={control}
          label="Declaration Statement"
          placeholder="Enter the official declaration statement..."
          rows={4}
        />

        {/* Signatory Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="declaration.signatoryName"
            control={control}
            label="Signatory Name"
            placeholder="Full name of the person signing"
          />

          <Input
            name="declaration.signatoryTitle"
            control={control}
            label="Signatory Title"
            placeholder="Job title or position"
          />

          <Input
            name="declaration.companyName"
            control={control}
            label="Company Name"
            placeholder="Company name (if different from seller)"
          />

          <Input
            name="declaration.placeOfSigning"
            control={control}
            label="Place of Signing"
            placeholder="City, Country"
          />

          <Input
            name="declaration.dateOfSigning"
            control={control}
            label="Date of Signing"
            type="date"
          />
        </div>

        {/* Signature Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Digital Signature Note
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The generated documents will include the signatory information provided above. 
                  For legal validity, you may need to add a physical or digital signature after downloading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}