import { Parser } from './parser';
import { t } from './i18n';
import { ELEMENTS, getAtomicMass as getAtomicMassFromElements } from './elements';

/**
 * Atomic masses for all elements (in g/mol).
 * Re-exported from elements.ts for backwards compatibility.
 * @deprecated Use getAtomicMass() from elements.ts instead
 */
export const ATOMIC_MASSES: Record<string, number> = Object.fromEntries(
  Object.entries(ELEMENTS).map(([symbol, data]) => [symbol, data.atomicMass])
);

/**
 * Result of molar mass calculation.
 */
export interface MolarMassResult {
  /** Total molar mass in g/mol */
  molarMass: number;
  /** Breakdown of mass contribution by element */
  breakdown: Record<string, { count: number; mass: number; total: number }>;
}

/**
 * Calculates the molar mass of a chemical formula.
 *
 * @param formula - Chemical formula string (e.g., 'H2O', 'NaCl', 'Ca(OH)2')
 * @returns Molar mass in g/mol
 *
 * @example
 * ```typescript
 * calculateMolarMass('H2O')   // 18.015
 * calculateMolarMass('NaCl')  // 58.44
 * calculateMolarMass('C6H12O6') // 180.16
 * ```
 */
export function calculateMolarMass(formula: string): number {
  return calculateMolarMassDetailed(formula).molarMass;
}

/**
 * Calculates the molar mass with detailed breakdown by element.
 *
 * @param formula - Chemical formula string
 * @returns MolarMassResult with total mass and element breakdown
 *
 * @example
 * ```typescript
 * calculateMolarMassDetailed('H2O')
 * // {
 * //   molarMass: 18.015,
 * //   breakdown: {
 * //     H: { count: 2, mass: 1.008, total: 2.016 },
 * //     O: { count: 1, mass: 16.00, total: 16.00 }
 * //   }
 * // }
 * ```
 */
export function calculateMolarMassDetailed(formula: string): MolarMassResult {
  const elements = Parser.parseFormula(formula);
  const breakdown: MolarMassResult['breakdown'] = {};
  let totalMass = 0;

  for (const [element, count] of Object.entries(elements)) {
    // Skip charge (_Q) which is used for ionic equations
    if (element === '_Q') continue;

    const atomicMass = ATOMIC_MASSES[element];
    if (atomicMass === undefined) {
      throw new Error(t('error.unknown_element_molar_mass', { element }));
    }

    const elementTotal = atomicMass * count;
    breakdown[element] = {
      count,
      mass: atomicMass,
      total: Math.round(elementTotal * 1000) / 1000, // Round to 3 decimal places
    };
    totalMass += elementTotal;
  }

  return {
    molarMass: Math.round(totalMass * 1000) / 1000, // Round to 3 decimal places
    breakdown,
  };
}
