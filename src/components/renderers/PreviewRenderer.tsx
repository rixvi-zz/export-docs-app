import React from 'react';
import { MasterLayoutBlock, MASTER_CONSTANTS } from '../layout/MasterLayoutModel';

interface PreviewRendererProps {
  blocks: MasterLayoutBlock[];
}

export function PreviewRenderer({ blocks }: PreviewRendererProps) {
  // DEFENSIVE DEFAULT - NEVER crash on undefined/invalid blocks
  const safeBlocks = blocks ?? [];

  if (!Array.isArray(safeBlocks)) {
    console.error('PreviewRenderer: blocks is not an array', safeBlocks);
    return null;
  }
  return (
    <div 
      className="bg-white shadow-lg"
      style={{
        position: 'relative', // CRITICAL: Enable absolute positioning of blocks
        width: `${MASTER_CONSTANTS.PAGE.WIDTH}px`,
        minHeight: `${MASTER_CONSTANTS.PAGE.HEIGHT}px`,
        padding: `${MASTER_CONSTANTS.PAGE.MARGINS.TOP}px ${MASTER_CONSTANTS.PAGE.MARGINS.RIGHT}px ${MASTER_CONSTANTS.PAGE.MARGINS.BOTTOM}px ${MASTER_CONSTANTS.PAGE.MARGINS.LEFT}px`,
        fontFamily: MASTER_CONSTANTS.FONTS.FAMILY,
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.NORMAL}px`,
        lineHeight: MASTER_CONSTANTS.FONTS.LINE_HEIGHT,
        color: MASTER_CONSTANTS.COLORS.TEXT,
        margin: '0 auto', // Center the preview
        boxSizing: 'border-box'
      }}
    >
      {safeBlocks.length === 0 ? (
        <div className="text-gray-500 text-sm" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.NORMAL}px`
        }}>
          Invoice preview will appear here
        </div>
      ) : (
        safeBlocks.map((block, index) => (
          <div key={block?.id ?? index}>
            {renderBlock(block)}
          </div>
        ))
      )}
    </div>
  );
}

function renderBlock(block: MasterLayoutBlock): React.ReactNode {
  const { type, dimensions, content } = block;

  const blockStyle = {
    position: 'absolute' as const,
    left: `${dimensions.x - MASTER_CONSTANTS.PAGE.MARGINS.LEFT}px`, // Adjust for container padding
    top: `${dimensions.y - MASTER_CONSTANTS.PAGE.MARGINS.TOP}px`,   // Adjust for container padding
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
  };

  switch (type) {
    case 'header':
      return <div style={blockStyle}>{renderHeader(block)}</div>;
    case 'section':
      return <div style={blockStyle}>{renderSection(block)}</div>;
    case 'table':
      return <div style={blockStyle}>{renderTable(block)}</div>;
    case 'totals':
      return <div style={blockStyle}>{renderTotals(block)}</div>;
    case 'signature':
      return <div style={blockStyle}>{renderSignature(block)}</div>;
    default:
      return null;
  }
}

function renderHeader(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      height: '100%'
    }}>
      {/* Left side - Logo and Company */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.LARGE}px`,
            fontWeight: 'bold',
            marginBottom: '4px',
            margin: 0
          }}>
            {content.leftSide?.companyName || '—'}
          </h1>
          <div style={{
            fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
            color: MASTER_CONSTANTS.COLORS.TEXT_SECONDARY
          }}>
            {content.leftSide?.companyAddress || '—'}
          </div>
        </div>
      </div>
      
      {/* Right side - Document Title and Details */}
      <div style={{ textAlign: 'right' }}>
        <h2 style={{
          fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.TITLE}px`,
          fontWeight: 'bold',
          color: MASTER_CONSTANTS.COLORS.TITLE_BLUE,
          marginBottom: '8px',
          margin: 0
        }}>
          {content.rightSide?.documentTitle || '—'}
        </h2>
        <div style={{ fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px` }}>
          <div><strong>Date:</strong> {content.rightSide?.date || '—'}</div>
          <div><strong>Invoice No:</strong> {content.rightSide?.invoiceNumber || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function renderSection(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  if (content.layout === 'two-column') {
    return renderTwoColumnSection(block);
  } else {
    return renderSingleColumnSection(block);
  }
}

function renderTwoColumnSection(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      width: '100%',
      height: '100%'
    }}>
      {/* Left Column */}
      <div>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
          marginBottom: '8px',
          backgroundColor: MASTER_CONSTANTS.COLORS.HEADER_BG,
          padding: '8px',
          margin: 0
        }}>
          {content.left?.title || '—'}
        </h3>
        <div style={{ fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px` }}>
          <div style={{ fontWeight: 'bold' }}>{content.left?.name || '—'}</div>
          <div>{content.left?.address || '—'}</div>
          <div>{content.left?.country || '—'}</div>
          <div>{content.left?.contact || '—'}</div>
        </div>
      </div>
      
      {/* Right Column */}
      <div>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
          marginBottom: '8px',
          backgroundColor: MASTER_CONSTANTS.COLORS.HEADER_BG,
          padding: '8px',
          margin: 0
        }}>
          {content.right?.title || '—'}
        </h3>
        <div style={{ fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px` }}>
          <div style={{ fontWeight: 'bold' }}>{content.right?.name || '—'}</div>
          <div>{content.right?.address || '—'}</div>
          <div>{content.right?.country || '—'}</div>
          <div>{content.right?.contact || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function renderSingleColumnSection(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{
        fontWeight: 'bold',
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
        marginBottom: '8px',
        backgroundColor: MASTER_CONSTANTS.COLORS.HEADER_BG,
        padding: '8px',
        margin: 0
      }}>
        {content.title || '—'}
      </h3>
      <div style={{
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
        whiteSpace: 'pre-wrap'
      }}>
        {content.text || '—'}
      </div>
    </div>
  );
}

function renderTable(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  if (!content?.headers || !content?.rows || !content?.columns) {
    return <div>No table data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: `1px solid ${MASTER_CONSTANTS.COLORS.BORDER}`,
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`
      }}>
        <thead>
          <tr style={{ backgroundColor: MASTER_CONSTANTS.COLORS.HEADER_BG }}>
            {content.headers.map((header: string, index: number) => (
              <th key={index} style={{
                border: `1px solid ${MASTER_CONSTANTS.COLORS.BORDER}`,
                padding: '8px',
                textAlign: index === 0 ? 'left' : index >= 4 ? 'right' : 'center',
                width: content.columns[index] ? `${content.columns[index].width}px` : 'auto',
                fontWeight: 'bold'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row: any[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex} style={{
                  border: `1px solid ${MASTER_CONSTANTS.COLORS.BORDER}`,
                  padding: '8px',
                  textAlign: cellIndex === 0 ? 'left' : cellIndex >= 4 ? 'right' : 'center',
                  width: content.columns[cellIndex] ? `${content.columns[cellIndex].width}px` : 'auto',
                  verticalAlign: 'top'
                }}>
                  {typeof cell === 'object' && cell?.main ? (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{cell.main}</div>
                      {cell.sub && cell.sub.length > 0 && cell.sub.map((subText: string, subIndex: number) => (
                        <div key={subIndex} style={{ 
                          color: MASTER_CONSTANTS.COLORS.TEXT_SECONDARY,
                          marginTop: '4px',
                          fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL - 2}px`
                        }}>
                          {subText}
                        </div>
                      ))}
                    </div>
                  ) : (
                    cell || '—'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTotals(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      height: '100%'
    }}>
      <div style={{
        fontWeight: 'bold',
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.NORMAL}px`
      }}>
        {content.label || 'Total'}: {content.value || '—'}
      </div>
    </div>
  );
}

function renderSignature(block: MasterLayoutBlock): React.ReactNode {
  const { content } = block;
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{
        fontWeight: 'bold',
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
        marginBottom: '8px',
        backgroundColor: MASTER_CONSTANTS.COLORS.HEADER_BG,
        padding: '8px',
        margin: 0
      }}>
        DECLARATION & SIGNATURE
      </h3>
      <div style={{
        fontSize: `${MASTER_CONSTANTS.FONTS.SIZES.SMALL}px`,
        marginBottom: '16px'
      }}>
        {content.declaration || '—'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '32px' }}>_________________________</div>
          <div style={{ fontWeight: 'bold' }}>Signature</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>Signatory:</strong> {content.signatory || '—'}</div>
        </div>
      </div>
    </div>
  );
}

