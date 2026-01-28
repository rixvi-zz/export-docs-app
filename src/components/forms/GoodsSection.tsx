'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DocumentType, ProductCategory, GoodsItem, Currency } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FormSection } from '@/components/ui/FormSection';

const productCategories: { value: ProductCategory; label: string }[] = [
  { value: 'agricultural-produce', label: 'Agricultural Produce' },
  { value: 'grains-cereals', label: 'Grains & Cereals' },
  { value: 'feed-raw-materials', label: 'Feed & Raw Materials' },
  { value: 'oils-fats', label: 'Oils & Fats' },
  { value: 'meat-poultry', label: 'Meat & Poultry' },
  { value: 'dairy-products', label: 'Dairy Products' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'processed-foods', label: 'Processed Foods' },
  { value: 'spices-condiments', label: 'Spices & Condiments' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'animal-byproducts', label: 'Animal Byproducts' },
  { value: 'other', label: 'Other (Custom)' }
];

const currencyOptions: { value: Currency; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CAD', label: 'CAD' },
  { value: 'AUD', label: 'AUD' },
  { value: 'CHF', label: 'CHF' },
  { value: 'CNY', label: 'CNY' },
  { value: 'INR', label: 'INR' },
  { value: 'SGD', label: 'SGD' },
  { value: 'HKD', label: 'HKD' },
  { value: 'SEK', label: 'SEK' },
  { value: 'NOK', label: 'NOK' },
  { value: 'DKK', label: 'DKK' },
  { value: 'NZD', label: 'NZD' },
  { value: 'ZAR', label: 'ZAR' },
  { value: 'BRL', label: 'BRL' },
  { value: 'MXN', label: 'MXN' },
  { value: 'KRW', label: 'KRW' },
  { value: 'THB', label: 'THB' }
];

const commonUnits = [
  'KG', 'MT', 'LBS', 'TON', 'PCS', 'BOXES', 'BAGS', 'CARTONS', 
  'PALLETS', 'CONTAINERS', 'LITERS', 'GALLONS', 'CBM', 'CFT'
];

interface GoodsSectionProps {
  onUpdate?: (goods: GoodsItem[]) => void;
}

export default function GoodsSection({ onUpdate }: GoodsSectionProps) {
  const { control, watch, setValue } = useFormContext<DocumentType>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'goods'
  });

  const watchedGoods = watch('goods');

  // Add new line item
  const addLineItem = () => {
    const defaultCurrency = watch('currency') || 'USD';
    const newItem: GoodsItem = {
      description: '',
      category: 'other',
      customCategory: '',
      hsCode: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      totalPrice: 0,
      currency: defaultCurrency,
      qualitySpecs: '',
      packagingSpecs: '',
      temperatureHandling: '',
      inspectionCerts: '',
      netWeight: 0,
      grossWeight: 0,
      cbm: 0,
      marksNumbers: ''
    };
    append(newItem);
  };

  // Calculate total price for a line item
  const calculateTotal = (index: number) => {
    const quantity = watchedGoods?.[index]?.quantity || 0;
    const unitPrice = watchedGoods?.[index]?.unitPrice || 0;
    const total = quantity * unitPrice;
    setValue(`goods.${index}.totalPrice`, total);
    
    if (onUpdate) {
      onUpdate(watchedGoods || []);
    }
  };

  // Calculate grand total by currency
  const totalsByCurrency = watchedGoods?.reduce((acc, item) => {
    const currency = item.currency || 'USD';
    const total = item.totalPrice || 0;
    acc[currency] = (acc[currency] || 0) + total;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <FormSection title="Goods & Line Items" description="Add products and their specifications">
      <div className="space-y-6">
        {fields.map((field, index) => {
          const category = watchedGoods?.[index]?.category;
          const showCustomCategory = category === 'other';
          
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Line Item {index + 1}
                </h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Item
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <Textarea
                    name={`goods.${index}.description`}
                    control={control}
                    label="Product Description"
                    placeholder="Detailed description of the product..."
                    rows={3}
                  />
                </div>

                <Select
                  name={`goods.${index}.category`}
                  control={control}
                  label="Product Category"
                  options={productCategories}
                />

                {showCustomCategory && (
                  <Input
                    name={`goods.${index}.customCategory`}
                    control={control}
                    label="Custom Category"
                    placeholder="Enter custom category"
                  />
                )}

                <Input
                  name={`goods.${index}.hsCode`}
                  control={control}
                  label="HS Code"
                  placeholder="Harmonized System Code"
                />

                {/* Quantity & Pricing */}
                <Input
                  name={`goods.${index}.quantity`}
                  control={control}
                  label="Quantity"
                  type="number"
                />

                <Select
                  name={`goods.${index}.unit`}
                  control={control}
                  label="Unit"
                  options={commonUnits.map(unit => ({ value: unit, label: unit }))}
                  allowCustom
                />

                <Input
                  name={`goods.${index}.unitPrice`}
                  control={control}
                  label="Unit Price"
                  type="number"
                />

                <Select
                  name={`goods.${index}.currency`}
                  control={control}
                  label="Currency"
                  options={currencyOptions}
                />

                <Input
                  name={`goods.${index}.totalPrice`}
                  control={control}
                  label="Total Price"
                  type="number"
                  className="bg-gray-100"
                />

                {/* Specifications */}
                <Input
                  name={`goods.${index}.qualitySpecs`}
                  control={control}
                  label="Quality Specifications"
                  placeholder="Grade, quality standards, etc."
                />

                <Input
                  name={`goods.${index}.packagingSpecs`}
                  control={control}
                  label="Packaging Specifications"
                  placeholder="Packaging type, materials, etc."
                />

                <Input
                  name={`goods.${index}.temperatureHandling`}
                  control={control}
                  label="Temperature Handling"
                  placeholder="Storage/transport temperature requirements"
                />

                <Input
                  name={`goods.${index}.inspectionCerts`}
                  control={control}
                  label="Inspection Certificates"
                  placeholder="Required certificates or inspections"
                />

                {/* Packing Details */}
                <Input
                  name={`goods.${index}.netWeight`}
                  control={control}
                  label="Net Weight (KG)"
                  type="number"
                />

                <Input
                  name={`goods.${index}.grossWeight`}
                  control={control}
                  label="Gross Weight (KG)"
                  type="number"
                />

                <Input
                  name={`goods.${index}.cbm`}
                  control={control}
                  label="CBM (Cubic Meters)"
                  type="number"
                />

                <Input
                  name={`goods.${index}.marksNumbers`}
                  control={control}
                  label="Marks & Numbers"
                  placeholder="Package markings and numbers"
                />
              </div>
            </div>
          );
        })}

        {/* Add Line Item Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addLineItem}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Line Item
          </button>
        </div>

        {/* Grand Total */}
        {watchedGoods && watchedGoods.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-2">
              <span className="text-lg font-medium text-blue-900 block">
                Grand Totals:
              </span>
              {Object.entries(totalsByCurrency).map(([currency, total]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="text-blue-800">
                    {currency}:
                  </span>
                  <span className="text-xl font-bold text-blue-900">
                    {total.toFixed(2)} {currency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initialize with one item if empty */}
        {fields.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No line items added yet.</p>
            <button
              type="button"
              onClick={addLineItem}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Line Item
            </button>
          </div>
        )}
      </div>
    </FormSection>
  );
}