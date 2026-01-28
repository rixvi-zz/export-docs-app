'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentType, ShippingMethod } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormSection } from '@/components/ui/FormSection';

const shippingMethodOptions: { value: ShippingMethod; label: string }[] = [
  { value: 'sea-freight', label: 'Sea Freight / Ocean Shipping' },
  { value: 'air-freight', label: 'Air Freight' },
  { value: 'road-transport', label: 'Road Transport / Trucking' },
  { value: 'rail-transport', label: 'Rail Transport' },
  { value: 'courier', label: 'Courier / Express Delivery' },
  { value: 'multimodal', label: 'Multimodal Transport' },
  { value: 'pipeline', label: 'Pipeline Transport' },
  { value: 'inland-waterway', label: 'Inland Waterway' },
  { value: 'other', label: 'Other / Custom' }
];

export default function ShipmentSection() {
  const { control, watch } = useFormContext<DocumentType>();
  const shippingMethod = watch('shipment.shippingMethod');
  const showCustomMethod = shippingMethod === 'other';

  return (
    <FormSection 
      title="Shipment Details" 
      description="Shipping method and transport information"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="shipment.shippingMethod"
          control={control}
          label="Shipping Method"
          options={shippingMethodOptions}
          required
        />

        {showCustomMethod && (
          <Input
            name="shipment.customShippingMethod"
            control={control}
            label="Custom Shipping Method"
            placeholder="Enter custom shipping method"
          />
        )}

        <Input
          name="shipment.portOfLoading"
          control={control}
          label="Port/Place of Loading"
          placeholder="Port or place where goods are loaded"
        />

        <Input
          name="shipment.portOfDischarge"
          control={control}
          label="Port/Place of Discharge"
          placeholder="Destination port or place"
        />

        <Input
          name="shipment.countryOfOrigin"
          control={control}
          label="Country of Origin"
          placeholder="Where goods are manufactured/produced"
        />

        <Input
          name="shipment.countryOfDestination"
          control={control}
          label="Country of Destination"
          placeholder="Final destination country"
        />

        <Input
          name="shipment.vesselName"
          control={control}
          label="Vessel/Vehicle Name"
          placeholder="Name of vessel, aircraft, or vehicle"
        />

        <Input
          name="shipment.voyageNumber"
          control={control}
          label="Voyage/Flight Number"
          placeholder="Voyage, flight, or trip number"
        />

        <Input
          name="shipment.billOfLadingDate"
          control={control}
          label="Bill of Lading Date"
          type="date"
        />

        <Input
          name="shipment.estimatedDeparture"
          control={control}
          label="Estimated Departure"
          type="date"
        />

        <Input
          name="shipment.estimatedArrival"
          control={control}
          label="Estimated Arrival"
          type="date"
        />
      </div>
    </FormSection>
  );
}