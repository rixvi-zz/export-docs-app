import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

interface BuyerSectionProps {
  className?: string;
}

export function BuyerSection({ className }: BuyerSectionProps) {
  const { control, watch } = useFormContext<DocumentType>();
  const sameAsBuyer = watch('sameAsBuyer');

  return (
    <>
      <FormSection title="Buyer Information" className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="buyer.companyName"
            control={control}
            label="Company Name"
            required
            placeholder="Enter buyer company name"
          />
          
          <Input
            name="buyer.contactPerson"
            control={control}
            label="Contact Person"
            placeholder="Enter contact person name"
          />
        </div>

        <Input
          name="buyer.address"
          control={control}
          label="Address"
          required
          placeholder="Enter complete address"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="buyer.city"
            control={control}
            label="City"
            required
            placeholder="Enter city"
          />
          
          <Input
            name="buyer.country"
            control={control}
            label="Country"
            required
            placeholder="Enter country"
          />
          
          <Input
            name="buyer.postalCode"
            control={control}
            label="Postal Code"
            placeholder="Enter postal code"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="buyer.phone"
            control={control}
            label="Phone Number"
            placeholder="Enter phone number"
          />
          
          <Input
            name="buyer.email"
            control={control}
            label="Email Address"
            type="email"
            placeholder="Enter email address"
          />
        </div>
      </FormSection>

      <FormSection title="Consignee Information" className="mt-6">
        <Checkbox
          name="sameAsBuyer"
          control={control}
          label="Same as Buyer"
        />

        {!sameAsBuyer && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="consignee.companyName"
                control={control}
                label="Company Name"
                placeholder="Enter consignee company name"
              />
              
              <Input
                name="consignee.contactPerson"
                control={control}
                label="Contact Person"
                placeholder="Enter contact person name"
              />
            </div>

            <Input
              name="consignee.address"
              control={control}
              label="Address"
              placeholder="Enter complete address"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="consignee.city"
                control={control}
                label="City"
                placeholder="Enter city"
              />
              
              <Input
                name="consignee.country"
                control={control}
                label="Country"
                placeholder="Enter country"
              />
              
              <Input
                name="consignee.postalCode"
                control={control}
                label="Postal Code"
                placeholder="Enter postal code"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="consignee.phone"
                control={control}
                label="Phone Number"
                placeholder="Enter phone number"
              />
              
              <Input
                name="consignee.email"
                control={control}
                label="Email Address"
                type="email"
                placeholder="Enter email address"
              />
            </div>
          </>
        )}
      </FormSection>
    </>
  );
}