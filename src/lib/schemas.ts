import { z } from 'zod';

// Currency Enum
export const CurrencyEnum = z.enum([
  'USD', // US Dollar
  'EUR', // Euro
  'GBP', // British Pound
  'JPY', // Japanese Yen
  'CAD', // Canadian Dollar
  'AUD', // Australian Dollar
  'CHF', // Swiss Franc
  'CNY', // Chinese Yuan
  'INR', // Indian Rupee
  'SGD', // Singapore Dollar
  'HKD', // Hong Kong Dollar
  'SEK', // Swedish Krona
  'NOK', // Norwegian Krone
  'DKK', // Danish Krone
  'NZD', // New Zealand Dollar
  'ZAR', // South African Rand
  'BRL', // Brazilian Real
  'MXN', // Mexican Peso
  'KRW', // South Korean Won
  'THB'  // Thai Baht
]);

// Shipping Method Enum
export const ShippingMethodEnum = z.enum([
  'sea-freight',     // Sea Freight / Ocean Shipping
  'air-freight',     // Air Freight
  'road-transport',  // Road Transport / Trucking
  'rail-transport',  // Rail Transport
  'courier',         // Courier / Express Delivery
  'multimodal',      // Multimodal Transport
  'pipeline',        // Pipeline Transport
  'inland-waterway', // Inland Waterway
  'other'           // Other / Custom
]);

// Product Categories Enum
export const ProductCategoryEnum = z.enum([
  'agricultural-produce',
  'grains-cereals',
  'feed-raw-materials',
  'oils-fats',
  'meat-poultry',
  'dairy-products',
  'seafood',
  'processed-foods',
  'spices-condiments',
  'beverages',
  'animal-byproducts',
  'other'
]);

// Payment Modes Enum (Multi-select)
export const PaymentModeEnum = z.enum([
  'letter-of-credit',
  'tt-wire-transfer',
  'advance-payment',
  'documents-against-payment',
  'documents-against-acceptance',
  'open-account',
  'as-mutually-agreed'
]);

// Seller/Exporter Schema
export const SellerSchema = z.object({
  companyName: z.string().default(''),
  address: z.string().default(''),
  city: z.string().default(''),
  country: z.string().default(''),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email format"
  }),
  taxId: z.string().optional(),
  exportLicense: z.string().optional()
});

// Buyer Schema
export const BuyerSchema = z.object({
  companyName: z.string().default(''),
  contactPerson: z.string().optional(),
  address: z.string().default(''),
  city: z.string().default(''),
  country: z.string().default(''),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email format"
  })
});

// Consignee Schema (same as Buyer)
export const ConsigneeSchema = BuyerSchema;

// Goods Item Schema
export const GoodsItemSchema = z.object({
  description: z.string().default(''),
  category: ProductCategoryEnum.default('other'),
  customCategory: z.string().optional(),
  hsCode: z.string().optional(),
  quantity: z.number().min(0).default(1),
  unit: z.string().default(''),
  unitPrice: z.number().min(0).default(0),
  totalPrice: z.number().min(0).default(0),
  currency: CurrencyEnum.default('USD'),

  // Category-specific specifications
  qualitySpecs: z.string().optional(),
  packagingSpecs: z.string().optional(),
  temperatureHandling: z.string().optional(),
  inspectionCerts: z.string().optional(),

  // Packing details
  netWeight: z.number().min(0).optional(),
  grossWeight: z.number().min(0).optional(),
  cbm: z.number().min(0).optional(),
  marksNumbers: z.string().optional()
});

// Incoterms Schema
export const IncotermsSchema = z.object({
  term: z.string().default(''),
  place: z.string().default(''),
  iccVersion: z.string().default('2020')
});

// Shipment Schema
export const ShipmentSchema = z.object({
  shippingMethod: ShippingMethodEnum.default('sea-freight'),
  customShippingMethod: z.string().optional(),
  portOfLoading: z.string().default(''),
  portOfDischarge: z.string().default(''),
  countryOfOrigin: z.string().default(''),
  countryOfDestination: z.string().default(''),
  vesselName: z.string().optional(),
  voyageNumber: z.string().optional(),
  billOfLadingDate: z.string().optional(),
  estimatedDeparture: z.string().optional(),
  estimatedArrival: z.string().optional()
});

// Banking Schema
export const BankingSchema = z.object({
  beneficiaryBank: z.string().default(''),
  bankAddress: z.string().default(''),
  swiftCode: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  correspondentBank: z.string().optional()
});

// Declaration Schema
export const DeclarationSchema = z.object({
  declarationText: z.string().default(''),
  signatoryName: z.string().default(''),
  signatoryTitle: z.string().default(''),
  companyName: z.string().default(''),
  placeOfSigning: z.string().default(''),
  dateOfSigning: z.string().default('')
});

// Packing Details Schema
export const PackingDetailsSchema = z.object({
  totalPackages: z.number().min(1).default(1),
  packageType: z.string().default(''),
  totalNetWeight: z.number().min(0).default(0),
  totalGrossWeight: z.number().min(0).default(0),
  totalCBM: z.number().min(0).default(0),
  containerNumber: z.string().optional(),
  sealNumber: z.string().optional()
});

// Origin Details Schema (for COO)
export const OriginDetailsSchema = z.object({
  countryOfOrigin: z.string().default(''),
  manufacturerName: z.string().optional(),
  manufacturerAddress: z.string().optional(),
  declarationStatement: z.string().default(''),
  authorizedSignatory: z.string().default(''),
  signatoryTitle: z.string().default(''),
  placeOfIssue: z.string().default(''),
  dateOfIssue: z.string().default('')
});

// Main Document Schema
export const DocumentSchema = z.object({
  // Company & Logo
  logo: z.string().optional(),

  // Global Currency (can be overridden per line item)
  currency: CurrencyEnum.default('USD'),

  // Seller/Exporter Information
  seller: SellerSchema,

  // Buyer Information
  buyer: BuyerSchema,

  // Consignee Information (optional, can be same as buyer)
  consignee: ConsigneeSchema.optional(),
  sameAsBuyer: z.boolean().default(false),

  // Goods/Line Items
  goods: z.array(GoodsItemSchema).default([]),

  // Shipment Details
  shipment: ShipmentSchema,

  // Trade Terms
  incoterms: IncotermsSchema,
  paymentTerms: z.string().default(''),
  paymentModes: z.array(PaymentModeEnum).default([]),

  // Banking Details (optional)
  banking: BankingSchema.optional(),

  // Terms & Conditions
  terms: z.string().optional(),

  // Declaration & Signature
  declaration: DeclarationSchema,

  // Packing List Specific
  packingDetails: PackingDetailsSchema,

  // COO Specific
  originDetails: OriginDetailsSchema
});

// Export TypeScript types inferred from Zod schemas
export type Currency = z.infer<typeof CurrencyEnum>;
export type ShippingMethod = z.infer<typeof ShippingMethodEnum>;
export type ProductCategory = z.infer<typeof ProductCategoryEnum>;
export type PaymentMode = z.infer<typeof PaymentModeEnum>;
export type Seller = z.infer<typeof SellerSchema>;
export type Buyer = z.infer<typeof BuyerSchema>;
export type Consignee = z.infer<typeof ConsigneeSchema>;
export type GoodsItem = z.infer<typeof GoodsItemSchema>;
export type Incoterms = z.infer<typeof IncotermsSchema>;
export type Shipment = z.infer<typeof ShipmentSchema>;
export type Banking = z.infer<typeof BankingSchema>;
export type Declaration = z.infer<typeof DeclarationSchema>;
export type PackingDetails = z.infer<typeof PackingDetailsSchema>;
export type OriginDetails = z.infer<typeof OriginDetailsSchema>;
export type DocumentType = z.infer<typeof DocumentSchema>;

// Validation Warning type for non-blocking validation
export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning' | 'info';
}