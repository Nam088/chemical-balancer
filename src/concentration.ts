/**
 * Concentration Calculator
 * Calculates molarity, molality, dilutions, and other concentration measures.
 */

import { CalculationError } from './errors';
import { t } from './i18n';
import { calculateMolarMass } from './molar-mass';

/**
 * Result of molarity calculation.
 */
export interface MolarityResult {
  /** Molarity in mol/L (M) */
  molarity: number;
  /** Moles of solute */
  moles: number;
  /** Volume in liters */
  liters: number;
  /** Formula used */
  formula: string;
}

/**
 * Result of dilution calculation.
 */
export interface DilutionResult {
  /** Initial molarity */
  M1: number;
  /** Initial volume in L */
  V1: number;
  /** Final molarity */
  M2: number;
  /** Final volume in L */
  V2: number;
  /** Which value was calculated */
  solvedFor: 'M1' | 'V1' | 'M2' | 'V2';
  /** Volume of solvent to add (V2 - V1) in L */
  volumeToAdd?: number;
}

/**
 * Result of molality calculation.
 */
export interface MolalityResult {
  /** Molality in mol/kg */
  molality: number;
  /** Moles of solute */
  moles: number;
  /** Mass of solvent in kg */
  solventMassKg: number;
}

/**
 * Calculates molarity (M = n/V).
 *
 * @param moles - Moles of solute
 * @param liters - Volume of solution in liters
 * @returns MolarityResult
 *
 * @example
 * ```typescript
 * calculateMolarity(0.5, 2)
 * // { molarity: 0.25, moles: 0.5, liters: 2 }
 * ```
 */
export function calculateMolarity(moles: number, liters: number): MolarityResult {
  if (liters <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const molarity = moles / liters;

  return {
    molarity: Math.round(molarity * 10000) / 10000,
    moles,
    liters,
    formula: `M = n/V = ${moles}/${liters} = ${molarity.toFixed(4)} M`,
  };
}

/**
 * Calculates molarity from mass of solute and formula.
 *
 * @param massGrams - Mass of solute in grams
 * @param formula - Chemical formula of solute
 * @param liters - Volume of solution in liters
 * @returns MolarityResult
 *
 * @example
 * ```typescript
 * calculateMolarityFromMass(58.44, 'NaCl', 1)
 * // { molarity: 1.0, ... }
 * ```
 */
export function calculateMolarityFromMass(
  massGrams: number,
  formula: string,
  liters: number
): MolarityResult {
  const molarMass = calculateMolarMass(formula);
  const moles = massGrams / molarMass;
  return calculateMolarity(moles, liters);
}

/**
 * Input for dilution calculation.
 * Provide 3 of 4 variables to solve for the fourth.
 */
export interface DilutionInput {
  /** Initial molarity */
  M1?: number;
  /** Initial volume in L (or mL if VUnit is 'mL') */
  V1?: number;
  /** Final molarity */
  M2?: number;
  /** Final volume in L (or mL if VUnit is 'mL') */
  V2?: number;
  /** Volume unit (default: 'L') */
  VUnit?: 'L' | 'mL';
}

/**
 * Calculates dilution using M1V1 = M2V2.
 *
 * @param input - Object with 3 of 4 variables (M1, V1, M2, V2)
 * @returns DilutionResult with all 4 variables
 *
 * @example
 * ```typescript
 * // How much volume to dilute 10 mL of 6M to 2M?
 * calculateDilution({ M1: 6, V1: 0.01, M2: 2 })
 * // { V2: 0.03, volumeToAdd: 0.02, ... }
 *
 * // What molarity if 100 mL diluted to 500 mL?
 * calculateDilution({ M1: 6, V1: 0.1, V2: 0.5 })
 * // { M2: 1.2, ... }
 * ```
 */
export function calculateDilution(input: DilutionInput): DilutionResult {
  let { M1, V1, M2, V2 } = input;
  const VUnit = input.VUnit || 'L';

  // Convert mL to L if needed
  if (VUnit === 'mL') {
    if (V1 !== undefined) V1 = V1 / 1000;
    if (V2 !== undefined) V2 = V2 / 1000;
  }

  // Count provided variables
  const provided = [M1, V1, M2, V2].filter(x => x !== undefined).length;

  if (provided !== 3) {
    throw new CalculationError(t('error.missing_variables', { variables: 'M1, V1, M2, V2' }));
  }

  let solvedFor: 'M1' | 'V1' | 'M2' | 'V2';
  let result: { M1: number; V1: number; M2: number; V2: number };

  // M1V1 = M2V2
  if (M1 === undefined) {
    M1 = (M2! * V2!) / V1!;
    result = { M1, V1: V1!, M2: M2!, V2: V2! };
    solvedFor = 'M1';
  } else if (V1 === undefined) {
    V1 = (M2! * V2!) / M1;
    result = { M1, V1, M2: M2!, V2: V2! };
    solvedFor = 'V1';
  } else if (M2 === undefined) {
    M2 = (M1 * V1) / V2!;
    result = { M1, V1, M2, V2: V2! };
    solvedFor = 'M2';
  } else {
    V2 = (M1 * V1) / M2;
    result = { M1, V1, M2, V2 };
    solvedFor = 'V2';
  }

  if (result.M2 > result.M1) {
    throw new CalculationError(t('error.invalid_dilution'));
  }

  // Round results
  result.M1 = Math.round(result.M1 * 10000) / 10000;
  result.V1 = Math.round(result.V1 * 10000) / 10000;
  result.M2 = Math.round(result.M2 * 10000) / 10000;
  result.V2 = Math.round(result.V2 * 10000) / 10000;

  const volumeToAdd = result.V2 - result.V1;

  return {
    ...result,
    solvedFor,
    volumeToAdd: volumeToAdd > 0 ? Math.round(volumeToAdd * 10000) / 10000 : undefined,
  };
}

/**
 * Calculates molality (m = n/kg solvent).
 *
 * @param moles - Moles of solute
 * @param solventMassKg - Mass of solvent in kilograms
 * @returns MolalityResult
 *
 * @example
 * ```typescript
 * calculateMolality(0.5, 1)
 * // { molality: 0.5, moles: 0.5, solventMassKg: 1 }
 * ```
 */
export function calculateMolality(moles: number, solventMassKg: number): MolalityResult {
  if (solventMassKg <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const molality = moles / solventMassKg;

  return {
    molality: Math.round(molality * 10000) / 10000,
    moles,
    solventMassKg,
  };
}

/**
 * Calculates mole fraction of a component in a solution.
 *
 * @param molesSolute - Moles of solute
 * @param molesSolvent - Moles of solvent
 * @returns Object with mole fractions of solute and solvent
 *
 * @example
 * ```typescript
 * calculateMoleFraction(1, 9)
 * // { soluteFraction: 0.1, solventFraction: 0.9 }
 * ```
 */
export function calculateMoleFraction(
  molesSolute: number,
  molesSolvent: number
): { soluteFraction: number; solventFraction: number } {
  const total = molesSolute + molesSolvent;

  if (total <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  return {
    soluteFraction: Math.round((molesSolute / total) * 10000) / 10000,
    solventFraction: Math.round((molesSolvent / total) * 10000) / 10000,
  };
}

/**
 * Converts between molarity and molality.
 *
 * @param molarity - Molarity of solution (mol/L)
 * @param soluteMolarMass - Molar mass of solute (g/mol)
 * @param solutionDensity - Density of solution (g/mL)
 * @returns Molality in mol/kg
 */
export function molarityToMolality(
  molarity: number,
  soluteMolarMass: number,
  solutionDensity: number
): number {
  // Mass of 1L of solution = density * 1000 (g)
  // Mass of solute in 1L = molarity * molar mass (g)
  // Mass of solvent = mass of solution - mass of solute (g)
  // Molality = moles / kg solvent

  const massOfSolution = solutionDensity * 1000; // g
  const massOfSolute = molarity * soluteMolarMass; // g
  const massOfSolvent = massOfSolution - massOfSolute; // g
  const kgSolvent = massOfSolvent / 1000; // kg

  const molality = molarity / kgSolvent; // mol/kg

  return Math.round(molality * 10000) / 10000;
}

/**
 * Calculates parts per million (ppm) from mass.
 *
 * @param soluteMassG - Mass of solute in grams
 * @param solutionMassG - Total mass of solution in grams
 * @returns Concentration in ppm
 */
export function calculatePPM(soluteMassG: number, solutionMassG: number): number {
  return (soluteMassG / solutionMassG) * 1_000_000;
}

/**
 * Calculates mass needed for a given molarity.
 *
 * @param molarity - Desired molarity (M)
 * @param volumeL - Volume in liters
 * @param formula - Chemical formula of solute
 * @returns Mass in grams needed
 */
export function massForMolarity(molarity: number, volumeL: number, formula: string): number {
  const molarMass = calculateMolarMass(formula);
  const moles = molarity * volumeL;
  return Math.round(moles * molarMass * 1000) / 1000;
}
