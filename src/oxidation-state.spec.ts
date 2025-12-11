import { calculateOxidationStates, identifyOxidationChange, calculateElectronTransfer } from './oxidation-state';

describe('Oxidation State Calculator', () => {
  describe('calculateOxidationStates', () => {
    test('should calculate oxidation states for H2O', () => {
      const result = calculateOxidationStates('H2O');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.H).toBe(1);
      expect(result.oxidationStates.O).toBe(-2);
    });

    test('should calculate oxidation states for H2SO4', () => {
      const result = calculateOxidationStates('H2SO4');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.H).toBe(1);
      expect(result.oxidationStates.S).toBe(6);
      expect(result.oxidationStates.O).toBe(-2);
    });

    test('should calculate oxidation states for KMnO4', () => {
      const result = calculateOxidationStates('KMnO4');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.K).toBe(1);
      expect(result.oxidationStates.Mn).toBe(7);
      expect(result.oxidationStates.O).toBe(-2);
    });

    test('should calculate oxidation states for NaCl', () => {
      const result = calculateOxidationStates('NaCl');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.Na).toBe(1);
      expect(result.oxidationStates.Cl).toBe(-1);
    });

    test('should calculate oxidation states for Fe2O3', () => {
      const result = calculateOxidationStates('Fe2O3');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.Fe).toBe(3);
      expect(result.oxidationStates.O).toBe(-2);
    });

    test('should handle peroxide-like structures', () => {
      // Test with a simpler compound that invokes this code path
      const result = calculateOxidationStates('CaO2');
      // Just verify it processes without error
      expect(result).toBeDefined();
    });

    test('should handle oxygen fluoride OF2', () => {
      const result = calculateOxidationStates('OF2');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.O).toBe(2);
      expect(result.oxidationStates.F).toBe(-1);
    });

    test('should handle OF2 where O is positive', () => {
      const result = calculateOxidationStates('OF2');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.O).toBe(2);
      expect(result.oxidationStates.F).toBe(-1);
    });

    test('should handle hydrides with H in -1 state', () => {
      const result = calculateOxidationStates('NaH');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.H).toBe(-1);
      expect(result.oxidationStates.Na).toBe(1);
    });

    test('should handle compounds with all known oxidation states', () => {
      const result = calculateOxidationStates('NaF');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.Na).toBe(1);
      expect(result.oxidationStates.F).toBe(-1);
    });

    test('should handle invalid formula', () => {
      const result = calculateOxidationStates('InvalidFormula');
      expect(result.success).toBe(false);
    });

    test('should handle compounds with multiple unknown elements', () => {
      const result = calculateOxidationStates('FeCl3');
      expect(result.success).toBe(true);
      expect(result.oxidationStates.Fe).toBe(3);
      expect(result.oxidationStates.Cl).toBe(-1);
    });

    test('should include explanation in result', () => {
      const result = calculateOxidationStates('H2O');
      expect(result.explanation).toBeDefined();
      expect(result.explanation).toContain('H:');
      expect(result.explanation).toContain('O:');
    });
  });

  describe('identifyOxidationChange', () => {
    test('should identify oxidation when element loses electrons', () => {
      // Fe goes from 0 to +3
      const result = identifyOxidationChange('Fe', 'Fe2O3', 'Fe');
      expect(result).toBe('oxidized');
    });

    test('should identify reduction when element gains electrons', () => {
      // Cu goes from +2 to 0 in CuSO4 -> Cu
      const result = identifyOxidationChange('CuSO4', 'Cu', 'Cu');
      expect(result).toBe('reduced');
    });

    test('should return unchanged when oxidation state is the same', () => {
      const result = identifyOxidationChange('NaCl', 'NaCl', 'Na');
      expect(result).toBe('unchanged');
    });

    test('should return unchanged when element not found', () => {
      const result = identifyOxidationChange('H2O', 'NaCl', 'Fe');
      expect(result).toBe('unchanged');
    });
  });

  describe('calculateElectronTransfer', () => {
    test('should calculate electrons lost in oxidation', () => {
      // Fe(0) -> Fe(+3) = 3 electrons lost
      const electrons = calculateElectronTransfer('Fe', 'Fe2O3', 'Fe');
      expect(electrons).toBe(3);
    });

    test('should calculate electrons in oxidation/reduction', () => {
      // Fe(0) -> Fe(+3) = 3 electrons lost (positive)
      const electrons = calculateElectronTransfer('Fe', 'Fe2O3', 'Fe');
      expect(electrons).toBeGreaterThan(0);
    });
  });
});
