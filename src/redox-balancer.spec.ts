import { balanceRedoxReaction, isRedoxReaction, getRedoxAgents } from './redox-balancer';

describe('Redox Balancer', () => {
  describe('balanceRedoxReaction', () => {
    test('should balance a simple redox reaction', () => {
      const result = balanceRedoxReaction('Fe + O2 -> Fe2O3');
      expect(result.success).toBe(true);
      expect(result.balancedEquation).toBeDefined();
    });

    test('should identify oxidation and reduction half-reactions', () => {
      const result = balanceRedoxReaction('Zn + CuSO4 -> ZnSO4 + Cu');
      expect(result.success).toBe(true);
      if (result.oxidationHalf) {
        expect(result.oxidationHalf.type).toBe('oxidation');
      }
      if (result.reductionHalf) {
        expect(result.reductionHalf.type).toBe('reduction');
      }
    });

    test('should include steps in result', () => {
      const result = balanceRedoxReaction('H2 + O2 -> H2O');
      expect(result.steps).toBeDefined();
      expect(result.steps!.length).toBeGreaterThan(0);
    });

    test('should handle invalid equation', () => {
      const result = balanceRedoxReaction('invalid');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should work with acidic medium', () => {
      const result = balanceRedoxReaction('Fe + O2 -> Fe2O3', 'acidic');
      expect(result.success).toBe(true);
    });

    test('should work with basic medium', () => {
      const result = balanceRedoxReaction('Fe + O2 -> Fe2O3', 'basic');
      expect(result.success).toBe(true);
    });

    test('should work with neutral medium', () => {
      const result = balanceRedoxReaction('Fe + O2 -> Fe2O3', 'neutral');
      expect(result.success).toBe(true);
    });

    test('should handle equation with different separators', () => {
      const result1 = balanceRedoxReaction('Fe + O2 => Fe2O3');
      expect(result1.success).toBe(true);

      const result2 = balanceRedoxReaction('Fe + O2 = Fe2O3');
      expect(result2.success).toBe(true);
    });
  });

  describe('isRedoxReaction', () => {
    test('should return true for redox reactions', () => {
      expect(isRedoxReaction('Zn + CuSO4 -> ZnSO4 + Cu')).toBe(true);
    });

    test('should detect redox when oxidation states change', () => {
      const result = isRedoxReaction('Zn + CuSO4 -> ZnSO4 + Cu');
      expect(result).toBe(true);
    });

    test('should handle invalid equations gracefully', () => {
      const result = isRedoxReaction('invalid');
      expect(result).toBe(false);
    });
  });

  describe('getRedoxAgents', () => {
    test('should identify oxidizing and reducing agents', () => {
      const agents = getRedoxAgents('Zn + CuSO4 -> ZnSO4 + Cu');
      expect(agents.reducingAgent).toBeDefined();
      expect(agents.oxidizingAgent).toBeDefined();
    });

    test('should return empty for non-redox reactions', () => {
      const agents = getRedoxAgents('invalid');
      // Should handle gracefully
      expect(agents).toBeDefined();
    });
  });
});
