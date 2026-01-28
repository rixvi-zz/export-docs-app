import { DocumentSchema, SellerSchema, BuyerSchema, GoodsItemSchema } from '@/lib/schemas';

describe('Zod Schemas', () => {
  describe('SellerSchema', () => {
    it('should validate a complete seller object', () => {
      const validSeller = {
        companyName: 'Test Company',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        postalCode: '12345',
        phone: '+1-555-0123',
        email: 'test@example.com',
        taxId: 'TAX123',
        exportLicense: 'EXP456'
      };

      const result = SellerSchema.safeParse(validSeller);
      expect(result.success).toBe(true);
    });

    it('should require mandatory fields', () => {
      const invalidSeller = {
        companyName: '',
        address: '',
        city: '',
        country: ''
      };

      const result = SellerSchema.safeParse(invalidSeller);
      expect(result.success).toBe(false);
    });
  });

  describe('BuyerSchema', () => {
    it('should validate a complete buyer object', () => {
      const validBuyer = {
        companyName: 'Buyer Company',
        contactPerson: 'John Doe',
        address: '456 Buyer St',
        city: 'Buyer City',
        country: 'Buyer Country',
        postalCode: '67890',
        phone: '+1-555-0456',
        email: 'buyer@example.com'
      };

      const result = BuyerSchema.safeParse(validBuyer);
      expect(result.success).toBe(true);
    });
  });

  describe('GoodsItemSchema', () => {
    it('should validate a complete goods item', () => {
      const validGoodsItem = {
        description: 'Test Product',
        category: 'agricultural-produce' as const,
        customCategory: '',
        hsCode: '1234.56.78',
        quantity: 100,
        unit: 'KG',
        unitPrice: 10.50,
        totalPrice: 1050,
        qualitySpecs: 'Grade A',
        packagingSpecs: 'Vacuum packed',
        temperatureHandling: 'Room temperature',
        inspectionCerts: 'ISO 9001',
        netWeight: 95,
        grossWeight: 105,
        cbm: 0.5,
        marksNumbers: 'LOT-001'
      };

      const result = GoodsItemSchema.safeParse(validGoodsItem);
      expect(result.success).toBe(true);
    });

    it('should calculate total price correctly', () => {
      const goodsItem = {
        description: 'Test Product',
        category: 'other' as const,
        customCategory: 'Custom',
        hsCode: '',
        quantity: 10,
        unit: 'PCS',
        unitPrice: 5.00,
        totalPrice: 50.00,
        qualitySpecs: '',
        packagingSpecs: '',
        temperatureHandling: '',
        inspectionCerts: '',
        netWeight: 0,
        grossWeight: 0,
        cbm: 0,
        marksNumbers: ''
      };

      const result = GoodsItemSchema.safeParse(goodsItem);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalPrice).toBe(50.00);
      }
    });
  });

  describe('DocumentSchema', () => {
    it('should validate a minimal document', () => {
      const minimalDocument = {
        logo: undefined,
        seller: {
          companyName: 'Test Seller',
          address: 'Test Address',
          city: 'Test City',
          country: 'Test Country',
          postalCode: '',
          phone: '',
          email: '',
          taxId: '',
          exportLicense: ''
        },
        buyer: {
          companyName: 'Test Buyer',
          contactPerson: '',
          address: 'Buyer Address',
          city: 'Buyer City',
          country: 'Buyer Country',
          postalCode: '',
          phone: '',
          email: ''
        },
        consignee: undefined,
        sameAsBuyer: false,
        goods: [],
        shipment: {
          portOfLoading: '',
          portOfDischarge: '',
          countryOfOrigin: '',
          countryOfDestination: '',
          vesselName: '',
          voyageNumber: '',
          billOfLadingDate: '',
          estimatedDeparture: '',
          estimatedArrival: ''
        },
        incoterms: {
          term: '',
          place: '',
          iccVersion: '2020'
        },
        paymentTerms: '',
        paymentModes: [],
        banking: undefined,
        terms: '',
        declaration: {
          declarationText: '',
          signatoryName: '',
          signatoryTitle: '',
          companyName: '',
          placeOfSigning: '',
          dateOfSigning: ''
        },
        packingDetails: {
          totalPackages: 1,
          packageType: '',
          totalNetWeight: 0,
          totalGrossWeight: 0,
          totalCBM: 0,
          containerNumber: '',
          sealNumber: ''
        },
        originDetails: {
          countryOfOrigin: '',
          manufacturerName: '',
          manufacturerAddress: '',
          declarationStatement: '',
          authorizedSignatory: '',
          signatoryTitle: '',
          placeOfIssue: '',
          dateOfIssue: ''
        }
      };

      const result = DocumentSchema.safeParse(minimalDocument);
      expect(result.success).toBe(true);
    });
  });
});