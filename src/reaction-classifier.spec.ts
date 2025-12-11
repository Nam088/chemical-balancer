import { classifyReaction, ReactionType } from './reaction-classifier';

describe('Reaction Classifier', () => {
  describe('classifyReaction', () => {
    test('should classify combustion reactions', () => {
      const result = classifyReaction('CH4 + O2 -> CO2 + H2O');
      expect(result.type).toBe('combustion');
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    test('should classify another combustion reaction', () => {
      const result = classifyReaction('C2H6 + O2 -> CO2 + H2O');
      expect(result.type).toBe('combustion');
    });

    test('should classify acid-base neutralization', () => {
      const result = classifyReaction('HCl + NaOH -> NaCl + H2O');
      expect(result.type).toBe('acid-base');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    test('should classify H2SO4 as acid', () => {
      const result = classifyReaction('H2SO4 + KOH -> K2SO4 + H2O');
      expect(result.type).toBe('acid-base');
    });

    test('should classify decomposition reactions', () => {
      const result = classifyReaction('CaCO3 -> CaO + CO2');
      expect(result.type).toBe('decomposition');
    });

    test('should classify decomposition of water', () => {
      const result = classifyReaction('H2O -> H2 + O2');
      expect(result.type).toBe('decomposition');
    });

    test('should classify synthesis reactions', () => {
      const result = classifyReaction('H2 + O2 -> H2O');
      expect(result.type).toBe('synthesis');
    });

    test('should classify synthesis of ammonia', () => {
      const result = classifyReaction('N2 + H2 -> NH3');
      expect(result.type).toBe('synthesis');
    });

    test('should classify single replacement reactions', () => {
      const result = classifyReaction('Zn + CuSO4 -> ZnSO4 + Cu');
      expect(result.type).toBe('single-replacement');
    });

    test('should classify double replacement reactions', () => {
      const result2 = classifyReaction('NaBr + KCl -> NaCl + KBr');
      expect(result2.type).toBe('double-replacement');
    });

    test('should identify precipitation reactions', () => {
      const result = classifyReaction('NaCl + AgNO3 -> NaNO3 + AgCl');
      expect(['precipitation', 'double-replacement']).toContain(result.type);
    });

    test('should identify precipitation with BaSO4', () => {
      const result = classifyReaction('BaCl2 + Na2SO4 -> BaSO4 + NaCl');
      expect(result.type).toBe('precipitation');
    });

    test('should identify precipitation with CaCO3', () => {
      const result = classifyReaction('CaCl2 + Na2CO3 -> CaCO3 + NaCl');
      expect(result.type).toBe('precipitation');
    });

    test('should classify redox reactions', () => {
      const result = classifyReaction('Fe + Cl2 -> FeCl3');
      expect(['redox', 'synthesis']).toContain(result.type);
    });

    test('should return typeName in current locale', () => {
      const result = classifyReaction('CH4 + O2 -> CO2 + H2O');
      expect(result.typeName).toBeDefined();
      expect(typeof result.typeName).toBe('string');
    });

    test('should return reason for classification', () => {
      const result = classifyReaction('CH4 + O2 -> CO2 + H2O');
      expect(result.reason).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });

    test('should handle invalid equation format', () => {
      const result = classifyReaction('invalid equation');
      expect(result.type).toBe('unknown');
    });

    test('should return confidence level between 0 and 1', () => {
      const result = classifyReaction('CH4 + O2 -> CO2 + H2O');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    // Tests for redox detection through oxidation state changes
    test('should detect redox when metal is oxidized', () => {
      // Zn(0) -> Zn(+2) is oxidized
      const result = classifyReaction('Zn + HCl -> ZnCl2 + H2');
      expect(['redox', 'single-replacement']).toContain(result.type);
    });

    test('should classify reaction with Ca(OH)2 as base', () => {
      const result = classifyReaction('HNO3 + Ca(OH)2 -> Ca(NO3)2 + H2O');
      expect(result.type).toBe('acid-base');
    });
  });

  describe('Edge cases', () => {
    test('should handle equations with coefficients', () => {
      const result = classifyReaction('2H2 + O2 -> 2H2O');
      expect(result.type).toBe('synthesis');
    });

    test('should handle equations with different separators', () => {
      const result1 = classifyReaction('H2 + O2 => H2O');
      expect(result1.type).toBe('synthesis');

      const result2 = classifyReaction('H2 + O2 = H2O');
      expect(result2.type).toBe('synthesis');
    });

    test('should handle multiple products in combustion', () => {
      const result = classifyReaction('C3H8 + O2 -> CO2 + H2O');
      expect(result.type).toBe('combustion');
    });

    test('should handle combustion producing only CO2', () => {
      const result = classifyReaction('C + O2 -> CO2');
      expect(['combustion', 'synthesis']).toContain(result.type);
    });

    test('should handle equations with H pattern (not acid)', () => {
      const result = classifyReaction('H2 + Cl2 -> HCl');
      expect(result.type).toBe('synthesis');
    });

    test('should classify metal + oxygen reactions', () => {
      const result = classifyReaction('Mg + O2 -> MgO');
      expect(result.type).toBe('synthesis');
    });
  });
});



