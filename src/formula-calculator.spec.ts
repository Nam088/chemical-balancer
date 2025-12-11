import {
  calculateEmpiricalFormula,
  calculateMolecularFormula,
  calculatePercentComposition,
} from './formula-calculator';

describe('Formula Calculator', () => {
  describe('calculateEmpiricalFormula', () => {
    test('should calculate empirical formula from percentages (glucose)', () => {
      const result = calculateEmpiricalFormula([
        { element: 'C', mass: 40.0, unit: 'percent' },
        { element: 'H', mass: 6.7, unit: 'percent' },
        { element: 'O', mass: 53.3, unit: 'percent' },
      ]);
      expect(result.formula).toBe('CH2O');
      expect(result.molarMass).toBeCloseTo(30.03, 0);
    });

    test('should calculate empirical formula from grams', () => {
      const result = calculateEmpiricalFormula([
        { element: 'C', mass: 12.0, unit: 'grams' },
        { element: 'H', mass: 2.0, unit: 'grams' },
        { element: 'O', mass: 16.0, unit: 'grams' },
      ]);
      expect(result.formula).toBe('CH2O');
    });

    test('should include calculation steps', () => {
      const result = calculateEmpiricalFormula([
        { element: 'H', mass: 11.19, unit: 'percent' },
        { element: 'O', mass: 88.81, unit: 'percent' },
      ]);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    test('should handle formulas requiring multiplier for whole numbers', () => {
      // Fe2O3 from percentages
      const result = calculateEmpiricalFormula([
        { element: 'Fe', mass: 69.94, unit: 'percent' },
        { element: 'O', mass: 30.06, unit: 'percent' },
      ]);
      expect(result.formula).toContain('Fe');
      expect(result.formula).toContain('O');
    });

    test('should handle simple 1:1 ratios', () => {
      const result = calculateEmpiricalFormula([
        { element: 'Na', mass: 39.34, unit: 'percent' },
        { element: 'Cl', mass: 60.66, unit: 'percent' },
      ]);
      // Element order may vary, just check both are present with count 1
      expect(result.formula).toContain('Na');
      expect(result.formula).toContain('Cl');
      expect(result.ratios.Na).toBe(1);
      expect(result.ratios.Cl).toBe(1);
    });

    test('should reduce ratios by GCD', () => {
      // Using large amounts that would give reducible ratios
      const result = calculateEmpiricalFormula([
        { element: 'C', mass: 24.0, unit: 'grams' },
        { element: 'H', mass: 4.0, unit: 'grams' },
        { element: 'O', mass: 32.0, unit: 'grams' },
      ]);
      // Should reduce to CH2O, not C2H4O2
      expect(result.formula).toBe('CH2O');
    });

    test('should throw for unknown element', () => {
      expect(() =>
        calculateEmpiricalFormula([
          { element: 'Xx', mass: 100, unit: 'percent' },
        ])
      ).toThrow();
    });
  });

  describe('calculateMolecularFormula', () => {
    test('should calculate molecular formula from empirical and molar mass', () => {
      const result = calculateMolecularFormula('CH2O', 180.16);
      expect(result.formula).toBe('C6H12O6');
      expect(result.multiplier).toBe(6);
    });

    test('should return same formula when multiplier is 1', () => {
      const result = calculateMolecularFormula('H2O', 18.015);
      expect(result.formula).toBe('H2O');
      expect(result.multiplier).toBe(1);
    });

    test('should handle multiplier of 2', () => {
      const result = calculateMolecularFormula('CH2O', 60.05);
      expect(result.multiplier).toBe(2);
    });

    test('should throw for invalid molar mass', () => {
      expect(() => calculateMolecularFormula('C6H12O6', 10)).toThrow();
    });
  });

  describe('calculatePercentComposition', () => {
    test('should calculate percent composition of H2O', () => {
      const result = calculatePercentComposition('H2O');
      expect(result.H).toBeCloseTo(11.19, 0);
      expect(result.O).toBeCloseTo(88.81, 0);
    });

    test('should calculate percent composition of C6H12O6', () => {
      const result = calculatePercentComposition('C6H12O6');
      expect(result.C).toBeCloseTo(40.0, 0);
      expect(result.H).toBeCloseTo(6.71, 0);
      expect(result.O).toBeCloseTo(53.29, 0);
    });

    test('should calculate percent composition of NaCl', () => {
      const result = calculatePercentComposition('NaCl');
      expect(result.Na).toBeCloseTo(39.34, 0);
      expect(result.Cl).toBeCloseTo(60.66, 0);
    });

    test('should throw for unknown element', () => {
      expect(() => calculatePercentComposition('XxO2')).toThrow();
    });
  });
});
