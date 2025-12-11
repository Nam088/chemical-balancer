import { findLimitingReagent } from './limiting-reagent';

describe('Limiting Reagent Calculator', () => {
  describe('findLimitingReagent', () => {
    test('should find limiting reagent for H2 + O2 reaction', () => {
      const result = findLimitingReagent({
        equation: 'H2 + O2 -> H2O',
        reagents: [
          { molecule: 'H2', amount: 4, unit: 'mol' },
          { molecule: 'O2', amount: 1, unit: 'mol' },
        ],
      });

      // 2H2 + O2 -> 2H2O
      // 4 mol H2 can react with 2 mol O2
      // 1 mol O2 can react with 2 mol H2
      // O2 is limiting
      expect(result.limiting).toBe('O2');
      expect(result.excess).toHaveLength(1);
      expect(result.excess[0].molecule).toBe('H2');
      expect(result.excess[0].remaining).toBe(2);
    });

    test('should find limiting reagent when amounts are exactly stoichiometric', () => {
      const result = findLimitingReagent({
        equation: 'H2 + O2 -> H2O',
        reagents: [
          { molecule: 'H2', amount: 2, unit: 'mol' },
          { molecule: 'O2', amount: 1, unit: 'mol' },
        ],
      });

      // Exactly stoichiometric - either could be limiting
      expect(result.excess).toHaveLength(0);
    });

    test('should handle grams input', () => {
      const result = findLimitingReagent({
        equation: 'Na + Cl2 -> NaCl',
        reagents: [
          { molecule: 'Na', amount: 46, unit: 'g' }, // ~2 mol
          { molecule: 'Cl2', amount: 71, unit: 'g' }, // ~1 mol
        ],
      });

      // 2Na + Cl2 -> 2NaCl
      // 2 mol Na needs 1 mol Cl2 - stoichiometric
      expect(result.balancedEquation).toBe('2Na + Cl2 -> 2NaCl');
    });

    test('should include explanation', () => {
      const result = findLimitingReagent({
        equation: 'H2 + O2 -> H2O',
        reagents: [
          { molecule: 'H2', amount: 4, unit: 'mol' },
          { molecule: 'O2', amount: 1, unit: 'mol' },
        ],
      });

      expect(result.explanation).toBeDefined();
      expect(result.explanation).toContain('O2');
    });

    test('should handle complex reactions with multiple reactants', () => {
      const result = findLimitingReagent({
        equation: 'Fe2O3 + C -> Fe + CO2',
        reagents: [
          { molecule: 'Fe2O3', amount: 1, unit: 'mol' },
          { molecule: 'C', amount: 10, unit: 'mol' },
        ],
      });

      // 2Fe2O3 + 3C -> 4Fe + 3CO2
      // 1 mol Fe2O3 needs 1.5 mol C
      // Fe2O3 is limiting
      expect(result.limiting).toBe('Fe2O3');
    });

    test('should throw error for molecule not in equation', () => {
      expect(() =>
        findLimitingReagent({
          equation: 'H2 + O2 -> H2O',
          reagents: [
            { molecule: 'N2', amount: 1, unit: 'mol' },
            { molecule: 'O2', amount: 1, unit: 'mol' },
          ],
        })
      ).toThrow();
    });
  });
});
