import {
  calculateMolarity,
  calculateMolarityFromMass,
  calculateDilution,
  calculateMolality,
  calculateMoleFraction,
  molarityToMolality,
  calculatePPM,
  massForMolarity,
} from './concentration';

describe('Concentration Calculator', () => {
  describe('calculateMolarity', () => {
    test('should calculate molarity correctly', () => {
      const result = calculateMolarity(0.5, 2);
      expect(result.molarity).toBe(0.25);
      expect(result.moles).toBe(0.5);
      expect(result.liters).toBe(2);
    });

    test('should throw for non-positive volume', () => {
      expect(() => calculateMolarity(1, 0)).toThrow();
      expect(() => calculateMolarity(1, -1)).toThrow();
    });
  });

  describe('calculateMolarityFromMass', () => {
    test('should calculate molarity from mass of NaCl', () => {
      const result = calculateMolarityFromMass(58.44, 'NaCl', 1);
      expect(result.molarity).toBeCloseTo(1, 1);
    });
  });

  describe('calculateDilution', () => {
    test('should solve for V2', () => {
      const result = calculateDilution({ M1: 6, V1: 0.01, M2: 2 });
      expect(result.solvedFor).toBe('V2');
      expect(result.V2).toBeCloseTo(0.03, 2);
      expect(result.volumeToAdd).toBeCloseTo(0.02, 2);
    });

    test('should solve for M2', () => {
      const result = calculateDilution({ M1: 6, V1: 0.1, V2: 0.5 });
      expect(result.solvedFor).toBe('M2');
      expect(result.M2).toBeCloseTo(1.2, 1);
    });

    test('should solve for M1', () => {
      const result = calculateDilution({ V1: 0.1, M2: 1.2, V2: 0.5 });
      expect(result.solvedFor).toBe('M1');
      expect(result.M1).toBeCloseTo(6, 0);
    });

    test('should solve for V1', () => {
      const result = calculateDilution({ M1: 6, M2: 2, V2: 0.03 });
      expect(result.solvedFor).toBe('V1');
      expect(result.V1).toBeCloseTo(0.01, 2);
    });

    test('should throw for invalid dilution (concentration increases)', () => {
      expect(() => calculateDilution({ M1: 2, V1: 0.1, M2: 6 })).toThrow();
    });

    test('should throw if not 3 variables provided', () => {
      expect(() => calculateDilution({ M1: 6, V1: 0.01 })).toThrow();
    });
  });

  describe('calculateMolality', () => {
    test('should calculate molality correctly', () => {
      const result = calculateMolality(0.5, 1);
      expect(result.molality).toBe(0.5);
      expect(result.moles).toBe(0.5);
      expect(result.solventMassKg).toBe(1);
    });

    test('should throw for non-positive mass', () => {
      expect(() => calculateMolality(1, 0)).toThrow();
      expect(() => calculateMolality(1, -1)).toThrow();
    });
  });

  describe('calculateMoleFraction', () => {
    test('should calculate mole fractions correctly', () => {
      const result = calculateMoleFraction(1, 9);
      expect(result.soluteFraction).toBe(0.1);
      expect(result.solventFraction).toBe(0.9);
    });

    test('should throw for non-positive total moles', () => {
      expect(() => calculateMoleFraction(-1, 0)).toThrow();
    });
  });

  describe('molarityToMolality', () => {
    test('should convert molarity to molality', () => {
      const molality = molarityToMolality(1, 58.44, 1.04);
      expect(molality).toBeGreaterThan(0);
    });
  });

  describe('calculatePPM', () => {
    test('should calculate ppm correctly', () => {
      const ppm = calculatePPM(0.001, 1);
      expect(ppm).toBe(1000);
    });
  });

  describe('massForMolarity', () => {
    test('should calculate mass needed for molarity', () => {
      const mass = massForMolarity(1, 1, 'NaCl');
      expect(mass).toBeCloseTo(58.44, 1);
    });
  });
});

