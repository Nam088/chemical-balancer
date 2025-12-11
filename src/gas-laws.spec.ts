import { idealGasLaw, combinedGasLaw, molarVolume, STP, GAS_CONSTANT } from './gas-laws';

describe('Gas Laws Calculator', () => {
  describe('idealGasLaw', () => {
    test('should solve for volume at STP', () => {
      const result = idealGasLaw({ P: 1, PUnit: 'atm', n: 1, T: 273.15, TUnit: 'K' });
      expect(result.solvedFor).toBe('V');
      expect(result.V).toBeCloseTo(22.4, 0);
    });

    test('should solve for pressure', () => {
      const result = idealGasLaw({ V: 10, VUnit: 'L', n: 2, T: 300, TUnit: 'K' });
      expect(result.solvedFor).toBe('P');
      expect(result.P).toBeGreaterThan(0);
    });

    test('should solve for moles', () => {
      const result = idealGasLaw({ P: 1, PUnit: 'atm', V: 22.4, VUnit: 'L', T: 273.15, TUnit: 'K' });
      expect(result.solvedFor).toBe('n');
      expect(result.n).toBeCloseTo(1, 0);
    });

    test('should solve for temperature', () => {
      const result = idealGasLaw({ P: 1, PUnit: 'atm', V: 22.4, VUnit: 'L', n: 1 });
      expect(result.solvedFor).toBe('T');
      expect(result.T).toBeCloseTo(273.15, 0);
    });

    test('should convert temperature from Celsius', () => {
      const result = idealGasLaw({ P: 1, PUnit: 'atm', n: 1, T: 0, TUnit: 'C' });
      expect(result.T).toBeCloseTo(273.15, 0);
    });

    test('should throw error if not enough variables provided', () => {
      expect(() => idealGasLaw({ P: 1, V: 22.4 })).toThrow();
    });
  });

  describe('combinedGasLaw', () => {
    test('should solve for V2 when temperature doubles', () => {
      const result = combinedGasLaw({ P1: 1, V1: 10, T1: 300, P2: 1, T2: 600 });
      expect(result.solvedFor).toBe('V2');
      expect(result.V2).toBeCloseTo(20, 0);
    });

    test('should solve for P2 when volume halves', () => {
      const result = combinedGasLaw({ P1: 1, V1: 10, T1: 300, V2: 5, T2: 300 });
      expect(result.solvedFor).toBe('P2');
      expect(result.P2).toBeCloseTo(2, 0);
    });

    test('should throw error if not enough variables', () => {
      expect(() => combinedGasLaw({ P1: 1, V1: 10, T1: 300, P2: 1 })).toThrow();
    });
  });

  describe('molarVolume', () => {
    test('should calculate molar volume at STP', () => {
      const volume = molarVolume(273.15, 1);
      expect(volume).toBeCloseTo(22.4, 0);
    });
  });

  describe('STP constants', () => {
    test('should have correct STP values', () => {
      expect(STP.T).toBe(273.15);
      expect(STP.P).toBe(1);
      expect(STP.Vm).toBeCloseTo(22.414, 2);
    });
  });

  describe('GAS_CONSTANT', () => {
    test('should have correct R values', () => {
      expect(GAS_CONSTANT.L_atm).toBeCloseTo(0.0821, 2);
      expect(GAS_CONSTANT.J).toBeCloseTo(8.314, 2);
    });
  });
});
