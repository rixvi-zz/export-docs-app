import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType, Currency } from '@/lib/schemas';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';

const currencyOptions: { value: Currency; label: string }[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'DKK', label: 'DKK - Danish Krone' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'THB', label: 'THB - Thai Baht' }
];

interface CompanySectionProps {
  className?: string;
}

export function CompanySection({ className }: CompanySectionProps) {
  const { control } = useFormContext<DocumentType>();

  return (
    <FormSection title="Company Information" className={className}>
      <FileUpload
        name="logo"
        control={control}
        label="Company Logo"
        accept="image/*"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="seller.companyName"
          control={control}
          label="Company Name"
          required
          placeholder="Enter company name"
        />
        
        <Input
          name="seller.taxId"
          control={control}
          label="Tax ID / Registration Number"
          placeholder="Enter tax ID"
        />

        <Select
          name="currency"
          control={control}
          label="Default Currency"
          options={currencyOptions}
          required
        />
      </div>

      <Input
        name="seller.address"
        control={control}
        label="Address"
        required
        placeholder="Enter complete address"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="seller.city"
          control={control}
          label="City"
          required
          placeholder="Enter city"
        />
        
        <Input
          name="seller.country"
          control={control}
          label="Country"
          required
          placeholder="Enter country"
        />
        
        <Input
          name="seller.postalCode"
          control={control}
          label="Postal Code"
          placeholder="Enter postal code"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="seller.phone"
          control={control}
          label="Phone Number"
          placeholder="Enter phone number"
        />
        
        <Input
          name="seller.email"
          control={control}
          label="Email Address"
          type="email"
          placeholder="Enter email address"
        />
      </div>

      <Input
        name="seller.exportLicense"
        control={control}
        label="Export License Number"
        placeholder="Enter export license number"
      />
    </FormSection>
  );
}