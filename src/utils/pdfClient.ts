import { DocumentType } from '@/lib/schemas';
import { DocumentTypeKey } from '@/lib/store';

// CLIENT-SIDE ONLY
export async function generatePDF(
  docData: DocumentType,
  documentType: DocumentTypeKey
): Promise<void> {
  try {
    const filename = getFilename(documentType);

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ FIXED
      },
      body: JSON.stringify({ docData, documentType }), // ✅ MATCHES SERVER
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;

    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF generation failed. Please try again.');
  }
}

function getFilename(documentType: DocumentTypeKey): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  const typeMap: Record<DocumentTypeKey, string> = {
    'commercial-invoice': 'Commercial_Invoice',
    'proforma-invoice': 'Proforma_Invoice',
    'packing-list': 'Packing_List',
    'certificate-of-origin': 'Certificate_Of_Origin',
  };
  return `${typeMap[documentType]}_${timestamp}.pdf`;
}
