import {
  calculatePH,
  calculatePOH,
  strongAcidPH,
  strongBasePH,
  weakAcidPH,
  weakBasePH,
  bufferPH,
  convertKaKb,
  pK,
  KFromPK,
  Kw,
  COMMON_Ka,
  COMMON_Kb,
} from './ph-calculator';

describe('pH Calculator', () => {
  describe('calculatePH', () => {
    test('should calculate pH from [H+] concentration', () => {
      const result = calculatePH(0.001);
      expect(result.pH).toBeCloseTo(3, 1);
      expect(result.pOH).toBeCloseTo(11, 1);
      expect(result.nature).toBe('acidic');
    });

    test('should calculate pH = 7 for neutral solution', () => {
      const result = calculatePH(1e-7);
      expect(result.pH).toBeCloseTo(7, 0);
      expect(result.nature).toBe('neutral');
    });

    test('should calculate basic pH', () => {
      const result = calculatePH(1e-10);
      expect(result.pH).toBeCloseTo(10, 0);
      expect(result.nature).toBe('basic');
    });

    test('should throw for non-positive concentration', () => {
      expect(() => calculatePH(0)).toThrow();
      expect(() => calculatePH(-1)).toThrow();
    });
  });

  describe('calculatePOH', () => {
    test('should calculate pOH from [OH-] concentration', () => {
      const result = calculatePOH(0.001);
      expect(result.pOH).toBeCloseTo(3, 1);
      expect(result.pH).toBeCloseTo(11, 1);
      expect(result.nature).toBe('basic');
    });

    test('should throw for non-positive concentration', () => {
      expect(() => calculatePOH(0)).toThrow();
      expect(() => calculatePOH(-1)).toThrow();
    });
  });

  describe('strongAcidPH', () => {
    test('should calculate pH of 0.1M HCl', () => {
      const result = strongAcidPH(0.1);
      expect(result.pH).toBeCloseTo(1, 0);
      expect(result.nature).toBe('acidic');
    });

    test('should handle diprotic acids', () => {
      const result = strongAcidPH(0.1, 2);
      expect(result.pH).toBeCloseTo(0.7, 0);
    });

    test('should throw for non-positive concentration', () => {
      expect(() => strongAcidPH(0)).toThrow();
    });
  });

  describe('strongBasePH', () => {
    test('should calculate pH of 0.1M NaOH', () => {
      const result = strongBasePH(0.1);
      expect(result.pH).toBeCloseTo(13, 0);
      expect(result.nature).toBe('basic');
    });

    test('should handle diprotic bases', () => {
      const result = strongBasePH(0.1, 2);
      expect(result.pH).toBeCloseTo(13.3, 0);
    });

    test('should throw for non-positive concentration', () => {
      expect(() => strongBasePH(0)).toThrow();
    });
  });

  describe('weakAcidPH', () => {
    test('should calculate pH of 0.1M acetic acid', () => {
      const result = weakAcidPH(0.1, 1.8e-5);
      expect(result.pH).toBeCloseTo(2.87, 1);
      expect(result.percentIonization).toBeGreaterThan(0);
    });

    test('should throw for non-positive values', () => {
      expect(() => weakAcidPH(0, 1.8e-5)).toThrow();
      expect(() => weakAcidPH(0.1, 0)).toThrow();
    });

    test('should handle different concentrations', () => {
      const result = weakAcidPH(0.01, 1.8e-5);
      expect(result.pH).toBeGreaterThan(0);
    });
  });

  describe('weakBasePH', () => {
    test('should calculate pH of 0.1M ammonia', () => {
      const result = weakBasePH(0.1, 1.8e-5);
      expect(result.pH).toBeCloseTo(11.13, 0);
      expect(result.percentIonization).toBeGreaterThan(0);
    });

    test('should throw for non-positive values', () => {
      expect(() => weakBasePH(0, 1.8e-5)).toThrow();
      expect(() => weakBasePH(0.1, 0)).toThrow();
    });
  });

  describe('bufferPH', () => {
    test('should calculate buffer pH using Henderson-Hasselbalch', () => {
      const pH = bufferPH(4.76, 0.1, 0.15);
      expect(pH).toBeCloseTo(4.94, 1);
    });

    test('should throw for non-positive concentrations', () => {
      expect(() => bufferPH(4.76, 0, 0.15)).toThrow();
      expect(() => bufferPH(4.76, 0.1, 0)).toThrow();
    });
  });

  describe('convertKaKb', () => {
    test('should convert Ka to Kb', () => {
      const Kb = convertKaKb(1.8e-5, 'Ka');
      expect(Kb).toBeCloseTo(5.56e-10, 11);
    });

    test('should convert Kb to Ka', () => {
      const Ka = convertKaKb(1.8e-5, 'Kb');
      expect(Ka).toBeCloseTo(5.56e-10, 11);
    });
  });

  describe('pK functions', () => {
    test('pK should calculate -log10(K)', () => {
      expect(pK(1e-5)).toBeCloseTo(5, 1);
    });

    test('KFromPK should calculate 10^(-pK)', () => {
      expect(KFromPK(5)).toBeCloseTo(1e-5, 6);
    });
  });

  describe('Constants', () => {
    test('Kw should be 1e-14', () => {
      expect(Kw).toBe(1e-14);
    });

    test('COMMON_Ka should have acetic acid', () => {
      expect(COMMON_Ka['CH3COOH']).toBeCloseTo(1.8e-5, 6);
    });

    test('COMMON_Kb should have ammonia', () => {
      expect(COMMON_Kb['NH3']).toBeCloseTo(1.8e-5, 6);
    });
  });
});

