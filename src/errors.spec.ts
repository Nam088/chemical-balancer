import {
  ChemicalEquationError,
  ParseError,
  BalanceError,
  ValidationError,
  CalculationError,
} from './errors';

describe('Custom Error Classes', () => {
  describe('ChemicalEquationError', () => {
    test('should create error with code and message', () => {
      const error = new ChemicalEquationError('PARSE_ERROR', 'Test error');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('PARSE_ERROR');
      expect(error.name).toBe('ChemicalEquationError');
    });

    test('should be instanceof Error', () => {
      const error = new ChemicalEquationError('BALANCE_ERROR', 'Test error');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ChemicalEquationError).toBe(true);
    });
  });

  describe('ParseError', () => {
    test('should create parse error with default code', () => {
      const error = new ParseError('Invalid formula');
      expect(error.message).toBe('Invalid formula');
      expect(error.code).toBe('PARSE_ERROR');
      expect(error.name).toBe('ParseError');
    });

    test('should accept optional formula parameter', () => {
      const error = new ParseError('Invalid formula', 'H2O2O');
      expect(error.formula).toBe('H2O2O');
    });

    test('should be instanceof ChemicalEquationError', () => {
      const error = new ParseError('Test');
      expect(error instanceof ChemicalEquationError).toBe(true);
    });
  });

  describe('BalanceError', () => {
    test('should create balance error with default code', () => {
      const error = new BalanceError('Cannot balance');
      expect(error.message).toBe('Cannot balance');
      expect(error.code).toBe('BALANCE_ERROR');
      expect(error.name).toBe('BalanceError');
    });

    test('should accept optional equation parameter', () => {
      const error = new BalanceError('Cannot balance', 'H2 + O2 -> H3O');
      expect(error.equation).toBe('H2 + O2 -> H3O');
    });

    test('should be instanceof ChemicalEquationError', () => {
      const error = new BalanceError('Test');
      expect(error instanceof ChemicalEquationError).toBe(true);
    });
  });

  describe('ValidationError', () => {
    test('should create validation error with default code', () => {
      const error = new ValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    test('should accept optional field parameter', () => {
      const error = new ValidationError('Invalid input', 'temperature');
      expect(error.field).toBe('temperature');
    });

    test('should be instanceof ChemicalEquationError', () => {
      const error = new ValidationError('Test');
      expect(error instanceof ChemicalEquationError).toBe(true);
    });
  });

  describe('CalculationError', () => {
    test('should create calculation error with default code', () => {
      const error = new CalculationError('Math error');
      expect(error.message).toBe('Math error');
      expect(error.code).toBe('CALCULATION_ERROR');
      expect(error.name).toBe('CalculationError');
    });

    test('should be instanceof ChemicalEquationError', () => {
      const error = new CalculationError('Test');
      expect(error instanceof ChemicalEquationError).toBe(true);
    });
  });
});

