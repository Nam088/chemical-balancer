import { calculateMolarMass, calculateMolarMassDetailed, ATOMIC_MASSES } from './molar-mass';

describe('Molar Mass Calculator', () => {
  describe('calculateMolarMass', () => {
    test('should calculate molar mass of H2O', () => {
      const result = calculateMolarMass('H2O');
      expect(result).toBeCloseTo(18.015, 2);
    });

    test('should calculate molar mass of NaCl', () => {
      const result = calculateMolarMass('NaCl');
      expect(result).toBeCloseTo(58.44, 1);
    });

    test('should calculate molar mass of glucose C6H12O6', () => {
      const result = calculateMolarMass('C6H12O6');
      expect(result).toBeCloseTo(180.16, 1);
    });

    test('should calculate molar mass of Ca(OH)2', () => {
      const result = calculateMolarMass('Ca(OH)2');
      expect(result).toBeCloseTo(74.09, 1);
    });

    test('should calculate molar mass of (NH4)2SO4', () => {
      const result = calculateMolarMass('(NH4)2SO4');
      expect(result).toBeCloseTo(132.14, 1);
    });

    test('should calculate molar mass of H2SO4', () => {
      const result = calculateMolarMass('H2SO4');
      expect(result).toBeCloseTo(98.08, 1);
    });

    test('should calculate molar mass of FeCl3', () => {
      const result = calculateMolarMass('FeCl3');
      expect(result).toBeCloseTo(162.20, 1);
    });

    test('should handle hydrates like CuSO4.5H2O', () => {
      const result = calculateMolarMass('CuSO4.5H2O');
      expect(result).toBeCloseTo(249.68, 1);
    });
  });

  describe('calculateMolarMassDetailed', () => {
    test('should return detailed breakdown for H2O', () => {
      const result = calculateMolarMassDetailed('H2O');
      
      expect(result.molarMass).toBeCloseTo(18.015, 2);
      expect(result.breakdown).toHaveProperty('H');
      expect(result.breakdown).toHaveProperty('O');
      expect(result.breakdown.H.count).toBe(2);
      expect(result.breakdown.O.count).toBe(1);
    });

    test('should return detailed breakdown for NaCl', () => {
      const result = calculateMolarMassDetailed('NaCl');
      
      expect(result.breakdown.Na.count).toBe(1);
      expect(result.breakdown.Cl.count).toBe(1);
      expect(result.breakdown.Na.mass).toBeCloseTo(22.99, 1);
      expect(result.breakdown.Cl.mass).toBeCloseTo(35.45, 1);
    });

    test('should handle complex formulas like Ca3(PO4)2', () => {
      const result = calculateMolarMassDetailed('Ca3(PO4)2');
      
      expect(result.breakdown.Ca.count).toBe(3);
      expect(result.breakdown.P.count).toBe(2);
      expect(result.breakdown.O.count).toBe(8);
      expect(result.molarMass).toBeCloseTo(310.18, 1);
    });
  });

  describe('ATOMIC_MASSES', () => {
    test('should have all common elements', () => {
      expect(ATOMIC_MASSES).toHaveProperty('H');
      expect(ATOMIC_MASSES).toHaveProperty('C');
      expect(ATOMIC_MASSES).toHaveProperty('N');
      expect(ATOMIC_MASSES).toHaveProperty('O');
      expect(ATOMIC_MASSES).toHaveProperty('Fe');
      expect(ATOMIC_MASSES).toHaveProperty('Au');
    });

    test('should have correct atomic mass for carbon', () => {
      expect(ATOMIC_MASSES.C).toBeCloseTo(12.01, 1);
    });

    test('should have Deuterium as special isotope', () => {
      expect(ATOMIC_MASSES).toHaveProperty('D');
      expect(ATOMIC_MASSES.D).toBeCloseTo(2.014, 2);
    });
  });

  describe('Error handling', () => {
    test('should throw error for unknown element', () => {
      expect(() => calculateMolarMass('Xx2O')).toThrow();
    });
  });
});
