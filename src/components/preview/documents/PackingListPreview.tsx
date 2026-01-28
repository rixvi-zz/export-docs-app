import React, { useState, useEffect } from 'react';
import { useDocument } from '@/lib/store';
import { formatValue, formatCurrency, formatDate } from '@/utils/formatters';

export function PackingListPreview() {
  const document = useDocument();
  const [packingListNumber, setPackingListNumber] = useState('');
  const [invoiceReference, setInvoiceReference] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Generate deterministic values on client side only
  useEffect(() => {
    const timestamp = Date.now();
    setPackingListNumber(`PL-${timestamp}`);
    setInvoiceReference(`INV-${timestamp}`);
    setCurrentDate(new Date().toISOString());
  }, []);

  if (!document) {
    return (
      <div className="bg-white p-8 text-center text-gray-500">
        <div className="text-gray-500 text-sm">
          Packing list preview will appear here
        </div>
      </div>
    );
  }

  const { seller, buyer, consignee, goods = [], packingDetails, declaration, logo, sameAsBuyer } = document;
  const actualConsignee = sameAsBuyer ? buyer : consignee;

  // DEFENSIVE: Ensure goods is always an array
  const safeGoods = Array.isArray(goods) ? goods : [];

  return (
    <div className="bg-white shadow-lg" style={{ 
      width: '794px', 
      minHeight: '1123px', 
      padding: '56px 75px 56px 56px', // A4 margins: 15mm top/bottom, 20mm left, 15mm right
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000'
    }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          {logo && (
            <img 
              src={logo} 
              alt="Company Logo" 
              className="max-h-16 max-w-32 object-contain"
            />
          )}
          <div>
            <h1 className="text-xl font-bold mb-1">
              {formatValue(seller.companyName)}
            </h1>
            <div className="text-sm text-gray-600">
              {formatValue(seller.address)}<br />
              {formatValue(seller.city)}, {formatValue(seller.country)} {formatValue(seller.postalCode)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            PACKING LIST
          </h2>
          <div className="text-sm">
            <div><strong>Date:</strong> {currentDate ? formatDate(currentDate) : '—'}</div>
            <div><strong>Packing List No:</strong> {packingListNumber || '—'}</div>
            <div><strong>Invoice Reference:</strong> {invoiceReference || '—'}</div>
          </div>
        </div>
      </div>

      {/* Exporter Information */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">EXPORTER</h3>
        <div className="text-sm">
          <div className="font-semibold">{formatValue(seller.companyName)}</div>
          <div>{formatValue(seller.address)}</div>
          <div>{formatValue(seller.city)}, {formatValue(seller.country)} {formatValue(seller.postalCode)}</div>
          {seller.phone && <div>Tel: {formatValue(seller.phone)}</div>}
          {seller.email && <div>Email: {formatValue(seller.email)}</div>}
        </div>
      </div>

      {/* Buyer & Consignee Information */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">BUYER</h3>
          <div className="text-sm">
            <div className="font-semibold">{formatValue(buyer.companyName)}</div>
            {buyer.contactPerson && <div>Attn: {formatValue(buyer.contactPerson)}</div>}
            <div>{formatValue(buyer.address)}</div>
            <div>{formatValue(buyer.city)}, {formatValue(buyer.country)} {formatValue(buyer.postalCode)}</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">CONSIGNEE</h3>
          <div className="text-sm">
            {actualConsignee ? (
              <>
                <div className="font-semibold">{formatValue(actualConsignee.companyName)}</div>
                {actualConsignee.contactPerson && <div>Attn: {formatValue(actualConsignee.contactPerson)}</div>}
                <div>{formatValue(actualConsignee.address)}</div>
                <div>{formatValue(actualConsignee.city)}, {formatValue(actualConsignee.country)} {formatValue(actualConsignee.postalCode)}</div>
              </>
            ) : (
              <div>Same as Buyer</div>
            )}
          </div>
        </div>
      </div>

      {/* Package Summary */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">PACKAGE SUMMARY</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Total Packages:</strong><br />
            {formatValue(packingDetails.totalPackages)} {formatValue(packingDetails.packageType)}
          </div>
          <div>
            <strong>Net Weight:</strong><br />
            {formatCurrency(packingDetails.totalNetWeight)} KG
          </div>
          <div>
            <strong>Gross Weight:</strong><br />
            {formatCurrency(packingDetails.totalGrossWeight)} KG
          </div>
          <div>
            <strong>Total CBM:</strong><br />
            {formatCurrency(packingDetails.totalCBM)}
          </div>
        </div>
        
        {(packingDetails.containerNumber || packingDetails.sealNumber) && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {packingDetails.containerNumber && (
              <div>
                <strong>Container Number:</strong><br />
                {formatValue(packingDetails.containerNumber)}
              </div>
            )}
            {packingDetails.sealNumber && (
              <div>
                <strong>Seal Number:</strong><br />
                {formatValue(packingDetails.sealNumber)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Goods Description Table */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">GOODS DESCRIPTION & PACKING DETAILS</h3>
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left">Description of Goods</th>
              <th className="border border-gray-400 p-2 text-center">Quantity</th>
              <th className="border border-gray-400 p-2 text-center">Net Weight (KG)</th>
              <th className="border border-gray-400 p-2 text-center">Gross Weight (KG)</th>
              <th className="border border-gray-400 p-2 text-center">CBM</th>
              <th className="border border-gray-400 p-2 text-left">Marks & Numbers</th>
            </tr>
          </thead>
          <tbody>
            {safeGoods.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-400 p-4 text-center text-gray-500">
                  No goods information available
                </td>
              </tr>
            ) : (
              safeGoods.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 p-2">
                    <div className="font-medium">{formatValue(item.description)}</div>
                    {item.packagingSpecs && <div className="text-gray-600 mt-1">Packaging: {item.packagingSpecs}</div>}
                    {item.temperatureHandling && <div className="text-gray-600">Temperature: {item.temperatureHandling}</div>}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {formatValue(item.quantity)} {formatValue(item.unit)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {item.netWeight ? formatCurrency(item.netWeight) : '— Not Provided —'}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {item.grossWeight ? formatCurrency(item.grossWeight) : '— Not Provided —'}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {item.cbm ? formatCurrency(item.cbm) : '— Not Provided —'}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {formatValue(item.marksNumbers)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Total Summary */}
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium">
            <div>
              <strong>Total Packages:</strong><br />
              {formatValue(packingDetails.totalPackages)}
            </div>
            <div>
              <strong>Total Net Weight:</strong><br />
              {formatCurrency(packingDetails.totalNetWeight)} KG
            </div>
            <div>
              <strong>Total Gross Weight:</strong><br />
              {formatCurrency(packingDetails.totalGrossWeight)} KG
            </div>
            <div>
              <strong>Total CBM:</strong><br />
              {formatCurrency(packingDetails.totalCBM)}
            </div>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mt-8">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">DECLARATION</h3>
        <div className="text-sm mb-4">
          We hereby certify that the above particulars are correct and that the goods described above have been packed in accordance with the specifications mentioned herein.
        </div>
        <div className="text-sm mb-4">
          {formatValue(declaration.declarationText)}
        </div>
        <div className="flex justify-between">
          <div>
            <div className="mb-8">_________________________</div>
            <div><strong>Authorized Signature</strong></div>
          </div>
          <div className="text-right">
            <div><strong>Name:</strong> {formatValue(declaration.signatoryName)}</div>
            <div><strong>Title:</strong> {formatValue(declaration.signatoryTitle)}</div>
            <div><strong>Company:</strong> {formatValue(declaration.companyName)}</div>
            <div><strong>Place:</strong> {formatValue(declaration.placeOfSigning)}</div>
            <div><strong>Date:</strong> {formatDate(declaration.dateOfSigning)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}