import { calculateStoichiometry } from './stoichiometry';

describe('Stoichiometry Calculator', () => {
  describe('calculateStoichiometry', () => {
    test('should calculate moles to moles conversion', () => {
      const result = calculateStoichiometry({
        equation: 'H2 + O2 -> H2O',
        given: { molecule: 'H2', amount: 2, unit: 'mol' },
        find: { molecule: 'H2O', unit: 'mol' },
      });

      expect(result.amount).toBe(2);
      expect(result.unit).toBe('mol');
      expect(result.balancedEquation).toBe('2H2 + O2 -> 2H2O');
    });

    test('should calculate moles to grams conversion', () => {
      const result = calculateStoichiometry({
        equation: 'H2 + O2 -> H2O',
        given: { molecule: 'H2', amount: 2, unit: 'mol' },
        find: { molecule: 'H2O', unit: 'g' },
      });

      expect(result.amount).toBeCloseTo(36.03, 1);
      expect(result.unit).toBe('g');
    });

    test('should calculate grams to moles conversion', () => {
      const result = calculateStoichiometry({
        equation: 'Fe + O2 -> Fe2O3',
        given: { molecule: 'Fe', amount: 55.85, unit: 'g' },
        find: { molecule: 'Fe2O3', unit: 'mol' },
      });

      expect(result.amount).toBeCloseTo(0.5, 1);
      expect(result.unit).toBe('mol');
    });

    test('should calculate grams to grams conversion', () => {
      const result = calculateStoichiometry({
        equation: 'C + O2 -> CO2',
        given: { molecule: 'C', amount: 12.01, unit: 'g' },
        find: { molecule: 'CO2', unit: 'g' },
      });

      expect(result.amount).toBeCloseTo(44.01, 1);
      expect(result.unit).toBe('g');
    });

    test('should include step-by-step explanation', () => {
      const result = calculateStoichiometry({
        equation: 'H2 + O2 -> H2O',
        given: { molecule: 'H2', amount: 4, unit: 'mol' },
        find: { molecule: 'H2O', unit: 'mol' },
      });

      expect(result.steps).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    test('should handle complex equations', () => {
      const result = calculateStoichiometry({
        equation: 'C6H12O6 -> C2H5OH + CO2',
        given: { molecule: 'C6H12O6', amount: 180.16, unit: 'g' },
        find: { molecule: 'C2H5OH', unit: 'g' },
      });

      expect(result.amount).toBeCloseTo(92.14, 0);
    });

    test('should throw error for given molecule not in equation', () => {
      expect(() =>
        calculateStoichiometry({
          equation: 'H2 + O2 -> H2O',
          given: { molecule: 'N2', amount: 1, unit: 'mol' },
          find: { molecule: 'H2O', unit: 'mol' },
        })
      ).toThrow();
    });

    test('should throw error for find molecule not in equation', () => {
      expect(() =>
        calculateStoichiometry({
          equation: 'H2 + O2 -> H2O',
          given: { molecule: 'H2', amount: 1, unit: 'mol' },
          find: { molecule: 'N2', unit: 'mol' },
        })
      ).toThrow();
    });
  });
});

