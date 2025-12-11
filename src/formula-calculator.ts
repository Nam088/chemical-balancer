/**
 * Formula Calculator
 * Calculates empirical and molecular formulas from composition data.
 */

import { ELEMENTS, getAtomicMass } from './elements';
import { CalculationError } from './errors';
import { t } from './i18n';

/**
 * Element composition data for empirical formula calculation.
 */
export interface ElementComposition {
  /** Element symbol */
  element: string;
  /** Mass percentage (0-100) OR mass in grams */
  mass: number;
  /** Unit of mass value */
  unit: 'percent' | 'grams';
}

/**
 * Result of empirical formula calculation.
 */
export interface EmpiricalFormulaResult {
  /** Empirical formula string (e.g., 'CH2O') */
  formula: string;
  /** Molar mass of empirical formula */
  molarMass: number;
  /** Element ratios used */
  ratios: Record<string, number>;
  /** Step-by-step calculation */
  steps: string[];
}

/**
 * Result of molecular formula calculation.
 */
export interface MolecularFormulaResult {
  /** Molecular formula string (e.g., 'C6H12O6') */
  formula: string;
  /** Molar mass of molecular formula */
  molarMass: number;
  /** Multiplier from empirical to molecular formula */
  multiplier: number;
  /** The empirical formula used */
  empiricalFormula: string;
}

/**
 * Calculates the empirical formula from mass or percentage composition.
 *
 * @param composition - Array of element compositions
 * @returns EmpiricalFormulaResult with formula and calculation steps
 *
 * @example
 * ```typescript
 * // From mass percentages
 * calculateEmpiricalFormula([
 *   { element: 'C', mass: 40.0, unit: 'percent' },
 *   { element: 'H', mass: 6.7, unit: 'percent' },
 *   { element: 'O', mass: 53.3, unit: 'percent' }
 * ])
 * // { formula: 'CH2O', molarMass: 30.03, ... }
 *
 * // From grams
 * calculateEmpiricalFormula([
 *   { element: 'C', mass: 12.0, unit: 'grams' },
 *   { element: 'H', mass: 2.0, unit: 'grams' },
 *   { element: 'O', mass: 16.0, unit: 'grams' }
 * ])
 * // { formula: 'CH2O', molarMass: 30.03, ... }
 * ```
 */
export function calculateEmpiricalFormula(
  composition: ElementComposition[]
): EmpiricalFormulaResult {
  const steps: string[] = [];

  // Step 1: Convert mass to moles
  const moles: Record<string, number> = {};

  for (const comp of composition) {
    const atomicMass = getAtomicMass(comp.element);
    if (!atomicMass) {
      throw new CalculationError(t('error.unknown_element', { element: comp.element, formula: comp.element }));
    }

    // For percentages, assume 100g sample
    const massInGrams = comp.unit === 'percent' ? comp.mass : comp.mass;
    const molesValue = massInGrams / atomicMass;
    moles[comp.element] = molesValue;

    steps.push(
      `${comp.element}: ${massInGrams.toFixed(2)}g ÷ ${atomicMass.toFixed(2)} g/mol = ${molesValue.toFixed(4)} mol`
    );
  }

  // Step 2: Find the smallest mole value
  const minMoles = Math.min(...Object.values(moles));
  steps.push(`Smallest moles: ${minMoles.toFixed(4)} mol`);

  // Step 3: Divide all moles by the smallest
  const ratios: Record<string, number> = {};
  for (const [element, mol] of Object.entries(moles)) {
    ratios[element] = mol / minMoles;
    steps.push(`${element}: ${mol.toFixed(4)} ÷ ${minMoles.toFixed(4)} = ${ratios[element].toFixed(2)}`);
  }

  // Step 4: Round to nearest whole numbers (or find multiplier for fractions)
  const roundedRatios: Record<string, number> = {};
  let multiplier = 1;

  // Check if we need to multiply to get whole numbers
  const fractionalParts = Object.values(ratios).map(r => r - Math.floor(r));
  const hasSignificantFraction = fractionalParts.some(f => f > 0.1 && f < 0.9);

  if (hasSignificantFraction) {
    // Try multipliers 2, 3, 4 to find whole numbers
    for (const mult of [2, 3, 4, 5, 6]) {
      const allWhole = Object.values(ratios).every(r => {
        const scaled = r * mult;
        return Math.abs(scaled - Math.round(scaled)) < 0.1;
      });
      if (allWhole) {
        multiplier = mult;
        break;
      }
    }
  }

  for (const [element, ratio] of Object.entries(ratios)) {
    roundedRatios[element] = Math.round(ratio * multiplier);
  }

  if (multiplier > 1) {
    steps.push(`Multiplied by ${multiplier} to get whole numbers`);
  }

  // Step 5: Reduce by GCD if possible
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let commonGcd = Object.values(roundedRatios)[0];
  for (const val of Object.values(roundedRatios)) {
    commonGcd = gcd(commonGcd, val);
  }

  if (commonGcd > 1) {
    for (const element of Object.keys(roundedRatios)) {
      roundedRatios[element] /= commonGcd;
    }
    steps.push(`Reduced by GCD of ${commonGcd}`);
  }

  // Step 6: Build formula string
  // Sort elements: C first, then H, then alphabetically
  const sortedElements = Object.keys(roundedRatios).sort((a, b) => {
    if (a === 'C') return -1;
    if (b === 'C') return 1;
    if (a === 'H') return -1;
    if (b === 'H') return 1;
    return a.localeCompare(b);
  });

  let formula = '';
  for (const element of sortedElements) {
    const count = roundedRatios[element];
    formula += element + (count > 1 ? count.toString() : '');
  }

  // Step 7: Calculate molar mass
  let molarMass = 0;
  for (const [element, count] of Object.entries(roundedRatios)) {
    const atomicMass = getAtomicMass(element)!;
    molarMass += atomicMass * count;
  }

  steps.push(`Empirical formula: ${formula} (${molarMass.toFixed(2)} g/mol)`);

  return {
    formula,
    molarMass: Math.round(molarMass * 100) / 100,
    ratios: roundedRatios,
    steps,
  };
}

/**
 * Calculates the molecular formula from an empirical formula and molar mass.
 *
 * @param empiricalFormula - Empirical formula string (e.g., 'CH2O')
 * @param actualMolarMass - Actual molar mass of the compound
 * @returns MolecularFormulaResult with molecular formula
 *
 * @example
 * ```typescript
 * calculateMolecularFormula('CH2O', 180.16)
 * // { formula: 'C6H12O6', multiplier: 6 }
 * ```
 */
export function calculateMolecularFormula(
  empiricalFormula: string,
  actualMolarMass: number
): MolecularFormulaResult {
  // Parse empirical formula to get element counts
  const { Parser } = require('./parser');
  const elements = Parser.parseFormula(empiricalFormula);

  // Calculate empirical molar mass
  let empiricalMolarMass = 0;
  for (const [element, count] of Object.entries(elements)) {
    if (element === '_Q') continue; // Skip charge
    const atomicMass = getAtomicMass(element);
    if (!atomicMass) {
      throw new CalculationError(`Unknown element: ${element}`);
    }
    empiricalMolarMass += atomicMass * (count as number);
  }

  // Calculate multiplier
  const multiplier = Math.round(actualMolarMass / empiricalMolarMass);

  if (multiplier < 1) {
    throw new CalculationError(t('error.invalid_input', { message: `molar mass ${actualMolarMass} < empirical mass ${empiricalMolarMass}` }));
  }

  // Build molecular formula
  const sortedElements = Object.keys(elements)
    .filter(e => e !== '_Q')
    .sort((a, b) => {
      if (a === 'C') return -1;
      if (b === 'C') return 1;
      if (a === 'H') return -1;
      if (b === 'H') return 1;
      return a.localeCompare(b);
    });

  let formula = '';
  for (const element of sortedElements) {
    const count = (elements[element] as number) * multiplier;
    formula += element + (count > 1 ? count.toString() : '');
  }

  return {
    formula,
    molarMass: actualMolarMass,
    multiplier,
    empiricalFormula,
  };
}

/**
 * Calculates the percent composition of a compound.
 *
 * @param formula - Chemical formula string
 * @returns Record of element symbols to mass percentages
 *
 * @example
 * ```typescript
 * calculatePercentComposition('H2O')
 * // { H: 11.19, O: 88.81 }
 *
 * calculatePercentComposition('C6H12O6')
 * // { C: 40.00, H: 6.71, O: 53.29 }
 * ```
 */
export function calculatePercentComposition(
  formula: string
): Record<string, number> {
  const { Parser } = require('./parser');
  const elements = Parser.parseFormula(formula);

  // Calculate total molar mass
  let totalMass = 0;
  const elementMasses: Record<string, number> = {};

  for (const [element, count] of Object.entries(elements)) {
    if (element === '_Q') continue;
    const atomicMass = getAtomicMass(element);
    if (!atomicMass) {
      throw new CalculationError(t('error.unknown_element', { element, formula }));
    }
    const mass = atomicMass * (count as number);
    elementMasses[element] = mass;
    totalMass += mass;
  }

  // Calculate percentages
  const percentages: Record<string, number> = {};
  for (const [element, mass] of Object.entries(elementMasses)) {
    percentages[element] = Math.round((mass / totalMass) * 10000) / 100;
  }

  return percentages;
}
