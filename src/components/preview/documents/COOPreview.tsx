import React, { useState, useEffect } from 'react';
import { useDocument } from '@/lib/store';
import { formatValue, formatDate } from '@/utils/formatters';

export function COOPreview() {
  const document = useDocument();
  const [certificateNumber, setCertificateNumber] = useState('');

  // Generate deterministic values on client side only
  useEffect(() => {
    const timestamp = Date.now();
    setCertificateNumber(`COO-${timestamp}`);
  }, []);

  if (!document) {
    return (
      <div className="bg-white p-8 text-center text-gray-500">
        <div className="text-gray-500 text-sm">
          Certificate of Origin preview will appear here
        </div>
      </div>
    );
  }

  const { seller, buyer, goods = [], originDetails, logo, shipment } = document;

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
      <div className="text-center mb-8">
        {logo && (
          <div className="mb-4">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="max-h-16 max-w-32 object-contain mx-auto"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-purple-800 mb-2">
          CERTIFICATE OF ORIGIN
        </h1>
        <div className="text-sm">
          Certificate No: {certificateNumber || '—'}
        </div>
      </div>

      {/* Exporter Information */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">1. EXPORTER (Name and Address)</h3>
        <div className="text-sm border border-gray-300 p-3 min-h-[80px]">
          <div className="font-semibold">{formatValue(seller.companyName)}</div>
          <div>{formatValue(seller.address)}</div>
          <div>{formatValue(seller.city)}, {formatValue(seller.country)} {formatValue(seller.postalCode)}</div>
          {seller.phone && <div>Tel: {formatValue(seller.phone)}</div>}
          {seller.email && <div>Email: {formatValue(seller.email)}</div>}
        </div>
      </div>

      {/* Importer Information */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">2. IMPORTER (Name and Address)</h3>
        <div className="text-sm border border-gray-300 p-3 min-h-[80px]">
          <div className="font-semibold">{formatValue(buyer.companyName)}</div>
          {buyer.contactPerson && <div>Attn: {formatValue(buyer.contactPerson)}</div>}
          <div>{formatValue(buyer.address)}</div>
          <div>{formatValue(buyer.city)}, {formatValue(buyer.country)} {formatValue(buyer.postalCode)}</div>
        </div>
      </div>

      {/* Country of Origin */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">3. COUNTRY OF ORIGIN</h3>
        <div className="text-sm border border-gray-300 p-3">
          <div className="font-semibold text-lg">{formatValue(originDetails.countryOfOrigin || shipment.countryOfOrigin)}</div>
        </div>
      </div>

      {/* Manufacturer Details */}
      {(originDetails.manufacturerName || originDetails.manufacturerAddress) && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">4. MANUFACTURER (Name and Address)</h3>
          <div className="text-sm border border-gray-300 p-3">
            {originDetails.manufacturerName && <div className="font-semibold">{formatValue(originDetails.manufacturerName)}</div>}
            {originDetails.manufacturerAddress && <div>{formatValue(originDetails.manufacturerAddress)}</div>}
          </div>
        </div>
      )}

      {/* Goods Description */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">5. DESCRIPTION OF GOODS</h3>
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left">Description</th>
              <th className="border border-gray-400 p-2 text-center">HS Code</th>
              <th className="border border-gray-400 p-2 text-center">Quantity</th>
              <th className="border border-gray-400 p-2 text-center">Unit</th>
            </tr>
          </thead>
          <tbody>
            {safeGoods.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-gray-400 p-4 text-center text-gray-500">
                  No goods information available
                </td>
              </tr>
            ) : (
              safeGoods.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 p-2">
                    <div className="font-medium">{formatValue(item.description)}</div>
                    {item.qualitySpecs && <div className="text-gray-600 mt-1">Quality: {item.qualitySpecs}</div>}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">{formatValue(item.hsCode)}</td>
                  <td className="border border-gray-400 p-2 text-center">{formatValue(item.quantity)}</td>
                  <td className="border border-gray-400 p-2 text-center">{formatValue(item.unit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Declaration Statement */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">6. DECLARATION</h3>
        <div className="text-sm border border-gray-300 p-3 min-h-[100px]">
          <div className="mb-3">
            I hereby certify that the goods described above are of the origin of the country specified in item 3 and comply with the origin requirements specified for those goods.
          </div>
          {originDetails.declarationStatement && (
            <div className="mb-3">
              {formatValue(originDetails.declarationStatement)}
            </div>
          )}
          <div className="text-xs text-gray-600">
            This certificate is issued based on the information available and the exporter's declaration. 
            The issuing authority assumes no responsibility for the accuracy of the information provided.
          </div>
        </div>
      </div>

      {/* Certification Authority */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">7. CERTIFICATION</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-sm border border-gray-300 p-3">
            <div className="mb-4"><strong>Place of Issue:</strong></div>
            <div className="font-medium">{formatValue(originDetails.placeOfIssue)}</div>
          </div>
          <div className="text-sm border border-gray-300 p-3">
            <div className="mb-4"><strong>Date of Issue:</strong></div>
            <div className="font-medium">{formatDate(originDetails.dateOfIssue)}</div>
          </div>
        </div>
      </div>

      {/* Authorized Signatory */}
      <div className="mt-8">
        <h3 className="font-bold text-sm mb-2 bg-gray-100 p-2">8. AUTHORIZED SIGNATORY</h3>
        <div className="border border-gray-300 p-4">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="mb-8">
                <div className="border-b border-gray-400 w-64 mb-2"></div>
                <div className="text-sm"><strong>Authorized Signature & Stamp</strong></div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div><strong>Name:</strong> {formatValue(originDetails.authorizedSignatory)}</div>
              <div><strong>Title:</strong> {formatValue(originDetails.signatoryTitle)}</div>
              <div><strong>Organization:</strong> {formatValue(seller.companyName)}</div>
              <div className="mt-2">
                <div><strong>Place:</strong> {formatValue(originDetails.placeOfIssue)}</div>
                <div><strong>Date:</strong> {formatDate(originDetails.dateOfIssue)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-xs text-gray-600 text-center">
        This Certificate of Origin is issued in accordance with international trade regulations and standards.
      </div>
    </div>
  );
}