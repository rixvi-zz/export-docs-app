'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormSection } from '@/components/ui/FormSection';

const countries = [
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CA', label: 'Canada' },
  { value: 'CN', label: 'China' },
  { value: 'CO', label: 'Colombia' },
  { value: 'DK', label: 'Denmark' },
  { value: 'EG', label: 'Egypt' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'NO', label: 'Norway' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'RU', label: 'Russia' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TR', label: 'Turkey' },
  { value: 'AE', label: 'UAE' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'VN', label: 'Vietnam' }
];

const commonDeclarationStatements = [
  {
    label: 'Standard COO Declaration',
    value: 'I hereby certify that the goods described above originate in the country shown and comply with the origin requirements specified for those goods in the relevant trade agreement or preference program.'
  },
  {
    label: 'Manufacturer Declaration',
    value: 'The undersigned hereby declares that the goods described above have been produced/manufactured in the country of origin stated and meet all the requirements for preferential treatment under the applicable trade agreement.'
  },
  {
    label: 'Agricultural Products Declaration',
    value: 'I certify that the agricultural products described herein were grown, produced, and processed entirely within the territory of the country of origin and comply with all phytosanitary requirements.'
  },
  {
    label: 'Processed Goods Declaration',
    value: 'The goods described have undergone sufficient processing in the country of origin to qualify for preferential treatment and meet the substantial transformation requirements under applicable trade regulations.'
  }
];

export default function OriginDetailsSection() {
  const { control, setValue, watch } = useFormContext<DocumentType>();
  
  const currentStatement = watch('originDetails.declarationStatement');

  const handleStatementSelect = (statement: string) => {
    setValue('originDetails.declarationStatement', statement);
  };

  return (
    <FormSection 
      title="Certificate of Origin Details" 
      description="Information specific to Certificate of Origin documents"
    >
      <div className="space-y-4">
        {/* Country of Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="originDetails.countryOfOrigin"
            control={control}
            label="Country of Origin"
            options={countries}
          />

          <Input
            name="originDetails.placeOfIssue"
            control={control}
            label="Place of Issue"
            placeholder="City where COO is issued"
          />

          <Input
            name="originDetails.dateOfIssue"
            control={control}
            label="Date of Issue"
            type="date"
          />
        </div>

        {/* Manufacturer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="originDetails.manufacturerName"
            control={control}
            label="Manufacturer Name"
            placeholder="Name of the manufacturer"
          />

          <div className="md:col-span-2">
            <Textarea
              name="originDetails.manufacturerAddress"
              control={control}
              label="Manufacturer Address"
              placeholder="Complete address of the manufacturer..."
              rows={3}
            />
          </div>
        </div>

        {/* Declaration Statement Templates */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Declaration Statement Templates (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonDeclarationStatements.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleStatementSelect(template.value)}
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

        {/* Declaration Statement */}
        <Textarea
          name="originDetails.declarationStatement"
          control={control}
          label="Declaration Statement"
          placeholder="Enter the official declaration statement for Certificate of Origin..."
          rows={4}
        />

        {/* Authorized Signatory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="originDetails.authorizedSignatory"
            control={control}
            label="Authorized Signatory"
            placeholder="Name of authorized person"
          />

          <Input
            name="originDetails.signatoryTitle"
            control={control}
            label="Signatory Title"
            placeholder="Title or position"
          />
        </div>

        {/* COO Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Certificate of Origin Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  The Certificate of Origin will use the goods information from the main invoice. 
                  The details entered here are specific to the COO document and will be combined 
                  with the product information to create a complete certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}