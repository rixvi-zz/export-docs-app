'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormSection } from '@/components/ui/FormSection';

export default function BankingSection() {
  const { control } = useFormContext<DocumentType>();

  return (
    <FormSection 
      title="Banking Details" 
      description="Bank information for payments (optional)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            name="banking.beneficiaryBank"
            control={control}
            label="Beneficiary Bank"
            placeholder="Name of the beneficiary bank"
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            name="banking.bankAddress"
            control={control}
            label="Bank Address"
            placeholder="Complete bank address..."
            rows={3}
          />
        </div>

        <Input
          name="banking.swiftCode"
          control={control}
          label="SWIFT Code"
          placeholder="Bank SWIFT/BIC code"
        />

        <Input
          name="banking.accountNumber"
          control={control}
          label="Account Number"
          placeholder="Beneficiary account number"
        />

        <Input
          name="banking.routingNumber"
          control={control}
          label="Routing Number"
          placeholder="Bank routing number (if applicable)"
        />

        <Input
          name="banking.correspondentBank"
          control={control}
          label="Correspondent Bank"
          placeholder="Correspondent bank (if applicable)"
        />
      </div>
    </FormSection>
  );
}