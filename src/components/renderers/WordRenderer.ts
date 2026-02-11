import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle } from 'docx';
import { MasterLayoutBlock, MASTER_CONSTANTS } from '../layout/MasterLayoutModel';

export function generateWordFromLayout(blocks: MasterLayoutBlock[]): Document {
  const children: any[] = [];

  blocks.forEach(block => {
    switch (block.type) {
      case 'header':
        children.push(...renderWordHeader(block));
        break;
      case 'section':
        children.push(...renderWordSection(block));
        break;
      case 'table':
        children.push(...renderWordTable(block));
        break;
      case 'totals':
        children.push(...renderWordTotals(block));
        break;
      case 'signature':
        children.push(...renderWordSignature(block));
        break;
    }
  });

  return new Document({
    sections: [{
      properties: {
        page: {
          size: {
            width: MASTER_CONSTANTS.PAGE.WIDTH * 12, // Convert to twips (1/20th of a point)
            height: MASTER_CONSTANTS.PAGE.HEIGHT * 12
          },
          margin: {
            top: MASTER_CONSTANTS.PAGE.MARGINS.TOP * 12,
            right: MASTER_CONSTANTS.PAGE.MARGINS.RIGHT * 12,
            bottom: MASTER_CONSTANTS.PAGE.MARGINS.BOTTOM * 12,
            left: MASTER_CONSTANTS.PAGE.MARGINS.LEFT * 12
          }
        }
      },
      children
    }]
  });
}

function renderWordHeader(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  return [
    // MATCH PREVIEW EXACTLY: Create a table for left/right layout
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0 },
        bottom: { style: BorderStyle.NONE, size: 0 },
        left: { style: BorderStyle.NONE, size: 0 },
        right: { style: BorderStyle.NONE, size: 0 },
        insideHorizontal: { style: BorderStyle.NONE, size: 0 },
        insideVertical: { style: BorderStyle.NONE, size: 0 }
      },
      rows: [
        new TableRow({
          children: [
            // LEFT SIDE: Logo + Company Info
            new TableCell({
              children: [
                // Company Name (bold, large)
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.leftSide?.companyName || '—',
                      bold: true,
                      size: MASTER_CONSTANTS.FONTS.SIZES.LARGE * 2
                    })
                  ]
                }),
                // Company Address (smaller, normal)
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.leftSide?.companyAddress || '—',
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2,
                      color: '6B7280' // Gray
                    })
                  ]
                })
              ],
              width: { size: 60, type: WidthType.PERCENTAGE },
              verticalAlign: 'top'
            }),
            // RIGHT SIDE: Document Title + Details
            new TableCell({
              children: [
                // Document Title (large, blue, right-aligned)
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.rightSide?.documentTitle || '—',
                      bold: true,
                      size: MASTER_CONSTANTS.FONTS.SIZES.TITLE * 2,
                      color: '1E40AF' // Blue
                    })
                  ],
                  alignment: AlignmentType.RIGHT
                }),
                // Date
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Date: ${content?.rightSide?.date || '—'}`,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ],
                  alignment: AlignmentType.RIGHT
                }),
                // Invoice Number
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Invoice No: ${content?.rightSide?.invoiceNumber || '—'}`,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ],
                  alignment: AlignmentType.RIGHT
                })
              ],
              width: { size: 40, type: WidthType.PERCENTAGE },
              verticalAlign: 'top'
            })
          ]
        })
      ]
    }),
    
    new Paragraph({ text: '' }) // Spacing after header
  ];
}

function renderWordSection(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  if (content.layout === 'two-column') {
    return renderWordTwoColumnSection(block);
  } else {
    return renderWordSingleColumnSection(block);
  }
}

function renderWordTwoColumnSection(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  const rows = [
    new TableRow({
      children: [
        // LEFT COLUMN
        new TableCell({
          children: [
            // Left Header (gray background)
            new Paragraph({
              children: [
                new TextRun({
                  text: content?.left?.title || '—',
                  bold: true,
                  size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                })
              ],
              shading: { fill: 'F3F4F6' } // Gray background
            }),
            // Left Content
            ...renderWordPartyDetails(content?.left)
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          verticalAlign: 'top'
        }),
        // RIGHT COLUMN
        new TableCell({
          children: [
            // Right Header (gray background)
            new Paragraph({
              children: [
                new TextRun({
                  text: content?.right?.title || '—',
                  bold: true,
                  size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                })
              ],
              shading: { fill: 'F3F4F6' } // Gray background
            }),
            // Right Content
            ...renderWordPartyDetails(content?.right)
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          verticalAlign: 'top'
        })
      ]
    })
  ];
  
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' }
      }
    }),
    new Paragraph({ text: '' }) // Spacing
  ];
}

function renderWordSingleColumnSection(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                // Header (gray background)
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.title || '—',
                      bold: true,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ],
                  shading: { fill: 'F3F4F6' }
                }),
                // Content text
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.text || '—',
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        })
      ],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' }
      }
    }),
    new Paragraph({ text: '' }) // Spacing
  ];
}

function renderWordPartyDetails(party: any): any[] {
  const paragraphs: any[] = [];
  
  if (party?.name) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: party.name,
          bold: true,
          size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
        })
      ]
    }));
  }
  
  if (party?.address) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: party.address,
          size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
        })
      ]
    }));
  }
  
  if (party?.country) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: party.country,
          size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
        })
      ]
    }));
  }
  
  if (party?.contact) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: party.contact,
          size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
        })
      ]
    }));
  }
  
  return paragraphs;
}

function renderWordTable(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  if (!content?.headers || !content?.rows) {
    return [];
  }
  
  // Header row
  const headerRow = new TableRow({
    children: content.headers.map((header: string) => 
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: header, bold: true, size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2 })]
        })],
        shading: { fill: 'F3F4F6' }
      })
    )
  });
  
  // Data rows
  const dataRows = content.rows.map((row: any[]) => 
    new TableRow({
      children: row.map((cell: any) => 
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({
              text: cell?.toString() || '—',
              size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
            })]
          })]
        })
      )
    })
  );
  
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' }
      }
    }),
    new Paragraph({ text: '' }) // Spacing
  ];
}

function renderWordTotals(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: `${content?.label || 'Total'}: ${content?.value || '—'}`,
          bold: true,
          size: MASTER_CONSTANTS.FONTS.SIZES.NORMAL * 2
        })
      ],
      alignment: AlignmentType.RIGHT
    }),
    new Paragraph({ text: '' }) // Spacing
  ];
}

function renderWordSignature(block: MasterLayoutBlock): any[] {
  const { content } = block;
  
  return [
    new Paragraph({ text: '' }), // Extra spacing before signature
    
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                // Declaration Header (gray background)
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'DECLARATION & SIGNATURE',
                      bold: true,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ],
                  shading: { fill: 'F3F4F6' } // Gray background
                }),
                // Declaration text
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content?.declaration || '—',
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        })
      ],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' }
      }
    }),
    
    new Paragraph({ text: '' }), // Spacing
    new Paragraph({ text: '' }), // Spacing
    
    // Signature section - table for left/right layout
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0 },
        bottom: { style: BorderStyle.NONE, size: 0 },
        left: { style: BorderStyle.NONE, size: 0 },
        right: { style: BorderStyle.NONE, size: 0 },
        insideHorizontal: { style: BorderStyle.NONE, size: 0 },
        insideVertical: { style: BorderStyle.NONE, size: 0 }
      },
      rows: [
        new TableRow({
          children: [
            // Left side - Signature line
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '_________________________',
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Signature',
                      bold: true,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ]
                })
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: 'top'
            }),
            // Right side - Signature details
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Signatory: ${content?.signatory || '—'}`,
                      size: MASTER_CONSTANTS.FONTS.SIZES.SMALL * 2
                    })
                  ],
                  alignment: AlignmentType.RIGHT
                })
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: 'top'
            })
          ]
        })
      ]
    })
  ];
}