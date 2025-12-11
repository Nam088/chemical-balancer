import {
  ELEMENTS,
  isValidElement,
  getAtomicMass,
  getElectronegativity,
  getOxidationStates,
} from './elements';

describe('Elements Database', () => {
  describe('ELEMENTS constant', () => {
    test('should contain all 118+ elements', () => {
      expect(Object.keys(ELEMENTS).length).toBeGreaterThanOrEqual(118);
    });

    test('should have correct data for Hydrogen', () => {
      expect(ELEMENTS.H).toBeDefined();
      expect(ELEMENTS.H.symbol).toBe('H');
      expect(ELEMENTS.H.atomicNumber).toBe(1);
      expect(ELEMENTS.H.atomicMass).toBeCloseTo(1.008, 2);
    });

    test('should have correct data for Carbon', () => {
      expect(ELEMENTS.C).toBeDefined();
      expect(ELEMENTS.C.symbol).toBe('C');
      expect(ELEMENTS.C.atomicNumber).toBe(6);
      expect(ELEMENTS.C.atomicMass).toBeCloseTo(12.011, 2);
    });

    test('should have correct data for Oxygen', () => {
      expect(ELEMENTS.O).toBeDefined();
      expect(ELEMENTS.O.symbol).toBe('O');
      expect(ELEMENTS.O.atomicNumber).toBe(8);
      expect(ELEMENTS.O.atomicMass).toBeCloseTo(15.999, 2);
    });

    test('should have correct data for Iron', () => {
      expect(ELEMENTS.Fe).toBeDefined();
      expect(ELEMENTS.Fe.symbol).toBe('Fe');
      expect(ELEMENTS.Fe.atomicNumber).toBe(26);
    });

    test('should have oxidation states for elements', () => {
      expect(ELEMENTS.Na.oxidationStates).toContain(1);
      expect(ELEMENTS.Cl.oxidationStates).toContain(-1);
      expect(ELEMENTS.Fe.oxidationStates).toContain(2);
      expect(ELEMENTS.Fe.oxidationStates).toContain(3);
    });

    test('should have electronegativity values', () => {
      expect(ELEMENTS.F.electronegativity).toBeCloseTo(3.98, 1);
      expect(ELEMENTS.O.electronegativity).toBeCloseTo(3.44, 1);
    });
  });

  describe('isValidElement', () => {
    test('should return true for valid elements', () => {
      expect(isValidElement('H')).toBe(true);
      expect(isValidElement('C')).toBe(true);
      expect(isValidElement('Fe')).toBe(true);
      expect(isValidElement('Na')).toBe(true);
    });

    test('should return false for invalid elements', () => {
      expect(isValidElement('Xx')).toBe(false);
      expect(isValidElement('Ab')).toBe(false);
      expect(isValidElement('')).toBe(false);
    });
  });

  describe('getAtomicMass', () => {
    test('should return atomic mass for valid elements', () => {
      expect(getAtomicMass('H')).toBeCloseTo(1.008, 2);
      expect(getAtomicMass('O')).toBeCloseTo(15.999, 2);
      expect(getAtomicMass('Na')).toBeCloseTo(22.990, 2);
    });

    test('should return undefined for invalid elements', () => {
      expect(getAtomicMass('Xx')).toBeUndefined();
    });
  });

  describe('getElectronegativity', () => {
    test('should return electronegativity for valid elements', () => {
      expect(getElectronegativity('F')).toBeCloseTo(3.98, 1);
      expect(getElectronegativity('O')).toBeCloseTo(3.44, 1);
      expect(getElectronegativity('H')).toBeCloseTo(2.20, 1);
    });

    test('should return undefined for invalid elements', () => {
      expect(getElectronegativity('Xx')).toBeUndefined();
    });
  });

  describe('getOxidationStates', () => {
    test('should return oxidation states for valid elements', () => {
      const naStates = getOxidationStates('Na');
      expect(naStates).toContain(1);

      const feStates = getOxidationStates('Fe');
      expect(feStates).toContain(2);
      expect(feStates).toContain(3);
    });

    test('should return undefined for invalid elements', () => {
      expect(getOxidationStates('Xx')).toBeUndefined();
    });
  });
});
