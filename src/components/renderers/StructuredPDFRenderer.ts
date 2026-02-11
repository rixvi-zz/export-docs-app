// 🎯 STRUCTURED PDF RENDERER (ENFORCES MASTER LAYOUT)
// Preview = PDF exactly (no condensing, no guessing)

import { jsPDF } from 'jspdf';
import { MasterLayoutBlock, MASTER_CONSTANTS } from '../layout/MasterLayoutModel';

/* ======================================================
   HELPERS (MUST EXIST BEFORE USE)
====================================================== */

function safeText(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return '—';
}

/* ======================================================
   PUBLIC API
====================================================== */

export function generateStructuredPDF(
  blocks: MasterLayoutBlock[]
): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [
      MASTER_CONSTANTS.PAGE.WIDTH,
      MASTER_CONSTANTS.PAGE.HEIGHT,
    ],
  });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.NORMAL);

  blocks.forEach(block => {
    renderStructuredBlock(pdf, block);
  });

  return pdf;
}

/* ======================================================
   BLOCK DISPATCHER
====================================================== */

function renderStructuredBlock(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  switch (block.type) {
    case 'header':
      renderStructuredHeader(pdf, block);
      break;
    case 'section':
      renderStructuredSection(pdf, block);
      break;
    case 'table':
      renderStructuredTable(pdf, block);
      break;
    case 'totals':
      renderStructuredTotals(pdf, block);
      break;
    case 'signature':
      renderStructuredSignature(pdf, block);
      break;
  }
}

/* ======================================================
   HEADER
====================================================== */

function renderStructuredHeader(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;

  let leftY = dimensions.y;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.LARGE);
  pdf.text(
    safeText(content.leftSide.companyName),
    dimensions.x,
    leftY
  );

  leftY += MASTER_CONSTANTS.FONTS.SIZES.LARGE + 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  const addressLines = pdf.splitTextToSize(
    safeText(content.leftSide.companyAddress),
    300
  );
  pdf.text(addressLines, dimensions.x, leftY);

  const rightX = dimensions.x + dimensions.width - 220;
  let rightY = dimensions.y;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.TITLE);

  const title = safeText(content.rightSide.documentTitle);
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(
    title,
    rightX + (220 - titleWidth) / 2,
    rightY
  );

  rightY += MASTER_CONSTANTS.FONTS.SIZES.TITLE + 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  const rightEdge = dimensions.x + dimensions.width;

  const dateText = `Date: ${safeText(content.rightSide.date)}`;
  const invoiceText = `Invoice No: ${safeText(
    content.rightSide.invoiceNumber
  )}`;

  pdf.text(
    dateText,
    rightEdge - pdf.getTextWidth(dateText),
    rightY
  );

  rightY += MASTER_CONSTANTS.SPACING.LINE_GAP;

  pdf.text(
    invoiceText,
    rightEdge - pdf.getTextWidth(invoiceText),
    rightY
  );
}

/* ======================================================
   SECTIONS
====================================================== */

function renderStructuredSection(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  if (block.content.layout === 'two-column') {
    renderTwoColumnSection(pdf, block);
  } else {
    renderSingleColumnSection(pdf, block);
  }
}

function renderTwoColumnSection(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;

  const leftX = dimensions.x;
  const rightX = dimensions.x + content.columnWidth + 24;
  let y = dimensions.y;

  pdf.setFillColor(243, 244, 246);
  pdf.rect(
    leftX,
    y - 6,
    content.columnWidth,
    MASTER_CONSTANTS.SPACING.HEADER_HEIGHT,
    'F'
  );
  pdf.rect(
    rightX,
    y - 6,
    content.columnWidth,
    MASTER_CONSTANTS.SPACING.HEADER_HEIGHT,
    'F'
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  pdf.text(
    safeText(content.left.title),
    leftX + 8,
    y + 6
  );
  pdf.text(
    safeText(content.right.title),
    rightX + 8,
    y + 6
  );

  y += MASTER_CONSTANTS.SPACING.HEADER_HEIGHT + 6;

  renderPartyDetails(
    pdf,
    content.left,
    leftX,
    y,
    content.columnWidth
  );
  renderPartyDetails(
    pdf,
    content.right,
    rightX,
    y,
    content.columnWidth
  );
}

function renderSingleColumnSection(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;

  let y = dimensions.y;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);
  pdf.text(safeText(content.title), dimensions.x, y);

  y += MASTER_CONSTANTS.SPACING.LINE_GAP;

  pdf.setFont('helvetica', 'normal');

  const lines = pdf.splitTextToSize(
    safeText(content.text),
    dimensions.width
  );
  pdf.text(lines, dimensions.x, y);
}

/* ======================================================
   PARTY DETAILS
====================================================== */

function renderPartyDetails(
  pdf: jsPDF,
  party: { name?: string; address?: string; country?: string; contact?: string },
  x: number,
  y: number,
  width: number
): void {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  const lines = pdf.splitTextToSize(
    [
      safeText(party?.name),
      safeText(party?.address),
      safeText(party?.country),
      safeText(party?.contact),
    ].join('\n'),
    width - 16
  );

  pdf.text(lines, x + 8, y);
}

/* ======================================================
   TABLE
====================================================== */

function renderStructuredTable(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;
  let y = dimensions.y;

  // Safety check for table content
  if (!content?.headers || !content?.columns || !content?.rows) {
    return;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(MASTER_CONSTANTS.FONTS.SIZES.SMALL);

  content.headers.forEach((header: string, i: number) => {
    if (content.columns[i]) {
      pdf.text(
        safeText(header),
        dimensions.x + content.columns[i].x,
        y
      );
    }
  });

  y += MASTER_CONSTANTS.SPACING.LINE_GAP;

  pdf.setFont('helvetica', 'normal');

  content.rows.forEach((row: any[]) => {
    if (Array.isArray(row)) {
      row.forEach((cell, i) => {
        if (content.columns[i]) {
          pdf.text(
            safeText(cell),
            dimensions.x + content.columns[i].x,
            y
          );
        }
      });
      y += MASTER_CONSTANTS.SPACING.LINE_GAP;
    }
  });
}

/* ======================================================
   TOTALS
====================================================== */

function renderStructuredTotals(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;

  pdf.setFont('helvetica', 'bold');
  pdf.text(
    `${safeText(content.label)}: ${safeText(content.value)}`,
    dimensions.x + dimensions.width - 200,
    dimensions.y
  );
}

/* ======================================================
   SIGNATURE
====================================================== */

function renderStructuredSignature(
  pdf: jsPDF,
  block: MasterLayoutBlock
): void {
  const { dimensions, content } = block;

  pdf.setFont('helvetica', 'normal');
  pdf.text(
    safeText(content.declaration),
    dimensions.x,
    dimensions.y
  );

  pdf.setFont('helvetica', 'bold');
  pdf.text(
    safeText(content.signatory),
    dimensions.x,
    dimensions.y + 40
  );
}
