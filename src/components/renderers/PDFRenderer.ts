import { jsPDF } from 'jspdf';
import { MasterLayoutBlock, MASTER_CONSTANTS } from '../layout/MasterLayoutModel';

// 🛡️ MANDATORY SANITIZATION HELPERS (FAIL-SAFE)
function safeText(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return '—';
}

function safeNumber(value: any, fallback: number): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return fallback;
}

function safeSplitText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  const cleanText = safeText(text);
  if (cleanText === '—') {
    return ['—'];
  }

  try {
    return pdf.splitTextToSize(cleanText, maxWidth);
  } catch (error) {
    console.warn('Text splitting failed, using fallback:', error);
    return [cleanText.substring(0, 50) + (cleanText.length > 50 ? '...' : '')];
  }
}

function safeTextRender(pdf: jsPDF, text: any, x: number, y: number, maxWidth?: number): void {
  const cleanText = safeText(text);
  const safeX = safeNumber(x, MASTER_CONSTANTS.PAGE.MARGINS.LEFT);
  const safeY = safeNumber(y, MASTER_CONSTANTS.PAGE.MARGINS.TOP);

  try {
    if (maxWidth && maxWidth > 0) {
      const lines = safeSplitText(pdf, cleanText, maxWidth);
      lines.forEach((line, index) => {
        pdf.text(line, safeX, safeY + (index * MASTER_CONSTANTS.FONTS.LINE_HEIGHT));
      });
    } else {
      pdf.text(cleanText, safeX, safeY);
    }
  } catch (error) {
    console.warn('Text rendering failed, using fallback:', error);
    try {
      pdf.text('—', safeX, safeY);
    } catch (fallbackError) {
      console.error('Even fallback text rendering failed:', fallbackError);
    }
  }
}

export function generatePDFFromLayout(blocks: MasterLayoutBlock[]): jsPDF {
  try {
    // Create PDF with exact A4 dimensions from MASTER_CONSTANTS
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [MASTER_CONSTANTS.PAGE.WIDTH, MASTER_CONSTANTS.PAGE.HEIGHT]
    });

    // Set font to match master layout
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.NORMAL);

    // FAIL-SAFE: Ensure we have valid blocks
    const safeBlocks = Array.isArray(blocks) ? blocks : [];

    safeBlocks.forEach((block, index) => {
      try {
        renderPDFBlock(pdf, block);
      } catch (blockError) {
        console.error(`Error rendering block ${index} (${block?.type}):`, blockError);
        // Continue with next block instead of failing completely
      }
    });

    return pdf;
  } catch (error) {
    console.error('Critical PDF generation error:', error);

    // FALLBACK: Create minimal PDF with error message
    const fallbackPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [MASTER_CONSTANTS.PAGE.WIDTH, MASTER_CONSTANTS.PAGE.HEIGHT]
    });

    fallbackPdf.setFont('helvetica', 'normal');
    fallbackPdf.setFontSize(16);
    fallbackPdf.text('PDF Generation Error', MASTER_CONSTANTS.PAGE.MARGINS.LEFT, MASTER_CONSTANTS.PAGE.MARGINS.TOP);
    fallbackPdf.setFontSize(12);
    fallbackPdf.text('Please check your data and try again.', MASTER_CONSTANTS.PAGE.MARGINS.LEFT, MASTER_CONSTANTS.PAGE.MARGINS.TOP + 30);

    return fallbackPdf;
  }
}

function renderPDFBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  // Use EXACT dimensions and positioning from master layout
  const { dimensions, content, type } = block;
  
  // Set position exactly as defined in master layout
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.NORMAL);

  switch (type) {
    case 'header':
      renderPDFHeaderBlock(pdf, block);
      break;
    case 'section':
      renderPDFSectionBlock(pdf, block);
      break;
    case 'table':
      renderPDFTableBlock(pdf, block);
      break;
    case 'totals':
      renderPDFTotalsBlock(pdf, block);
      break;
    case 'signature':
      renderPDFSignatureBlock(pdf, block);
      break;
    default:
      console.warn(`Unknown block type: ${type}`);
  }
}

function renderPDFHeaderBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;
  
  try {
    // LEFT SIDE: Company info at exact position from master layout
    let leftY = dimensions.y;

    // Company Name (bold, larger)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.LARGE);
    pdf.setTextColor(0, 0, 0);
    safeTextRender(pdf, content.leftSide.companyName, dimensions.x, leftY);
    leftY += MASTER_CONSTANTS.FONTS.SIZES.LARGE + MASTER_CONSTANTS.SPACING.LINE_GAP;

    // Company Address (smaller, normal)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);
    const addressLines = safeSplitText(pdf, content.leftSide.companyAddress, 300);
    addressLines.forEach((line, index) => {
      safeTextRender(pdf, line, dimensions.x, leftY + (index * MASTER_CONSTANTS.FONTS.LINE_HEIGHT));
    });

    // RIGHT SIDE: Document title and details at exact position
    const rightX = dimensions.x + dimensions.width - 220;
    let rightY = dimensions.y;

    // Document Title (large, blue, centered)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.TITLE);
    pdf.setTextColor(30, 64, 175); // Blue
    const titleText = safeText(content.rightSide.documentTitle);
    const titleWidth = pdf.getTextWidth(titleText);
    safeTextRender(pdf, titleText, rightX + (220 - titleWidth) / 2, rightY);
    rightY += MASTER_CONSTANTS.FONTS.SIZES.TITLE + MASTER_CONSTANTS.SPACING.LINE_GAP;

    // Date and Invoice (right-aligned)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);
    pdf.setTextColor(0, 0, 0);

    const dateText = `Date: ${safeText(content.rightSide.date)}`;
    const invoiceText = `Invoice No: ${safeText(content.rightSide.invoiceNumber)}`;
    const rightEdge = dimensions.x + dimensions.width;

    const dateWidth = pdf.getTextWidth(dateText);
    const invoiceWidth = pdf.getTextWidth(invoiceText);

    safeTextRender(pdf, dateText, rightEdge - dateWidth, rightY);
    rightY += MASTER_CONSTANTS.FONTS.LINE_HEIGHT;
    safeTextRender(pdf, invoiceText, rightEdge - invoiceWidth, rightY);

  } catch (error) {
    console.error('Header block rendering failed:', error);
  }
}

function renderPDFSectionBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;
  
  if (content.layout === 'two-column') {
    renderPDFTwoColumnSection(pdf, block);
  } else {
    renderPDFSingleColumnSection(pdf, block);
  }
}

function renderPDFTwoColumnSection(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;

  const leftX = dimensions.x;
  const rightX = dimensions.x + content.columnWidth + 24;
  let y = dimensions.y;

  // Gray headers
  pdf.setFillColor(243, 244, 246);
  pdf.rect(leftX, y - 6, content.columnWidth, MASTER_CONSTANTS.SPACING.HEADER_HEIGHT, 'F');
  pdf.rect(rightX, y - 6, content.columnWidth, MASTER_CONSTANTS.SPACING.HEADER_HEIGHT, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  safeTextRender(pdf, content.left.title, leftX + 8, y + 6);
  safeTextRender(pdf, content.right.title, rightX + 8, y + 6);

  y += MASTER_CONSTANTS.SPACING.HEADER_HEIGHT + 6;

  // Render party details using fixed line heights
  renderPDFPartyDetails(pdf, content.left, leftX, y, content.columnWidth);
  renderPDFPartyDetails(pdf, content.right, rightX, y, content.columnWidth);
}

function renderPDFSingleColumnSection(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;

  let y = dimensions.y;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);
  safeTextRender(pdf, content.title, dimensions.x, y);

  y += MASTER_CONSTANTS.SPACING.LINE_GAP;

  pdf.setFont('helvetica', 'normal');
  const lines = safeSplitText(pdf, content.text, dimensions.width);
  lines.forEach((line, index) => {
    safeTextRender(pdf, line, dimensions.x, y + (index * MASTER_CONSTANTS.FONTS.LINE_HEIGHT));
  });
}

function renderPDFPartyDetails(
  pdf: jsPDF,
  party: { name?: string; address?: string; country?: string; contact?: string },
  x: number,
  y: number,
  width: number
): void {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  const lines = [
    safeText(party?.name),
    safeText(party?.address),
    safeText(party?.country),
    safeText(party?.contact),
  ].filter(line => line !== '—');

  lines.forEach((line, index) => {
    safeTextRender(pdf, line, x + 8, y + (index * MASTER_CONSTANTS.FONTS.LINE_HEIGHT));
  });
}

function renderPDFTableBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;
  let y = dimensions.y;

  // Safety check for table content
  if (!content?.headers || !content?.columns || !content?.rows) {
    return;
  }

  // Headers with fixed height
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  content.headers.forEach((header: string, i: number) => {
    if (content.columns[i]) {
      safeTextRender(pdf, header, dimensions.x + content.columns[i].x, y);
    }
  });

  y += MASTER_CONSTANTS.SPACING.TABLE_ROW_HEIGHT;

  // Data rows with fixed height
  pdf.setFont('helvetica', 'normal');

  content.rows.forEach((row: any[]) => {
    if (Array.isArray(row)) {
      row.forEach((cell, i) => {
        if (content.columns[i]) {
          safeTextRender(pdf, cell, dimensions.x + content.columns[i].x, y);
        }
      });
      y += MASTER_CONSTANTS.SPACING.TABLE_ROW_HEIGHT;
    }
  });
}

function renderPDFTotalsBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;

  pdf.setFont('helvetica', 'bold');
  safeTextRender(pdf, `${safeText(content.label)}: ${safeText(content.value)}`, dimensions.x + dimensions.width - 200, dimensions.y);
}

function renderPDFSignatureBlock(pdf: jsPDF, block: MasterLayoutBlock): void {
  const { dimensions, content } = block;

  pdf.setFont('helvetica', 'normal');
  safeTextRender(pdf, content.declaration, dimensions.x, dimensions.y);

  pdf.setFont('helvetica', 'bold');
  safeTextRender(pdf, content.signatory, dimensions.x, dimensions.y + 40);
}