import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';

interface PackingDetailsSectionProps {
  className?: string;
}

export function PackingDetailsSection({ className }: PackingDetailsSectionProps) {
  const { control, watch } = useFormContext<DocumentType>();
  const goods = watch('goods') || [];

  // Calculate totals from individual line items
  const totalNetWeight = goods.reduce((sum, item) => sum + (item.netWeight || 0), 0);
  const totalGrossWeight = goods.reduce((sum, item) => sum + (item.grossWeight || 0), 0);
  const totalCBM = goods.reduce((sum, item) => sum + (item.cbm || 0), 0);

  return (
    <FormSection title="Packing Details" className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="packingDetails.totalPackages"
          control={control}
          label="Total Packages"
          type="number"
          required
          placeholder="Enter total number of packages"
        />
        
        <Input
          name="packingDetails.packageType"
          control={control}
          label="Package Type"
          required
          placeholder="e.g., Cartons, Pallets, Bags"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Total Net Weight (KG)
            <span className="text-gray-500 text-xs ml-1">(Auto-calculated)</span>
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
            {totalNetWeight.toFixed(2)}
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Total Gross Weight (KG)
            <span className="text-gray-500 text-xs ml-1">(Auto-calculated)</span>
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
            {totalGrossWeight.toFixed(2)}
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Total CBM
            <span className="text-gray-500 text-xs ml-1">(Auto-calculated)</span>
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
            {totalCBM.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="packingDetails.containerNumber"
          control={control}
          label="Container Number"
          placeholder="Enter container number"
        />
        
        <Input
          name="packingDetails.sealNumber"
          control={control}
          label="Seal Number"
          placeholder="Enter seal number"
        />
      </div>

      {/* Hidden fields to store calculated values */}
      <input
        type="hidden"
        {...control.register('packingDetails.totalNetWeight')}
        value={totalNetWeight}
      />
      <input
        type="hidden"
        {...control.register('packingDetails.totalGrossWeight')}
        value={totalGrossWeight}
      />
      <input
        type="hidden"
        {...control.register('packingDetails.totalCBM')}
        value={totalCBM}
      />
    </FormSection>
  );
}