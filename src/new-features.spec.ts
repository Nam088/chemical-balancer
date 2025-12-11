import { Parser } from './parser';
import { calculateMolarMass, calculateMolarMassDetailed } from './molar-mass';
import { classifyReaction } from './reaction-classifier';
import { calculateStoichiometry } from './stoichiometry';
import { findLimitingReagent } from './limiting-reagent';

describe('State Annotations', () => {
  test('should parse formula with state annotation', () => {
    const result = Parser.parseFormulaWithState('H2O(l)');
    expect(result.elements).toEqual({ H: 2, O: 1 });
    expect(result.state).toBe('l');
  });

  test('should parse formula with aqueous state', () => {
    const result = Parser.parseFormulaWithState('NaCl(aq)');
    expect(result.elements).toEqual({ Na: 1, Cl: 1 });
    expect(result.state).toBe('aq');
  });

  test('should parse formula with solid state', () => {
    const result = Parser.parseFormulaWithState('Fe2O3(s)');
    expect(result.elements).toEqual({ Fe: 2, O: 3 });
    expect(result.state).toBe('s');
  });

  test('should parse formula with gas state', () => {
    const result = Parser.parseFormulaWithState('CO2(g)');
    expect(result.elements).toEqual({ C: 1, O: 2 });
    expect(result.state).toBe('g');
  });

  test('should parse formula without state', () => {
    const result = Parser.parseFormulaWithState('H2O');
    expect(result.elements).toEqual({ H: 2, O: 1 });
    expect(result.state).toBeUndefined();
  });

  test('parseFormula should still return ElementCounts only', () => {
    const result = Parser.parseFormula('H2O(l)');
    expect(result).toEqual({ H: 2, O: 1 });
  });
});

describe('Molar Mass Calculator', () => {
  test('should calculate molar mass of water', () => {
    expect(calculateMolarMass('H2O')).toBeCloseTo(18.015, 2);
  });

  test('should calculate molar mass of NaCl', () => {
    expect(calculateMolarMass('NaCl')).toBeCloseTo(58.44, 1);
  });

  test('should calculate molar mass of glucose', () => {
    expect(calculateMolarMass('C6H12O6')).toBeCloseTo(180.16, 1);
  });

  test('should calculate molar mass of sulfuric acid', () => {
    expect(calculateMolarMass('H2SO4')).toBeCloseTo(98.08, 1);
  });

  test('should return detailed breakdown', () => {
    const result = calculateMolarMassDetailed('H2O');
    expect(result.breakdown).toHaveProperty('H');
    expect(result.breakdown).toHaveProperty('O');
    expect(result.breakdown.H.count).toBe(2);
    expect(result.breakdown.O.count).toBe(1);
  });

  test('should handle complex molecules', () => {
    expect(calculateMolarMass('Ca(OH)2')).toBeCloseTo(74.09, 1);
  });
});

describe('Reaction Classifier', () => {
  test('should classify combustion reactions', () => {
    const result = classifyReaction('CH4 + O2 -> CO2 + H2O');
    expect(result.type).toBe('combustion');
  });

  test('should classify acid-base reactions', () => {
    const result = classifyReaction('HCl + NaOH -> NaCl + H2O');
    expect(result.type).toBe('acid-base');
  });

  test('should classify decomposition reactions', () => {
    const result = classifyReaction('CaCO3 -> CaO + CO2');
    expect(result.type).toBe('decomposition');
  });

  test('should classify synthesis reactions', () => {
    const result = classifyReaction('Na + Cl2 -> NaCl');
    expect(result.type).toBe('synthesis');
  });

  test('should classify single replacement', () => {
    const result = classifyReaction('Zn + CuSO4 -> ZnSO4 + Cu');
    expect(result.type).toBe('single-replacement');
  });
});

describe('Stoichiometry Calculator', () => {
  test('should calculate product amount from reactant moles', () => {
    const result = calculateStoichiometry({
      equation: 'H2 + O2 -> H2O',
      given: { molecule: 'H2', amount: 2, unit: 'mol' },
      find: { molecule: 'H2O', unit: 'mol' },
    });
    expect(result.amount).toBe(2);
  });

  test('should convert grams to moles', () => {
    const result = calculateStoichiometry({
      equation: 'H2 + O2 -> H2O',
      given: { molecule: 'H2', amount: 4.032, unit: 'g' }, // 2 moles of H2
      find: { molecule: 'H2O', unit: 'mol' },
    });
    expect(result.amount).toBeCloseTo(2, 1);
  });

  test('should convert result to grams', () => {
    const result = calculateStoichiometry({
      equation: 'H2 + O2 -> H2O',
      given: { molecule: 'H2', amount: 2, unit: 'mol' },
      find: { molecule: 'H2O', unit: 'g' },
    });
    expect(result.amount).toBeCloseTo(36.03, 1);
  });
});

describe('Limiting Reagent', () => {
  test('should find limiting reagent', () => {
    const result = findLimitingReagent({
      equation: 'H2 + O2 -> H2O',
      reagents: [
        { molecule: 'H2', amount: 4, unit: 'mol' },
        { molecule: 'O2', amount: 1, unit: 'mol' },
      ],
    });
    expect(result.limiting).toBe('O2');
  });

  test('should calculate excess amount', () => {
    const result = findLimitingReagent({
      equation: 'H2 + O2 -> H2O',
      reagents: [
        { molecule: 'H2', amount: 4, unit: 'mol' },
        { molecule: 'O2', amount: 1, unit: 'mol' },
      ],
    });
    // 2H2 + O2 -> 2H2O, so 1 mol O2 needs 2 mol H2, leaving 2 mol H2 excess
    expect(result.excess[0].molecule).toBe('H2');
    expect(result.excess[0].remaining).toBe(2);
  });
});
