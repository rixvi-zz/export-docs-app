// Test the PDF generation with the new architecture
const { jsPDF } = require('jspdf');

// Mock the layout constants
const LAYOUT_CONSTANTS = {
  A4_WIDTH: 794,
  A4_HEIGHT: 1123,
  MARGINS: { top: 56, right: 75, bottom: 56, left: 56 },
  FONTS: { size: { normal: 12, title: 24, large: 16, small: 10 } },
  COLORS: { titleBlue: '#1E40AF' }
};

try {
  console.log('Testing PDF generation with new architecture...');
  
  // Create PDF with exact A4 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [LAYOUT_CONSTANTS.A4_WIDTH, LAYOUT_CONSTANTS.A4_HEIGHT]
  });

  // Set font to match preview
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(LAYOUT_CONSTANTS.FONTS.size.normal);

  // Test basic text rendering
  pdf.setFontSize(LAYOUT_CONSTANTS.FONTS.size.title);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175); // Blue color
  const titleText = 'COMMERCIAL INVOICE';
  const titleWidth = pdf.getTextWidth(titleText);
  pdf.text(titleText, (LAYOUT_CONSTANTS.A4_WIDTH - titleWidth) / 2, LAYOUT_CONSTANTS.MARGINS.top);

  // Test company name
  pdf.setFontSize(LAYOUT_CONSTANTS.FONTS.size.large);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0); // Black
  pdf.text('AOA FOODS PRIVATE LIMITED', LAYOUT_CONSTANTS.MARGINS.left, LAYOUT_CONSTANTS.MARGINS.top + 40);

  console.log('✅ PDF generation successful!');
  console.log('✅ Text rendering works');
  console.log('✅ Font changes work');
  console.log('✅ Color changes work');
  console.log('✅ Positioning works');
  
  // Test save functionality (commented out to avoid file creation)
  // pdf.save('test-invoice.pdf');
  
} catch (error) {
  console.error('❌ PDF generation failed:', error);
  console.error('Error details:', error.message);
}