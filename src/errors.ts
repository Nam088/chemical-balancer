/**
 * Error codes for the chemical balancer library.
 */
export type ChemicalErrorCode =
  | 'PARSE_ERROR'
  | 'INVALID_ELEMENT'
  | 'INVALID_FORMULA'
  | 'INVALID_SUBSCRIPT'
  | 'INVALID_STATE'
  | 'BALANCE_ERROR'
  | 'NO_SOLUTION'
  | 'INVALID_EQUATION'
  | 'MOLECULE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CALCULATION_ERROR';

/**
 * Base error class for all chemical equation errors.
 * Provides structured error handling with error codes.
 *
 * @example
 * ```typescript
 * try {
 *   ChemicalBalancer.balance('invalid');
 * } catch (error) {
 *   if (error instanceof ChemicalEquationError) {
 *     console.log(error.code); // 'INVALID_EQUATION'
 *   }
 * }
 * ```
 */
export class ChemicalEquationError extends Error {
  constructor(
    public readonly code: ChemicalErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ChemicalEquationError';
    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChemicalEquationError);
    }
  }
}

/**
 * Error thrown when parsing a chemical formula fails.
 */
export class ParseError extends ChemicalEquationError {
  constructor(
    message: string,
    public readonly formula?: string,
  ) {
    super('PARSE_ERROR', message);
    this.name = 'ParseError';
  }
}

/**
 * Error thrown when balancing an equation fails.
 */
export class BalanceError extends ChemicalEquationError {
  constructor(
    message: string,
    public readonly equation?: string,
  ) {
    super('BALANCE_ERROR', message);
    this.name = 'BalanceError';
  }
}

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends ChemicalEquationError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super('VALIDATION_ERROR', message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a calculation cannot be completed.
 */
export class CalculationError extends ChemicalEquationError {
  constructor(message: string) {
    super('CALCULATION_ERROR', message);
    this.name = 'CalculationError';
  }
}
