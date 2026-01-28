'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DocumentType, PaymentMode } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FormSection } from '@/components/ui/FormSection';

const incotermsOptions = [
  { value: 'EXW', label: 'EXW - Ex Works' },
  { value: 'FCA', label: 'FCA - Free Carrier' },
  { value: 'CPT', label: 'CPT - Carriage Paid To' },
  { value: 'CIP', label: 'CIP - Carriage and Insurance Paid To' },
  { value: 'DAP', label: 'DAP - Delivered at Place' },
  { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
  { value: 'FAS', label: 'FAS - Free Alongside Ship' },
  { value: 'FOB', label: 'FOB - Free on Board' },
  { value: 'CFR', label: 'CFR - Cost and Freight' },
  { value: 'CNF', label: 'CNF - Cost and Freight' },
  { value: 'CIF', label: 'CIF - Cost, Insurance and Freight' }
];

const paymentModeOptions: { value: PaymentMode; label: string }[] = [
  { value: 'letter-of-credit', label: 'Letter of Credit (LC)' },
  { value: 'tt-wire-transfer', label: 'Telegraphic Transfer (TT)' },
  { value: 'advance-payment', label: 'Advance Payment' },
  { value: 'documents-against-payment', label: 'Documents Against Payment (D/P)' },
  { value: 'documents-against-acceptance', label: 'Documents Against Acceptance (D/A)' },
  { value: 'open-account', label: 'Open Account' },
  { value: 'as-mutually-agreed', label: 'As Mutually Agreed' }
];

export default function TradeTermsSection() {
  const { control } = useFormContext<DocumentType>();

  return (
    <FormSection 
      title="Trade Terms & Payment" 
      description="Incoterms, payment terms, and payment methods"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incoterms */}
        <Select
          name="incoterms.term"
          control={control}
          label="Incoterms"
          options={incotermsOptions}
        />

        <Input
          name="incoterms.place"
          control={control}
          label="Incoterms Place"
          placeholder="Named place or port"
        />

        <Select
          name="incoterms.iccVersion"
          control={control}
          label="ICC Version"
          options={[
            { value: '2020', label: 'Incoterms 2020' },
            { value: '2010', label: 'Incoterms 2010' }
          ]}
        />

        {/* Payment Terms */}
        <div className="md:col-span-2">
          <Textarea
            name="paymentTerms"
            control={control}
            label="Payment Terms"
            placeholder="Detailed payment terms and conditions..."
            rows={3}
          />
        </div>

        {/* Payment Modes - Multi-select checkboxes */}
        <div className="md:col-span-2">
          <Controller
            name="paymentModes"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Modes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {paymentModeOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentValues = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(currentValues.filter((v: PaymentMode) => v !== option.value));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}