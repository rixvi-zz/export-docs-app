import { DocumentType } from '@/lib/schemas';
import { DocumentTypeKey } from '@/lib/store';

/**
 * CLIENT-SIDE PDF Generator
 * Calls server API - NO Puppeteer imports here
 */
export async function generatePDF(
  docData: DocumentType, // Fixed: renamed from 'document' to 'docData'
  documentType: DocumentTypeKey
): Promise<void> {
  try {
    console.log('🔄 Starting PDF generation request...');
    
    // 🧪 DEBUG: Log what we're sending to the API
    console.log('📤 Sending docData:', JSON.stringify(docData, null, 2));
    console.log('📤 Document Type:', documentType);
    console.log('📤 Goods data:', docData?.goods);
    console.log('📤 Goods length:', docData?.goods?.length);

    // Validate inputs
    if (!docData || !documentType) {
      throw new Error('Missing document data or document type');
    }

    // Call server API
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docData: docData,
        documentType
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`PDF generation failed: ${errorData.error || response.statusText}`);
    }

    // Get PDF blob
    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error('Generated PDF is empty');
    }

    // Download PDF - Fixed: use window.document explicitly
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = getFilename(documentType);

    // Trigger download
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('✅ PDF downloaded successfully');

  } catch (error) {
    console.error('❌ PDF Generation Error:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'PDF generation failed. Please try again.';

    alert(`PDF Generation Failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Generate filename for PDF
 */
function getFilename(documentType: DocumentTypeKey): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  const typeMap: Record<DocumentTypeKey, string> = {
    'commercial-invoice': 'Commercial_Invoice',
    'proforma-invoice': 'Proforma_Invoice',
    'packing-list': 'Packing_List',
    'certificate-of-origin': 'Certificate_of_Origin'
  };
  return `${typeMap[documentType]}_${timestamp}.pdf`;
}