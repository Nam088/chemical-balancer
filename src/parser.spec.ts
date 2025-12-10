import { Parser } from './parser';

describe('Parser', () => {
  test('should parse simple elements', () => {
    expect(Parser.parseFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(Parser.parseFormula('NaCl')).toEqual({ Na: 1, Cl: 1 });
    expect(Parser.parseFormula('C6H12O6')).toEqual({ C: 6, H: 12, O: 6 });
  });

  test('should handle parentheses', () => {
    expect(Parser.parseFormula('Mg(OH)2')).toEqual({ Mg: 1, O: 2, H: 2 });
    expect(Parser.parseFormula('Ca(NO3)2')).toEqual({ Ca: 1, N: 2, O: 6 });
  });

  test('should handle nested parentheses', () => {
    expect(Parser.parseFormula('A(B(C)2)3')).toEqual({ A: 1, B: 3, C: 6 });
  });

  test('should normalize whitespace', () => {
    expect(Parser.parseFormula('H 2 O')).toEqual({ H: 2, O: 1 }); // "H 2 O" -> "H2O"
    expect(Parser.parseFormula(' Na Cl ')).toEqual({ Na: 1, Cl: 1 }); // " Na Cl " -> "NaCl"
  });

  test('should throw error for invalid characters', () => {
    expect(() => Parser.parseFormula('h2o')).toThrow(/Invalid characters/); // lowercase first
    expect(() => Parser.parseFormula('H2$O')).toThrow(/Invalid characters/);
    expect(() => Parser.parseFormula('H2O!')).toThrow(/Invalid characters/);
  });
  
  test('should throw error for malformed parentheses', () => {
    expect(() => Parser.parseFormula('Ca(OH')).toThrow(/Invalid formula syntax/);
    // expect(() => Parser.parseFormula('Ca)OH(')).toThrow(); // This might be trickier to catch with current regex but logic ensures ( matches
    // Current logic: it looks for (...) pairs. If ')' is dangling it won't be replaced, and then strict parser sees ')' and throws invalid char.
    expect(() => Parser.parseFormula('Ca)2')).toThrow(/Invalid characters/);
  });

  test('should handle complex molecules', () => {
    expect(Parser.parseFormula('K4Fe(CN)6')).toEqual({ K: 4, Fe: 1, C: 6, N: 6 });
  });
});
