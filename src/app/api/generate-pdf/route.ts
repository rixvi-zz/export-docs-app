// CRITICAL: Force Node.js runtime for Next.js 16 + Turbopack
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 seconds timeout

import puppeteer, { Browser } from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    console.log('🔄 Starting PDF generation...');

    const { docData, documentType } = await req.json();

    if (!docData || !documentType) {
      return NextResponse.json(
        { error: 'Missing docData or documentType' },
        { status: 400 }
      );
    }

    // Generate HTML with embedded CSS (no external dependencies)
    const html = generateHTML(docData, documentType);
    console.log('✅ HTML generated successfully');

    // Launch Puppeteer
    console.log('🚀 Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--metrics-recording-only',
        '--no-first-run',
      ],
    });

    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '20mm',
        right: '15mm',
      },
    });

    await browser.close();
    browser = null;

    console.log('✅ PDF generated successfully');

    const filename = getFilename(documentType);

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ PDF Generation Error:', error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Browser cleanup error:', closeError);
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'PDF generation failed',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// HTML Generator that matches the preview exactly
function generateHTML(docData: any, documentType: string): string {
  const titleMap: Record<string, string> = {
    'commercial-invoice': 'COMMERCIAL INVOICE',
    'proforma-invoice': 'PROFORMA INVOICE',
    'packing-list': 'PACKING LIST',
    'certificate-of-origin': 'CERTIFICATE OF ORIGIN'
  };

  const title = titleMap[documentType] || 'DOCUMENT';
  const currency = docData?.currency || 'USD';
  const totalAmount = docData?.goods?.reduce(
    (sum: number, g: any) => sum + (g.totalPrice || 0),
    0
  ) || 0;
  const isProforma = documentType === 'proforma-invoice';

  // Generate goods table rows exactly like preview
  const goodsRows = docData?.goods?.length > 0
    ? docData.goods.map((item: any) => {
      return `
        <tr>
          <td class="border-cell">
            <div>${item.description || '— Not Provided —'}</div>
            ${item.qualitySpecs ? `<div class="text-gray-600 mt-1">Quality: ${item.qualitySpecs}</div>` : ''}
            ${item.packagingSpecs ? `<div class="text-gray-600">Packaging: ${item.packagingSpecs}</div>` : ''}
            ${item.temperatureHandling ? `<div class="text-gray-600">Temperature: ${item.temperatureHandling}</div>` : ''}
            ${item.inspectionCerts ? `<div class="text-gray-600">Inspection: ${item.inspectionCerts}</div>` : ''}
          </td>
          <td class="border-cell">
            ${item.category === 'other' && item.customCategory ? item.customCategory : 
             (item.category?.replace('-', ' ').toUpperCase() || '— Not Provided —')}
          </td>
          <td class="border-cell">${item.hsCode || '— Not Provided —'}</td>
          <td class="border-cell text-right">${item.quantity || 0}</td>
          <td class="border-cell">${item.unit || '— Not Provided —'}</td>
          <td class="border-cell text-right">${item.currency || currency} ${(item.unitPrice || 0).toFixed(2)}</td>
          <td class="border-cell text-right">${item.currency || currency} ${(item.totalPrice || 0).toFixed(2)}</td>
        </tr>
      `;
    }).join('')
    : '<tr><td colspan="7" class="border-cell text-center text-gray-500" style="padding: 16px;">No goods added yet</td></tr>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    
    body { 
      font-family: Arial, sans-serif; 
      margin: 0;
      padding: 40px;
      color: #000;
      background: white;
      font-size: 12px;
      line-height: 1.4;
    }
    
    .document-container {
      width: 100%;
      max-width: 794px;
      margin: 0 auto;
      background: white;
    }
    
    /* Header Section */
    .header-section {
      border-bottom: 2px solid #1f2937;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    
    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .logo-title {
      flex: 1;
    }
    
    .company-logo {
      height: 64px;
      width: auto;
      margin-bottom: 16px;
      display: block;
    }
    
    .document-title {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }
    
    .header-info {
      text-align: right;
      font-size: 12px;
      color: #4b5563;
    }
    
    .header-info div {
      margin-bottom: 4px;
    }
    
    /* Company Information Grid */
    .company-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }
    
    .company-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .company-details {
      font-size: 12px;
    }
    
    .company-details div {
      margin-bottom: 2px;
    }
    
    .company-name {
      font-weight: 500;
    }
    
    /* Consignee Section */
    .consignee-section {
      margin-bottom: 32px;
    }
    
    .consignee-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    /* Shipment Details */
    .shipment-section {
      margin-bottom: 32px;
    }
    
    .shipment-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .shipment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      font-size: 12px;
    }
    
    .shipment-grid div {
      margin-bottom: 2px;
    }
    
    /* Goods Table */
    .goods-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    
    .goods-table th {
      border: 1px solid #9ca3af;
      padding: 8px;
      text-align: left;
      font-size: 10px;
      font-weight: 600;
      background-color: #f3f4f6;
    }
    
    .border-cell {
      border: 1px solid #9ca3af;
      padding: 8px;
      font-size: 10px;
      vertical-align: top;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-gray-600 {
      color: #4b5563;
      margin-top: 4px;
    }
    
    .text-gray-500 {
      color: #6b7280;
    }
    
    .mt-1 {
      margin-top: 4px;
    }
    
    /* Totals Section */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    
    .totals-box {
      width: 256px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      background-color: #f3f4f6;
      border: 1px solid #9ca3af;
    }
    
    .totals-label {
      font-weight: 600;
      font-size: 12px;
    }
    
    .totals-amount {
      font-weight: 600;
      font-size: 12px;
    }
    
    /* Trade Terms Grid */
    .trade-terms-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }
    
    .trade-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .trade-details {
      font-size: 12px;
    }
    
    .trade-details div {
      margin-bottom: 2px;
    }
    
    /* Banking Details */
    .banking-section {
      margin-bottom: 32px;
    }
    
    .banking-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .banking-details {
      font-size: 12px;
    }
    
    .banking-details div {
      margin-bottom: 2px;
    }
    
    /* Terms & Conditions */
    .terms-section {
      margin-bottom: 32px;
    }
    
    .terms-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .terms-content {
      font-size: 12px;
      white-space: pre-wrap;
    }
    
    /* Declaration */
    .declaration-section {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid #d1d5db;
    }
    
    .declaration-section h3 {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 12px;
    }
    
    .declaration-text {
      font-size: 12px;
      margin-bottom: 16px;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .signature-left {
      font-size: 12px;
    }
    
    .signature-left div {
      margin-bottom: 2px;
    }
    
    .signature-right {
      text-align: right;
    }
    
    .signature-line {
      border-top: 1px solid #9ca3af;
      padding-top: 8px;
      margin-top: 32px;
      width: 192px;
    }
    
    .signatory-name {
      font-size: 12px;
      font-weight: 500;
    }
    
    .signatory-title {
      font-size: 10px;
      color: #4b5563;
    }
    
    .signatory-company {
      font-size: 10px;
      color: #4b5563;
    }
    
    /* Proforma Note */
    .proforma-note {
      margin-top: 32px;
      padding: 16px;
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 4px;
    }
    
    .proforma-note p {
      font-size: 10px;
      color: #92400e;
      margin: 0;
    }
    
    .proforma-note strong {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="document-container">
    <!-- Header -->
    <div class="header-section">
      <div class="header-flex">
        <div class="logo-title">
          ${docData?.logo ? `<img src="${docData.logo}" alt="Company Logo" class="company-logo" />` : ''}
          <h1 class="document-title">${title}</h1>
        </div>
        <div class="header-info">
          <div>Invoice No: INV-${Date.now()}</div>
          <div>Date: ${new Date().toLocaleDateString()}</div>
          <div>Currency: ${currency}</div>
        </div>
      </div>
    </div>

    <!-- Company Information -->
    <div class="company-grid">
      <div class="company-section">
        <h3>SELLER/EXPORTER:</h3>
        <div class="company-details">
          <div class="company-name">${docData?.seller?.companyName || '— Not Provided —'}</div>
          <div>${docData?.seller?.address || '— Not Provided —'}</div>
          <div>${docData?.seller?.city || ''} ${docData?.seller?.postalCode || ''}</div>
          <div>${docData?.seller?.country || '— Not Provided —'}</div>
          <div>Phone: ${docData?.seller?.phone || '— Not Provided —'}</div>
          <div>Email: ${docData?.seller?.email || '— Not Provided —'}</div>
          ${docData?.seller?.taxId ? `<div>Tax ID: ${docData.seller.taxId}</div>` : ''}
          ${docData?.seller?.exportLicense ? `<div>Export License: ${docData.seller.exportLicense}</div>` : ''}
        </div>
      </div>
      
      <div class="company-section">
        <h3>BUYER/IMPORTER:</h3>
        <div class="company-details">
          <div class="company-name">${docData?.buyer?.companyName || '— Not Provided —'}</div>
          ${docData?.buyer?.contactPerson ? `<div>Contact: ${docData.buyer.contactPerson}</div>` : ''}
          <div>${docData?.buyer?.address || '— Not Provided —'}</div>
          <div>${docData?.buyer?.city || ''} ${docData?.buyer?.postalCode || ''}</div>
          <div>${docData?.buyer?.country || '— Not Provided —'}</div>
          <div>Phone: ${docData?.buyer?.phone || '— Not Provided —'}</div>
          <div>Email: ${docData?.buyer?.email || '— Not Provided —'}</div>
        </div>
      </div>
    </div>

    <!-- Consignee (if different from buyer) -->
    ${docData?.consignee && docData.consignee.companyName && !docData.sameAsBuyer ? `
    <div class="consignee-section">
      <h3>CONSIGNEE:</h3>
      <div class="company-details">
        <div class="company-name">${docData.consignee.companyName}</div>
        ${docData.consignee.contactPerson ? `<div>Contact: ${docData.consignee.contactPerson}</div>` : ''}
        <div>${docData.consignee.address}</div>
        <div>${docData.consignee.city} ${docData.consignee.postalCode}</div>
        <div>${docData.consignee.country}</div>
        ${docData.consignee.phone ? `<div>Phone: ${docData.consignee.phone}</div>` : ''}
        ${docData.consignee.email ? `<div>Email: ${docData.consignee.email}</div>` : ''}
      </div>
    </div>
    ` : ''}

    <!-- Shipment Details -->
    <div class="shipment-section">
      <h3>SHIPMENT DETAILS:</h3>
      <div class="shipment-grid">
        <div>
          <div>Shipping Method: ${docData?.shipment?.shippingMethod?.replace('-', ' ').toUpperCase() || '— Not Provided —'}</div>
          <div>Port of Loading: ${docData?.shipment?.portOfLoading || '— Not Provided —'}</div>
          <div>Port of Discharge: ${docData?.shipment?.portOfDischarge || '— Not Provided —'}</div>
          <div>Country of Origin: ${docData?.shipment?.countryOfOrigin || '— Not Provided —'}</div>
          <div>Country of Destination: ${docData?.shipment?.countryOfDestination || '— Not Provided —'}</div>
        </div>
        <div>
          ${docData?.shipment?.vesselName ? `<div>Vessel: ${docData.shipment.vesselName}</div>` : ''}
          ${docData?.shipment?.voyageNumber ? `<div>Voyage: ${docData.shipment.voyageNumber}</div>` : ''}
          ${docData?.shipment?.billOfLadingDate ? `<div>B/L Date: ${new Date(docData.shipment.billOfLadingDate).toLocaleDateString()}</div>` : ''}
          ${docData?.shipment?.estimatedDeparture ? `<div>ETD: ${new Date(docData.shipment.estimatedDeparture).toLocaleDateString()}</div>` : ''}
          ${docData?.shipment?.estimatedArrival ? `<div>ETA: ${new Date(docData.shipment.estimatedArrival).toLocaleDateString()}</div>` : ''}
        </div>
      </div>
    </div>

    <!-- Goods Table -->
    <table class="goods-table">
      <thead>
        <tr>
          <th>Description of Goods</th>
          <th>Category</th>
          <th>HS Code</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${goodsRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="totals-row">
          <span class="totals-label">TOTAL AMOUNT:</span>
          <span class="totals-amount">${currency} ${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Trade Terms -->
    <div class="trade-terms-grid">
      <div class="trade-section">
        <h3>TRADE TERMS:</h3>
        <div class="trade-details">
          <div>Incoterms: ${docData?.incoterms?.term || '— Not Provided —'} ${docData?.incoterms?.place || ''}</div>
          ${docData?.incoterms?.iccVersion ? `<div>ICC Version: ${docData.incoterms.iccVersion}</div>` : ''}
          <div>Payment Terms: ${docData?.paymentTerms || '— Not Provided —'}</div>
          <div>Payment Mode: ${docData?.paymentModes && docData.paymentModes.length > 0 ? 
            docData.paymentModes.map((mode: string) => mode.replace('-', ' ').toUpperCase()).join(' / ') : 
            '— Not Provided —'}</div>
        </div>
      </div>
      
      <div class="trade-section">
        <h3>ADDITIONAL DETAILS:</h3>
        <div class="trade-details">
          ${docData?.packingDetails ? `
            <div>Total Packages: ${docData.packingDetails.totalPackages} ${docData.packingDetails.packageType}</div>
            <div>Net Weight: ${docData.packingDetails.totalNetWeight} KG</div>
            <div>Gross Weight: ${docData.packingDetails.totalGrossWeight} KG</div>
            <div>Total CBM: ${docData.packingDetails.totalCBM}</div>
            ${docData.packingDetails.containerNumber ? `<div>Container: ${docData.packingDetails.containerNumber}</div>` : ''}
            ${docData.packingDetails.sealNumber ? `<div>Seal: ${docData.packingDetails.sealNumber}</div>` : ''}
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Banking Details -->
    ${docData?.banking && (docData.banking.beneficiaryBank || docData.banking.bankAddress) ? `
    <div class="banking-section">
      <h3>BANKING DETAILS:</h3>
      <div class="banking-details">
        ${docData.banking.beneficiaryBank ? `<div>Beneficiary Bank: ${docData.banking.beneficiaryBank}</div>` : ''}
        ${docData.banking.bankAddress ? `<div>Bank Address: ${docData.banking.bankAddress}</div>` : ''}
        ${docData.banking.swiftCode ? `<div>SWIFT Code: ${docData.banking.swiftCode}</div>` : ''}
        ${docData.banking.accountNumber ? `<div>Account Number: ${docData.banking.accountNumber}</div>` : ''}
        ${docData.banking.routingNumber ? `<div>Routing Number: ${docData.banking.routingNumber}</div>` : ''}
        ${docData.banking.correspondentBank ? `<div>Correspondent Bank: ${docData.banking.correspondentBank}</div>` : ''}
      </div>
    </div>
    ` : ''}

    <!-- Terms & Conditions -->
    ${docData?.terms ? `
    <div class="terms-section">
      <h3>TERMS & CONDITIONS:</h3>
      <div class="terms-content">${docData.terms}</div>
    </div>
    ` : ''}

    <!-- Declaration -->
    ${docData?.declaration ? `
    <div class="declaration-section">
      <h3>DECLARATION:</h3>
      <div class="declaration-text">
        ${docData.declaration.declarationText || 'I hereby declare that the information contained in this document is true and accurate.'}
      </div>
      <div class="signature-section">
        <div class="signature-left">
          <div>Place: ${docData.declaration.placeOfSigning || '— Not Provided —'}</div>
          <div>Date: ${docData.declaration.dateOfSigning ? new Date(docData.declaration.dateOfSigning).toLocaleDateString() : new Date().toLocaleDateString()}</div>
        </div>
        <div class="signature-right">
          <div class="signature-line">
            <div class="signatory-name">${docData.declaration.signatoryName || '— Not Provided —'}</div>
            <div class="signatory-title">${docData.declaration.signatoryTitle || 'Authorized Signatory'}</div>
            ${docData.declaration.companyName ? `<div class="signatory-company">${docData.declaration.companyName}</div>` : ''}
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${isProforma ? `
    <div class="proforma-note">
      <p>
        <strong>Note:</strong> This is a Proforma Invoice for customs and reference purposes only. 
        This is not a demand for payment.
      </p>
    </div>
    ` : ''}
  </div>
</body>
</html>`;
}

// Utility function
function getFilename(documentType: string): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  const typeMap: Record<string, string> = {
    'commercial-invoice': 'Commercial_Invoice',
    'proforma-invoice': 'Proforma_Invoice',
    'packing-list': 'Packing_List',
    'certificate-of-origin': 'Certificate_of_Origin'
  };
  return `${typeMap[documentType] || 'Document'}_${timestamp}.pdf`;
}