import { DocumentType, ValidationWarning } from '@/lib/schemas';

export function validateDocument(document: DocumentType): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Seller validation
  if (!document.seller.companyName) {
    warnings.push({
      field: 'Company Name',
      message: 'Company name is required for professional documents',
      severity: 'warning'
    });
  }

  if (!document.seller.address) {
    warnings.push({
      field: 'Seller Address',
      message: 'Complete address is recommended for customs clearance',
      severity: 'warning'
    });
  }

  if (!document.seller.city || !document.seller.country) {
    warnings.push({
      field: 'Seller Location',
      message: 'City and country are important for trade documentation',
      severity: 'warning'
    });
  }

  // Buyer validation
  if (!document.buyer.companyName) {
    warnings.push({
      field: 'Buyer Company',
      message: 'Buyer company name is required',
      severity: 'warning'
    });
  }

  if (!document.buyer.address || !document.buyer.city || !document.buyer.country) {
    warnings.push({
      field: 'Buyer Address',
      message: 'Complete buyer address is required for shipping',
      severity: 'warning'
    });
  }

  // Goods validation
  if (document.goods.length === 0) {
    warnings.push({
      field: 'Goods',
      message: 'At least one product item is required',
      severity: 'warning'
    });
  }

  document.goods.forEach((item, index) => {
    if (!item.description) {
      warnings.push({
        field: `Item ${index + 1} Description`,
        message: 'Product description is required for customs',
        severity: 'warning'
      });
    }

    if (!item.quantity || item.quantity <= 0) {
      warnings.push({
        field: `Item ${index + 1} Quantity`,
        message: 'Valid quantity is required',
        severity: 'warning'
      });
    }

    if (!item.unit) {
      warnings.push({
        field: `Item ${index + 1} Unit`,
        message: 'Unit of measurement is required',
        severity: 'warning'
      });
    }

    if (!item.unitPrice || item.unitPrice <= 0) {
      warnings.push({
        field: `Item ${index + 1} Price`,
        message: 'Valid unit price is required',
        severity: 'warning'
      });
    }

    if (!item.hsCode) {
      warnings.push({
        field: `Item ${index + 1} HS Code`,
        message: 'HS Code is recommended for customs classification',
        severity: 'info'
      });
    }
  });

  // Shipment validation
  if (!document.shipment.portOfLoading) {
    warnings.push({
      field: 'Port of Loading',
      message: 'Port of loading is required for shipping documents',
      severity: 'warning'
    });
  }

  if (!document.shipment.portOfDischarge) {
    warnings.push({
      field: 'Port of Discharge',
      message: 'Port of discharge is required for shipping documents',
      severity: 'warning'
    });
  }

  if (!document.shipment.countryOfOrigin) {
    warnings.push({
      field: 'Country of Origin',
      message: 'Country of origin is required for customs clearance',
      severity: 'warning'
    });
  }

  if (!document.shipment.countryOfDestination) {
    warnings.push({
      field: 'Country of Destination',
      message: 'Country of destination is required',
      severity: 'warning'
    });
  }

  // Incoterms validation
  if (!document.incoterms.term) {
    warnings.push({
      field: 'Incoterms',
      message: 'Incoterms are required for international trade',
      severity: 'warning'
    });
  }

  if (!document.incoterms.place) {
    warnings.push({
      field: 'Incoterms Place',
      message: 'Incoterms place is required',
      severity: 'warning'
    });
  }

  // Payment terms validation
  if (!document.paymentTerms) {
    warnings.push({
      field: 'Payment Terms',
      message: 'Payment terms are required for commercial transactions',
      severity: 'warning'
    });
  }

  if (document.paymentModes.length === 0) {
    warnings.push({
      field: 'Payment Modes',
      message: 'At least one payment mode should be selected',
      severity: 'info'
    });
  }

  // Declaration validation
  if (!document.declaration.signatoryName) {
    warnings.push({
      field: 'Signatory Name',
      message: 'Signatory name is required for document authentication',
      severity: 'warning'
    });
  }

  if (!document.declaration.signatoryTitle) {
    warnings.push({
      field: 'Signatory Title',
      message: 'Signatory title is required',
      severity: 'warning'
    });
  }

  if (!document.declaration.placeOfSigning) {
    warnings.push({
      field: 'Place of Signing',
      message: 'Place of signing is required',
      severity: 'warning'
    });
  }

  if (!document.declaration.dateOfSigning) {
    warnings.push({
      field: 'Date of Signing',
      message: 'Date of signing is required',
      severity: 'warning'
    });
  }

  // Packing details validation
  if (!document.packingDetails.totalPackages || document.packingDetails.totalPackages <= 0) {
    warnings.push({
      field: 'Total Packages',
      message: 'Total number of packages is required for packing list',
      severity: 'warning'
    });
  }

  if (!document.packingDetails.packageType) {
    warnings.push({
      field: 'Package Type',
      message: 'Package type is required for packing list',
      severity: 'warning'
    });
  }

  // COO validation
  if (!document.originDetails.countryOfOrigin && !document.shipment.countryOfOrigin) {
    warnings.push({
      field: 'COO Country of Origin',
      message: 'Country of origin is required for Certificate of Origin',
      severity: 'warning'
    });
  }

  if (!document.originDetails.authorizedSignatory) {
    warnings.push({
      field: 'COO Authorized Signatory',
      message: 'Authorized signatory is required for Certificate of Origin',
      severity: 'warning'
    });
  }

  if (!document.originDetails.placeOfIssue) {
    warnings.push({
      field: 'COO Place of Issue',
      message: 'Place of issue is required for Certificate of Origin',
      severity: 'warning'
    });
  }

  if (!document.originDetails.dateOfIssue) {
    warnings.push({
      field: 'COO Date of Issue',
      message: 'Date of issue is required for Certificate of Origin',
      severity: 'warning'
    });
  }

  return warnings;
}