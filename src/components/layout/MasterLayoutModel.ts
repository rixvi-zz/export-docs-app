// 🎯 SINGLE MASTER LAYOUT TEMPLATE (ABSOLUTE RULE)
// This is the CANONICAL layout definition that ALL formats must obey
// Preview is the SOURCE OF TRUTH - PDF and Word must conform exactly

export interface MasterLayoutBlock {
  id: string;
  type: 'header' | 'section' | 'table' | 'totals' | 'signature';
  
  // FIXED DIMENSIONS (NO AUTO-SIZING)
  dimensions: {
    width: number;      // Fixed width in pixels
    height: number;     // Fixed height in pixels
    x: number;          // Absolute X position
    y: number;          // Absolute Y position
  };
  
  // TYPOGRAPHY (LOCKED)
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: 'normal' | 'bold';
    color: string;
  };
  
  // SPACING (LOCKED)
  spacing: {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    marginBottom: number;
  };
  
  // CONTENT STRUCTURE
  content: any;
  
  // CHILD BLOCKS (for nested layouts)
  children?: MasterLayoutBlock[];
}

// MASTER LAYOUT CONSTANTS (SINGLE SOURCE OF TRUTH)
export const MASTER_CONSTANTS = {
  // A4 DIMENSIONS (LOCKED)
  PAGE: {
    WIDTH: 794,
    HEIGHT: 1123,
    MARGINS: {
      TOP: 56,
      RIGHT: 75, 
      BOTTOM: 56,
      LEFT: 56
    }
  },
  
  // TYPOGRAPHY (LOCKED - NO BROWSER/LIBRARY DEFAULTS)
  FONTS: {
    FAMILY: 'Arial, sans-serif',
    SIZES: {
      SMALL: 10,
      NORMAL: 12,
      LARGE: 16,
      TITLE: 24
    },
    LINE_HEIGHT: 14.4, // 12px * 1.2 (LOCKED)
    WEIGHTS: {
      NORMAL: 'normal' as const,
      BOLD: 'bold' as const
    }
  },
  
  // COLORS (LOCKED)
  COLORS: {
    TEXT: '#000000',
    TEXT_SECONDARY: '#6B7280',
    BORDER: '#9CA3AF',
    HEADER_BG: '#F3F4F6',
    TITLE_BLUE: '#1E40AF'
  },
    // SPACING (LOCKED - PREVENTS CONDENSING/EXPANSION)
  SPACING: {
    SECTION_GAP: 24,      // Between major sections
    LINE_GAP: 12,         // Between text lines
    PARAGRAPH_GAP: 16,    // Between paragraphs
    TABLE_ROW_HEIGHT: 20, // Fixed table row height
    HEADER_HEIGHT: 16     // Fixed section header height
  }
};

// 🎯 MASTER LAYOUT GENERATOR (PREVIEW IS SOURCE OF TRUTH)
export function generateMasterLayout(
  data?: any
): MasterLayoutBlock[] {
  console.log('generateMasterLayout called with data:', data);
  
  // DEFENSIVE: Handle missing or malformed data - but still generate layout
  const safeData = data || {};
  console.log('safeData:', safeData);
  
  const { document = {}, invoiceNumber, currentDate, isProforma = false } = safeData;
  const { 
    seller = {}, 
    buyer = {}, 
    consignee = null, 
    goods = [], 
    shipment = {}, 
    incoterms = {}, 
    paymentTerms, 
    paymentModes = [], 
    banking = {}, 
    terms = {}, 
    declaration = {}, 
    logo = null, 
    sameAsBuyer = true 
  } = document;
  
  // Safe fallbacks for critical data
  const safeSeller = {
    companyName: seller?.companyName || 'Sample Company',
    address: seller?.address || '123 Business St',
    city: seller?.city || 'Business City',
    country: seller?.country || 'Business Country',
    phone: seller?.phone || '+1-555-0123',
    email: seller?.email || 'info@company.com'
  };
  
  const safeBuyer = {
    companyName: buyer?.companyName || 'Sample Buyer',
    address: buyer?.address || '456 Customer Ave',
    city: buyer?.city || 'Customer City',
    country: buyer?.country || 'Customer Country',
    phone: buyer?.phone || '+1-555-0456',
    email: buyer?.email || 'buyer@company.com'
  };
  
  const safeGoods = Array.isArray(goods) && goods.length > 0 ? goods : [{
    description: 'Sample Product',
    hsCode: '1234.56',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 100.00,
    totalPrice: 100.00
  }];
  let currentY = MASTER_CONSTANTS.PAGE.MARGINS.TOP;
  const contentWidth = MASTER_CONSTANTS.PAGE.WIDTH - MASTER_CONSTANTS.PAGE.MARGINS.LEFT - MASTER_CONSTANTS.PAGE.MARGINS.RIGHT;
  
  console.log('Layout setup:', { currentY, contentWidth });
  
  const blocks: MasterLayoutBlock[] = [];
  
  // 1. HEADER BLOCK (FIXED LAYOUT)
  console.log('Creating header block...');
  blocks.push({
    id: 'header',
    type: 'header',
    dimensions: {
      width: contentWidth,
      height: 80, // FIXED HEIGHT
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.LARGE,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.BOLD,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },    content: {
      leftSide: {
        logo: null,
        companyName: safeSeller?.companyName || 'Sample Company',
        companyAddress: `${safeSeller?.address || '123 Business St'}, ${safeSeller?.city || 'Business City'}, ${safeSeller?.country || 'Business Country'}`
      },
      rightSide: {
        documentTitle: 'COMMERCIAL INVOICE',
        date: new Date().toLocaleDateString(),
        invoiceNumber: 'INV-0001'
      }
    }
  });
  
  currentY += 80 + MASTER_CONSTANTS.SPACING.SECTION_GAP;
    // 2. PARTIES SECTION (FIXED LAYOUT)
  const partiesHeight = calculatePartiesHeight(safeSeller, safeBuyer, consignee, sameAsBuyer);
  blocks.push({
    id: 'parties',
    type: 'section',
    dimensions: {
      width: contentWidth,
      height: partiesHeight,
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.SMALL,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.NORMAL,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },    content: {
      layout: 'two-column',
      columnWidth: (contentWidth - 24) / 2, // FIXED COLUMN WIDTH
      left: {
        title: 'SELLER / EXPORTER',
        name: safeSeller?.companyName || 'Company Name',
        address: safeSeller?.address || 'Address',
        country: safeSeller?.country || 'Country',
        contact: safeSeller?.phone ? `Tel: ${safeSeller.phone}` : safeSeller?.email ? `Email: ${safeSeller.email}` : 'Contact Info'
      },
      right: {
        title: 'BUYER',
        name: safeBuyer?.companyName || 'Buyer Name',
        address: safeBuyer?.address || 'Buyer Address', 
        country: safeBuyer?.country || 'Buyer Country',
        contact: safeBuyer?.phone ? `Tel: ${safeBuyer.phone}` : safeBuyer?.email ? `Email: ${safeBuyer.email}` : 'Buyer Contact'
      }
    }
  });
  
  currentY += partiesHeight + MASTER_CONSTANTS.SPACING.SECTION_GAP;
  
  // 3. SHIPMENT/TRADE SECTION (FIXED LAYOUT)
  blocks.push({
    id: 'shipment-trade',
    type: 'section',
    dimensions: {
      width: contentWidth,
      height: 120, // FIXED HEIGHT
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.SMALL,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.NORMAL,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },    content: {
      layout: 'two-column',
      columnWidth: (contentWidth - 24) / 2,
      left: {
        title: 'SHIPMENT DETAILS',
        text: `Port of Loading: ${shipment?.portOfLoading || '—'}\nPort of Discharge: ${shipment?.portOfDischarge || '—'}\nCountry of Origin: ${shipment?.countryOfOrigin || '—'}\nCountry of Destination: ${shipment?.countryOfDestination || '—'}${shipment?.vesselName ? `\nVessel: ${shipment.vesselName}` : ''}${shipment?.voyageNumber ? `\nVoyage: ${shipment.voyageNumber}` : ''}`
      },
      right: {
        title: 'TRADE TERMS',
        text: `Incoterms: ${incoterms?.term || '—'} ${incoterms?.place || ''}\nICC Version: ${incoterms?.iccVersion || '—'}\nPayment Terms: ${paymentTerms || '—'}\nPayment Modes: ${formatPaymentModes ? formatPaymentModes(paymentModes) : (paymentModes || '—')}`
      }
    }
  });
  
  currentY += 120 + MASTER_CONSTANTS.SPACING.SECTION_GAP;
  // 4. GOODS TABLE (FIXED LAYOUT)
  const tableHeight = calculateTableHeight(safeGoods);
  blocks.push({
    id: 'goods-table',
    type: 'table',
    dimensions: {
      width: contentWidth,
      height: tableHeight,
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.SMALL - 1,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.NORMAL,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },
    content: {
      headers: ['Description of Goods', 'HS Code', 'Qty', 'Unit', 'Unit Price', 'Total Price'],
      columns: [
        { x: 0, width: 300 },
        { x: 300, width: 80 },
        { x: 380, width: 60 },
        { x: 440, width: 60 },
        { x: 500, width: 100 },
        { x: 600, width: 100 }
      ],
      rows: safeGoods.map((item: any) => [
        {
          main: item?.description || 'Product Description',
          sub: [
            item?.qualitySpecs ? `Quality: ${item.qualitySpecs}` : null,
            item?.packagingSpecs ? `Packaging: ${item.packagingSpecs}` : null
          ].filter(Boolean)
        },
        item?.hsCode || '—',
        item?.quantity?.toString() || '—',
        item?.unit || '—',
        formatCurrency(item?.unitPrice || 0),
        formatCurrency(item?.totalPrice || 0)
      ])
    }
  });
  
  currentY += tableHeight + MASTER_CONSTANTS.SPACING.SECTION_GAP;
    // 5. TOTALS SECTION (FIXED LAYOUT)
  const subtotal = safeGoods.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);
  const total = subtotal;
  
  blocks.push({
    id: 'totals',
    type: 'totals',
    dimensions: {
      width: 256, // FIXED WIDTH
      height: 80, // FIXED HEIGHT
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT + contentWidth - 256,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.NORMAL,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.NORMAL,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },    content: {
      label: 'Total',
      value: formatCurrency(total),
      subtotal: formatCurrency(subtotal),
      total: formatCurrency(total),
      amountInWords: numberToWords(total)
    }
  });
  currentY += 80 + MASTER_CONSTANTS.SPACING.SECTION_GAP;
  
  // 6. SIGNATURE SECTION (FIXED LAYOUT)
  blocks.push({
    id: 'signature',
    type: 'signature',
    dimensions: {
      width: contentWidth,
      height: 120, // FIXED HEIGHT
      x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
      y: currentY
    },
    typography: {
      fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
      fontSize: MASTER_CONSTANTS.FONTS.SIZES.SMALL,
      lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
      fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.NORMAL,
      color: MASTER_CONSTANTS.COLORS.TEXT
    },
    spacing: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
    },
    content: {
      declaration: declaration?.text || 'I hereby declare that the information contained in this document is true and accurate.',
      signatory: declaration?.signatory || 'Authorized Signature'
    }
  });
    // GUARANTEE ARRAY RETURN (DEFENSIVE)
  console.log('Generated blocks:', blocks.length, blocks.map(b => b.id));
  return Array.isArray(blocks) ? blocks : [];
}

// HELPER FUNCTIONS FOR FIXED CALCULATIONS
function calculatePartiesHeight(seller: any, buyer: any, consignee: any, sameAsBuyer: boolean): number {
  const headerHeight = MASTER_CONSTANTS.SPACING.HEADER_HEIGHT;
  const lineHeight = MASTER_CONSTANTS.SPACING.LINE_GAP;
  
  // Calculate seller lines
  const sellerLines = [
    seller?.companyName,
    seller?.address,
    `${seller?.city}, ${seller?.country} ${seller?.postalCode}`,
    seller?.phone ? `Tel: ${seller.phone}` : null,
    seller?.email ? `Email: ${seller.email}` : null,
    seller?.taxId ? `Tax ID: ${seller.taxId}` : null,
    seller?.exportLicense ? `Export License: ${seller.exportLicense}` : null
  ].filter(Boolean).length;
  
  // Calculate buyer lines
  const buyerLines = [
    buyer?.companyName,
    buyer?.contactPerson ? `Attn: ${buyer.contactPerson}` : null,
    buyer?.address,
    `${buyer?.city}, ${buyer?.country} ${buyer?.postalCode}`,
    buyer?.phone ? `Tel: ${buyer.phone}` : null,
    buyer?.email ? `Email: ${buyer.email}` : null
  ].filter(Boolean).length;
  
  const maxLines = Math.max(sellerLines, buyerLines);
  let height = headerHeight + (maxLines * lineHeight);
  
  // Add consignee height if different from buyer
  if (!sameAsBuyer && consignee) {
    const consigneeLines = [
      consignee?.companyName,
      consignee?.contactPerson ? `Attn: ${consignee.contactPerson}` : null,
      consignee?.address,
      `${consignee?.city}, ${consignee?.country} ${consignee?.postalCode}`,
      consignee?.phone ? `Tel: ${consignee.phone}` : null,
      consignee?.email ? `Email: ${consignee.email}` : null
    ].filter(Boolean).length;
    
    height += MASTER_CONSTANTS.SPACING.PARAGRAPH_GAP + headerHeight + (consigneeLines * lineHeight);
  }
  
  return height;
}

function calculateTableHeight(goods: any[]): number {
  const headerHeight = MASTER_CONSTANTS.SPACING.TABLE_ROW_HEIGHT;
  const rowHeight = MASTER_CONSTANTS.SPACING.TABLE_ROW_HEIGHT;
  return headerHeight + (goods.length * rowHeight);
}

// Import required formatters
// Simple fallback functions in case imports fail
function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function numberToWords(value: number): string {
  // Simple fallback - just return the number with "dollars"
  return `${formatCurrency(value)} (${value.toFixed(2)} USD)`;
}

function formatPaymentModes(modes: any): string {
  if (Array.isArray(modes)) {
    return modes.join(', ');
  }
  return modes?.toString() || '—';
}

// EMERGENCY TEST - Call this directly to test layout generation
export function debugLayoutGeneration() {
  console.log('🔥 DEBUGGING: Starting layout generation test...');
  
  // Test 1: Empty data
  const emptyBlocks = generateMasterLayout({});
  console.log('🔥 Empty data test:', emptyBlocks.length, 'blocks');
  
  // Test 2: Minimal data
  const minimalData = {
    document: {
      seller: { companyName: 'Debug Company' },
      buyer: { companyName: 'Debug Buyer' },
      goods: [{ description: 'Debug Product', unitPrice: 50, totalPrice: 50 }]
    }
  };
  const minimalBlocks = generateMasterLayout(minimalData);
  console.log('🔥 Minimal data test:', minimalBlocks.length, 'blocks');
  
  // Test 3: Simple test layout
  const simpleBlocks = generateSimpleTestLayout();
  console.log('🔥 Simple test layout:', simpleBlocks.length, 'blocks');
  
  console.log('🔥 DEBUG COMPLETE - Check blocks above');
  return emptyBlocks;
}

// TEST FUNCTION - Generate layout with empty data to verify it works
export function testMasterLayout(): MasterLayoutBlock[] {
  console.log('Testing master layout generation...');
  const blocks = generateMasterLayout({});
  console.log('Test result - blocks generated:', blocks.length);
  return blocks;
}

// SIMPLE TEST VERSION - Always returns valid blocks
export function generateSimpleTestLayout(): MasterLayoutBlock[] {
  const contentWidth = MASTER_CONSTANTS.PAGE.WIDTH - MASTER_CONSTANTS.PAGE.MARGINS.LEFT - MASTER_CONSTANTS.PAGE.MARGINS.RIGHT;
  let currentY = MASTER_CONSTANTS.PAGE.MARGINS.TOP;

  return [
    {
      id: 'header',
      type: 'header' as const,
      dimensions: {
        width: contentWidth,
        height: 80,
        x: MASTER_CONSTANTS.PAGE.MARGINS.LEFT,
        y: currentY
      },
      typography: {
        fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
        fontSize: MASTER_CONSTANTS.FONTS.SIZES.LARGE,
        lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
        fontWeight: MASTER_CONSTANTS.FONTS.WEIGHTS.BOLD,
        color: MASTER_CONSTANTS.COLORS.TEXT
      },
      spacing: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        marginBottom: MASTER_CONSTANTS.SPACING.SECTION_GAP
      },
      content: {
        leftSide: {
          companyName: 'Test Company',
          companyAddress: '123 Test St, Test City, Test Country'
        },
        rightSide: {
          documentTitle: 'TEST INVOICE',
          date: '12/25/2024',
          invoiceNumber: 'TEST-001'
        }
      }
    }
  ];
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugLayoutGeneration = debugLayoutGeneration;
  (window as any).testMasterLayout = testMasterLayout;
  (window as any).generateSimpleTestLayout = generateSimpleTestLayout;
}