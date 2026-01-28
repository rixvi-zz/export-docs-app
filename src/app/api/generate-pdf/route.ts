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

// Simplified HTML Generator
function generateHTML(docData: any, documentType: string): string {
  const titleMap: Record<string, string> = {
    'commercial-invoice': 'COMMERCIAL INVOICE',
    'proforma-invoice': 'PROFORMA INVOICE',
    'packing-list': 'PACKING LIST',
    'certificate-of-origin': 'CERTIFICATE OF ORIGIN'
  };

  const title = titleMap[documentType] || 'DOCUMENT';
  const currency = docData?.currency || 'USD';
  const total = docData?.goods?.reduce(
    (sum: number, g: any) => sum + (g.totalPrice || 0),
    0
  ) || 0;

  const goodsRows = docData?.goods?.length > 0
    ? docData.goods.map((item: any) => {
      return `
        <tr>
          <td class="pdf-cell">
            <div class="item-description">${item.description || '—'}</div>
            ${item.qualitySpecs ? `<div class="item-detail">Quality: ${item.qualitySpecs}</div>` : ''}
            ${item.packagingSpecs ? `<div class="item-detail">Packaging: ${item.packagingSpecs}</div>` : ''}
          </td>
          <td class="pdf-cell">${item.category === 'other' && item.customCategory ? item.customCategory : (item.category?.replace('-', ' ').toUpperCase() || '—')}</td>
          <td class="pdf-cell">${item.hsCode || '—'}</td>
          <td class="pdf-cell text-right">${item.quantity || 0}</td>
          <td class="pdf-cell">${item.unit || '—'}</td>
          <td class="pdf-cell text-right">${item.currency || currency} ${(item.unitPrice || 0).toFixed(2)}</td>
          <td class="pdf-cell text-right">${item.currency || currency} ${(item.totalPrice || 0).toFixed(2)}</td>
        </tr>
      `;
    }).join('')
    : '<tr><td colspan="7" class="pdf-cell text-center no-goods">No goods added yet</td></tr>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      color: #000;
      background: white;
    }
    .pdf-container { 
      max-width: 794px; 
      margin: 0 auto; 
    }
    .pdf-header { 
      text-align: center; 
      margin-bottom: 30px; 
      padding: 20px;
      border-bottom: 2px solid #333;
    }
    .pdf-title { 
      font-size: 24px; 
      font-weight: bold; 
      margin: 0;
    }
    .company-info {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0; 
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left; 
    }
    th { 
      background-color: #f5f5f5; 
      font-weight: bold;
    }
    .text-right { 
      text-align: right; 
    }
    .text-center {
      text-align: center;
    }
    .pdf-cell {
      padding: 10px;
    }
    .item-description {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .item-detail {
      font-size: 11px;
      color: #666;
      margin-bottom: 2px;
    }
    .no-goods {
      padding: 40px;
      color: #999;
      font-style: italic;
    }
    .total-section {
      text-align: right;
      margin-top: 20px;
      padding: 15px;
      background: #f9f9f9;
      border: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="pdf-container">
    <div class="pdf-header">
      <h1 class="pdf-title">${title}</h1>
    </div>
    
    ${docData?.seller ? `
    <div class="company-info">
      <h3>Seller/Exporter:</h3>
      <div><strong>${docData.seller.companyName || '— Not Provided —'}</strong></div>
      <div>${docData.seller.address || '— Not Provided —'}</div>
      <div>${docData.seller.city || '— Not Provided —'}, ${docData.seller.country || '— Not Provided —'}</div>
      ${docData.seller.phone ? `<div>Phone: ${docData.seller.phone}</div>` : ''}
      ${docData.seller.email ? `<div>Email: ${docData.seller.email}</div>` : ''}
    </div>
    ` : ''}
    
    ${docData?.buyer ? `
    <div class="company-info">
      <h3>Buyer/Importer:</h3>
      <div><strong>${docData.buyer.companyName || '— Not Provided —'}</strong></div>
      <div>${docData.buyer.address || '— Not Provided —'}</div>
      <div>${docData.buyer.city || '— Not Provided —'}, ${docData.buyer.country || '— Not Provided —'}</div>
      ${docData.buyer.phone ? `<div>Phone: ${docData.buyer.phone}</div>` : ''}
      ${docData.buyer.email ? `<div>Email: ${docData.buyer.email}</div>` : ''}
    </div>
    ` : ''}
    
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th>HS Code</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${goodsRows}
      </tbody>
    </table>
    
    <div class="total-section">
      <strong>Total: ${currency} ${total.toFixed(2)}</strong>
    </div>
    
    ${documentType === 'proforma-invoice' ? `
      <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 5px;">
        <p style="margin: 0; text-align: center; font-weight: bold;">
          <strong>IMPORTANT:</strong> This is a Proforma Invoice for customs and reference purposes only. 
          This is not a demand for payment.
        </p>
      </div>
    ` : ''}
    
    ${documentType === 'certificate-of-origin' ? `
      <div style="margin-top: 30px; padding: 20px; border: 2px solid #6f42c1; background: #f8f5ff;">
        <h3 style="color: #6f42c1; margin-bottom: 15px;">CERTIFICATE OF ORIGIN</h3>
        <p style="font-size: 14px; margin-bottom: 20px;">
          I hereby certify that the goods described above originated in <strong>${docData?.shipment?.countryOfOrigin || '[Country]'}</strong>
          and comply with the origin requirements specified for these goods.
        </p>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <div style="border-top: 1px solid #6f42c1; width: 200px; padding-top: 10px; font-size: 12px;">
              Authorized Signature
            </div>
          </div>
          <div style="text-align: right;">
            <div style="border-top: 1px solid #6f42c1; width: 150px; padding-top: 10px; font-size: 12px;">
              Date & Seal
            </div>
          </div>
        </div>
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

// Simple number to words conversion
function convertToWords(amount: number, currency: string): string {
  // Simplified implementation - you can enhance this
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero';
  if (amount < 10) return ones[amount];
  if (amount < 20) return teens[amount - 10];
  if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 ? ' ' + ones[amount % 10] : '');
  if (amount < 1000) return ones[Math.floor(amount / 100)] + ' Hundred' + (amount % 100 ? ' ' + convertToWords(amount % 100, currency) : '');

  return Math.floor(amount).toString(); // Fallback for larger numbers
}