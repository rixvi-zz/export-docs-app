import React from 'react';
import { useDocument } from '@/lib/store';

interface InvoicePreviewProps {
  isProforma?: boolean;
}

export function InvoicePreview({ isProforma = false }: InvoicePreviewProps) {
  const document = useDocument();

  const documentTitle = isProforma ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE';
  const totalAmount = document?.goods?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
  const currency = document?.currency || 'USD';

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {document?.logo && (
              <img 
                src={document.logo} 
                alt="Company Logo" 
                className="h-16 w-auto mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-800">{documentTitle}</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Invoice No: INV-{Date.now()}
            </div>
            <div className="text-sm text-gray-600">
              Date: {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              Currency: {currency}
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">SELLER/EXPORTER:</h3>
          <div className="text-sm">
            <div className="font-medium">{document?.seller?.companyName || '— Not Provided —'}</div>
            <div>{document?.seller?.address || '— Not Provided —'}</div>
            <div>{document?.seller?.city || ''} {document?.seller?.postalCode || ''}</div>
            <div>{document?.seller?.country || '— Not Provided —'}</div>
            <div>Phone: {document?.seller?.phone || '— Not Provided —'}</div>
            <div>Email: {document?.seller?.email || '— Not Provided —'}</div>
            {document?.seller?.taxId && <div>Tax ID: {document.seller.taxId}</div>}
            {document?.seller?.exportLicense && <div>Export License: {document.seller.exportLicense}</div>}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">BUYER/IMPORTER:</h3>
          <div className="text-sm">
            <div className="font-medium">{document?.buyer?.companyName || '— Not Provided —'}</div>
            {document?.buyer?.contactPerson && <div>Contact: {document.buyer.contactPerson}</div>}
            <div>{document?.buyer?.address || '— Not Provided —'}</div>
            <div>{document?.buyer?.city || ''} {document?.buyer?.postalCode || ''}</div>
            <div>{document?.buyer?.country || '— Not Provided —'}</div>
            <div>Phone: {document?.buyer?.phone || '— Not Provided —'}</div>
            <div>Email: {document?.buyer?.email || '— Not Provided —'}</div>
          </div>
        </div>
      </div>

      {/* Consignee (if different from buyer) */}
      {document?.consignee && document.consignee.companyName && !document.sameAsBuyer && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">CONSIGNEE:</h3>
          <div className="text-sm">
            <div className="font-medium">{document.consignee.companyName}</div>
            {document.consignee.contactPerson && <div>Contact: {document.consignee.contactPerson}</div>}
            <div>{document.consignee.address}</div>
            <div>{document.consignee.city} {document.consignee.postalCode}</div>
            <div>{document.consignee.country}</div>
            {document.consignee.phone && <div>Phone: {document.consignee.phone}</div>}
            {document.consignee.email && <div>Email: {document.consignee.email}</div>}
          </div>
        </div>
      )}

      {/* Shipment Details */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-2">SHIPMENT DETAILS:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div>Shipping Method: {document?.shipment?.shippingMethod?.replace('-', ' ').toUpperCase() || '— Not Provided —'}</div>
            <div>Port of Loading: {document?.shipment?.portOfLoading || '— Not Provided —'}</div>
            <div>Port of Discharge: {document?.shipment?.portOfDischarge || '— Not Provided —'}</div>
            <div>Country of Origin: {document?.shipment?.countryOfOrigin || '— Not Provided —'}</div>
            <div>Country of Destination: {document?.shipment?.countryOfDestination || '— Not Provided —'}</div>
          </div>
          <div>
            {document?.shipment?.vesselName && <div>Vessel: {document.shipment.vesselName}</div>}
            {document?.shipment?.voyageNumber && <div>Voyage: {document.shipment.voyageNumber}</div>}
            {document?.shipment?.billOfLadingDate && <div>B/L Date: {new Date(document.shipment.billOfLadingDate).toLocaleDateString()}</div>}
            {document?.shipment?.estimatedDeparture && <div>ETD: {new Date(document.shipment.estimatedDeparture).toLocaleDateString()}</div>}
            {document?.shipment?.estimatedArrival && <div>ETA: {new Date(document.shipment.estimatedArrival).toLocaleDateString()}</div>}
          </div>
        </div>
      </div>

      {/* Goods Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-2 text-left text-xs font-semibold">Description of Goods</th>
              <th className="border border-gray-400 px-2 py-2 text-left text-xs font-semibold">Category</th>
              <th className="border border-gray-400 px-2 py-2 text-left text-xs font-semibold">HS Code</th>
              <th className="border border-gray-400 px-2 py-2 text-right text-xs font-semibold">Qty</th>
              <th className="border border-gray-400 px-2 py-2 text-left text-xs font-semibold">Unit</th>
              <th className="border border-gray-400 px-2 py-2 text-right text-xs font-semibold">Unit Price</th>
              <th className="border border-gray-400 px-2 py-2 text-right text-xs font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {document?.goods && document.goods.length > 0 ? (
              document.goods.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-2 py-2 text-xs">
                    <div>{item.description || '— Not Provided —'}</div>
                    {item.qualitySpecs && <div className="text-gray-600 mt-1">Quality: {item.qualitySpecs}</div>}
                    {item.packagingSpecs && <div className="text-gray-600">Packaging: {item.packagingSpecs}</div>}
                    {item.temperatureHandling && <div className="text-gray-600">Temperature: {item.temperatureHandling}</div>}
                    {item.inspectionCerts && <div className="text-gray-600">Inspection: {item.inspectionCerts}</div>}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-xs">
                    {item.category === 'other' && item.customCategory ? item.customCategory : 
                     item.category?.replace('-', ' ').toUpperCase() || '— Not Provided —'}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-xs">{item.hsCode || '— Not Provided —'}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs text-right">{item.quantity || 0}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs">{item.unit || '— Not Provided —'}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs text-right">{item.currency || currency} {(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs text-right">{item.currency || currency} {(item.totalPrice || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border border-gray-400 px-2 py-4 text-center text-gray-500 text-xs">
                  No goods added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="border border-gray-400">
            <div className="flex justify-between px-4 py-2 bg-gray-100">
              <span className="font-semibold text-sm">TOTAL AMOUNT:</span>
              <span className="font-semibold text-sm">
                {currency} {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Terms */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">TRADE TERMS:</h3>
          <div className="text-sm">
            <div>Incoterms: {document?.incoterms?.term || '— Not Provided —'} {document?.incoterms?.place || ''}</div>
            {document?.incoterms?.iccVersion && <div>ICC Version: {document.incoterms.iccVersion}</div>}
            <div>Payment Terms: {document?.paymentTerms || '— Not Provided —'}</div>
            <div>Payment Mode: {document?.paymentModes && document.paymentModes.length > 0 ? 
              document.paymentModes.map(mode => mode.replace('-', ' ').toUpperCase()).join(' / ') : 
              '— Not Provided —'}</div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">ADDITIONAL DETAILS:</h3>
          <div className="text-sm">
            {document?.packingDetails && (
              <>
                <div>Total Packages: {document.packingDetails.totalPackages} {document.packingDetails.packageType}</div>
                <div>Net Weight: {document.packingDetails.totalNetWeight} KG</div>
                <div>Gross Weight: {document.packingDetails.totalGrossWeight} KG</div>
                <div>Total CBM: {document.packingDetails.totalCBM}</div>
                {document.packingDetails.containerNumber && <div>Container: {document.packingDetails.containerNumber}</div>}
                {document.packingDetails.sealNumber && <div>Seal: {document.packingDetails.sealNumber}</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Banking Details */}
      {document?.banking && (document.banking.beneficiaryBank || document.banking.bankAddress) && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">BANKING DETAILS:</h3>
          <div className="text-sm">
            {document.banking.beneficiaryBank && <div>Beneficiary Bank: {document.banking.beneficiaryBank}</div>}
            {document.banking.bankAddress && <div>Bank Address: {document.banking.bankAddress}</div>}
            {document.banking.swiftCode && <div>SWIFT Code: {document.banking.swiftCode}</div>}
            {document.banking.accountNumber && <div>Account Number: {document.banking.accountNumber}</div>}
            {document.banking.routingNumber && <div>Routing Number: {document.banking.routingNumber}</div>}
            {document.banking.correspondentBank && <div>Correspondent Bank: {document.banking.correspondentBank}</div>}
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      {document?.terms && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">TERMS & CONDITIONS:</h3>
          <div className="text-sm whitespace-pre-wrap">
            {document.terms}
          </div>
        </div>
      )}

      {/* Declaration */}
      {document?.declaration && (
        <div className="mt-12 pt-8 border-t border-gray-300">
          <h3 className="font-semibold text-gray-800 mb-2">DECLARATION:</h3>
          <div className="text-sm mb-4">
            {document.declaration.declarationText || 'I hereby declare that the information contained in this document is true and accurate.'}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm">
                <div>Place: {document.declaration.placeOfSigning || '— Not Provided —'}</div>
                <div>Date: {document.declaration.dateOfSigning ? new Date(document.declaration.dateOfSigning).toLocaleDateString() : new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="border-t border-gray-400 pt-2 mt-8 w-48">
                <div className="text-sm font-medium">{document.declaration.signatoryName || '— Not Provided —'}</div>
                <div className="text-xs text-gray-600">{document.declaration.signatoryTitle || 'Authorized Signatory'}</div>
                {document.declaration.companyName && <div className="text-xs text-gray-600">{document.declaration.companyName}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {isProforma && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This is a Proforma Invoice for customs and reference purposes only. 
            This is not a demand for payment.
          </p>
        </div>
      )}
    </div>
  );
}