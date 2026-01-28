'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { Textarea } from '@/components/ui/Textarea';
import { FormSection } from '@/components/ui/FormSection';

const commonTermsTemplates = [
  {
    label: 'Standard Export Terms',
    value: `1. Payment terms as agreed between buyer and seller.
2. All goods are sold FOB shipping point unless otherwise specified.
3. Risk of loss passes to buyer upon delivery to carrier.
4. Seller warrants goods are free from defects in material and workmanship.
5. Any disputes shall be resolved through arbitration.
6. This invoice is subject to the terms and conditions of sale.`
  },
  {
    label: 'Food Products Terms',
    value: `1. All products meet international food safety standards.
2. Temperature-controlled storage and transport required.
3. Products must be consumed before expiry date.
4. Buyer responsible for import permits and health certificates.
5. Seller not liable for deterioration due to improper handling.
6. All claims must be made within 48 hours of delivery.`
  },
  {
    label: 'Agricultural Products Terms',
    value: `1. Quality specifications as per agreed standards.
2. Natural variations in agricultural products are acceptable.
3. Phytosanitary certificates provided as required.
4. Buyer responsible for import licenses and permits.
5. Force majeure clause applies for weather-related delays.
6. Inspection at destination within 7 days of arrival.`
  }
];

export default function TermsSection() {
  const { control, setValue, watch } = useFormContext<DocumentType>();
  
  const currentTerms = watch('terms');

  const handleTemplateSelect = (template: string) => {
    setValue('terms', template);
  };

  return (
    <FormSection 
      title="Terms & Conditions" 
      description="Additional terms and conditions for the transaction"
    >
      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Quick Templates (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {commonTermsTemplates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTemplateSelect(template.value)}
                className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-blue-600">
                  {template.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Click to use this template
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Terms Text Area */}
        <Textarea
          name="terms"
          control={control}
          label="Terms & Conditions"
          placeholder="Enter specific terms and conditions for this transaction..."
          rows={8}
        />

        {/* Character Count */}
        <div className="text-xs text-gray-500 text-right">
          {currentTerms?.length || 0} characters
        </div>

        {/* Common Clauses Helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Common Clauses to Consider:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Payment terms and methods</li>
            <li>• Delivery and shipping responsibilities</li>
            <li>• Quality standards and inspection procedures</li>
            <li>• Force majeure and liability limitations</li>
            <li>• Dispute resolution mechanisms</li>
            <li>• Applicable law and jurisdiction</li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}