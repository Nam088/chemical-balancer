/**
 * pH Calculator
 * Calculates pH, pOH, and related properties for acids and bases.
 */

import { CalculationError } from './errors';
import { t } from './i18n';

/**
 * Result of pH calculation.
 */
export interface pHResult {
  /** pH value */
  pH: number;
  /** pOH value */
  pOH: number;
  /** Hydrogen ion concentration [H+] in mol/L */
  hydrogenIon: number;
  /** Hydroxide ion concentration [OH-] in mol/L */
  hydroxideIon: number;
  /** Whether the solution is acidic, basic, or neutral */
  nature: 'acidic' | 'basic' | 'neutral';
}

/**
 * Result of Ka/Kb calculation.
 */
export interface AcidBaseConstantResult {
  /** Acid dissociation constant Ka */
  Ka?: number;
  /** pKa value */
  pKa?: number;
  /** Base dissociation constant Kb */
  Kb?: number;
  /** pKb value */
  pKb?: number;
  /** Percent ionization */
  percentIonization?: number;
}

/**
 * Water ionization constant at 25°C.
 */
export const Kw = 1e-14;

/**
 * Calculates pH from hydrogen ion concentration.
 *
 * @param hydrogenIonConcentration - [H+] in mol/L
 * @returns pHResult with pH, pOH, and ion concentrations
 *
 * @example
 * ```typescript
 * calculatePH(0.001)
 * // { pH: 3, pOH: 11, hydrogenIon: 0.001, hydroxideIon: 1e-11, nature: 'acidic' }
 * ```
 */
export function calculatePH(hydrogenIonConcentration: number): pHResult {
  if (hydrogenIonConcentration <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const pH = -Math.log10(hydrogenIonConcentration);
  const pOH = 14 - pH;
  const hydroxideIon = Kw / hydrogenIonConcentration;

  let nature: 'acidic' | 'basic' | 'neutral';
  if (pH < 6.99) {
    nature = 'acidic';
  } else if (pH > 7.01) {
    nature = 'basic';
  } else {
    nature = 'neutral';
  }

  return {
    pH: Math.round(pH * 1000) / 1000,
    pOH: Math.round(pOH * 1000) / 1000,
    hydrogenIon: hydrogenIonConcentration,
    hydroxideIon,
    nature,
  };
}

/**
 * Calculates pOH from hydroxide ion concentration.
 *
 * @param hydroxideIonConcentration - [OH-] in mol/L
 * @returns pHResult with pH, pOH, and ion concentrations
 *
 * @example
 * ```typescript
 * calculatePOH(0.001)
 * // { pH: 11, pOH: 3, ... }
 * ```
 */
export function calculatePOH(hydroxideIonConcentration: number): pHResult {
  if (hydroxideIonConcentration <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const pOH = -Math.log10(hydroxideIonConcentration);
  const pH = 14 - pOH;
  const hydrogenIon = Kw / hydroxideIonConcentration;

  let nature: 'acidic' | 'basic' | 'neutral';
  if (pH < 6.99) {
    nature = 'acidic';
  } else if (pH > 7.01) {
    nature = 'basic';
  } else {
    nature = 'neutral';
  }

  return {
    pH: Math.round(pH * 1000) / 1000,
    pOH: Math.round(pOH * 1000) / 1000,
    hydrogenIon,
    hydroxideIon: hydroxideIonConcentration,
    nature,
  };
}

/**
 * Calculates pH of a strong acid solution.
 * Strong acids completely dissociate: [H+] = concentration.
 *
 * @param concentration - Molarity of strong acid
 * @param protons - Number of H+ ions released per molecule (default: 1)
 * @returns pHResult
 *
 * @example
 * ```typescript
 * // 0.1 M HCl
 * strongAcidPH(0.1)
 * // { pH: 1, ... }
 *
 * // 0.1 M H2SO4 (diprotic)
 * strongAcidPH(0.1, 2)
 * // { pH: 0.7, ... }
 * ```
 */
export function strongAcidPH(concentration: number, protons: number = 1): pHResult {
  if (concentration <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const hydrogenIon = concentration * protons;
  return calculatePH(hydrogenIon);
}

/**
 * Calculates pH of a strong base solution.
 * Strong bases completely dissociate: [OH-] = concentration.
 *
 * @param concentration - Molarity of strong base
 * @param hydroxides - Number of OH- ions released per molecule (default: 1)
 * @returns pHResult
 *
 * @example
 * ```typescript
 * // 0.1 M NaOH
 * strongBasePH(0.1)
 * // { pH: 13, ... }
 *
 * // 0.1 M Ca(OH)2
 * strongBasePH(0.1, 2)
 * // { pH: 13.3, ... }
 * ```
 */
export function strongBasePH(concentration: number, hydroxides: number = 1): pHResult {
  if (concentration <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const hydroxideIon = concentration * hydroxides;
  return calculatePOH(hydroxideIon);
}

/**
 * Calculates pH of a weak acid solution using Ka.
 * Uses the approximation: [H+] ≈ √(Ka × C)
 *
 * @param concentration - Initial molarity of weak acid
 * @param Ka - Acid dissociation constant
 * @returns pHResult with percent ionization
 *
 * @example
 * ```typescript
 * // 0.1 M acetic acid (Ka = 1.8e-5)
 * weakAcidPH(0.1, 1.8e-5)
 * // { pH: 2.87, ... }
 * ```
 */
export function weakAcidPH(
  concentration: number,
  Ka: number
): pHResult & { percentIonization: number } {
  if (concentration <= 0 || Ka <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  // Check if approximation is valid (Ka/C < 0.05)
  let hydrogenIon: number;

  if (Ka / concentration < 0.05) {
    // Use approximation: [H+] = √(Ka × C)
    hydrogenIon = Math.sqrt(Ka * concentration);
  } else {
    // Use quadratic formula: x² + Ka×x - Ka×C = 0
    // x = (-Ka + √(Ka² + 4×Ka×C)) / 2
    hydrogenIon = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * concentration)) / 2;
  }

  const result = calculatePH(hydrogenIon);
  const percentIonization = (hydrogenIon / concentration) * 100;

  return {
    ...result,
    percentIonization: Math.round(percentIonization * 100) / 100,
  };
}

/**
 * Calculates pH of a weak base solution using Kb.
 * Uses the approximation: [OH-] ≈ √(Kb × C)
 *
 * @param concentration - Initial molarity of weak base
 * @param Kb - Base dissociation constant
 * @returns pHResult with percent ionization
 *
 * @example
 * ```typescript
 * // 0.1 M ammonia (Kb = 1.8e-5)
 * weakBasePH(0.1, 1.8e-5)
 * // { pH: 11.13, ... }
 * ```
 */
export function weakBasePH(
  concentration: number,
  Kb: number
): pHResult & { percentIonization: number } {
  if (concentration <= 0 || Kb <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  let hydroxideIon: number;

  if (Kb / concentration < 0.05) {
    hydroxideIon = Math.sqrt(Kb * concentration);
  } else {
    hydroxideIon = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * concentration)) / 2;
  }

  const result = calculatePOH(hydroxideIon);
  const percentIonization = (hydroxideIon / concentration) * 100;

  return {
    ...result,
    percentIonization: Math.round(percentIonization * 100) / 100,
  };
}

/**
 * Calculates pH of a buffer solution using Henderson-Hasselbalch equation.
 * pH = pKa + log([base]/[acid])
 *
 * @param pKa - pKa of the weak acid
 * @param acidConcentration - Concentration of weak acid
 * @param baseConcentration - Concentration of conjugate base
 * @returns pH value
 *
 * @example
 * ```typescript
 * // Acetate buffer: 0.1 M acetic acid + 0.15 M sodium acetate
 * bufferPH(4.76, 0.1, 0.15)
 * // 4.94
 * ```
 */
export function bufferPH(
  pKa: number,
  acidConcentration: number,
  baseConcentration: number
): number {
  if (acidConcentration <= 0 || baseConcentration <= 0) {
    throw new CalculationError(t('error.positive_required'));
  }

  const pH = pKa + Math.log10(baseConcentration / acidConcentration);
  return Math.round(pH * 1000) / 1000;
}

/**
 * Converts between Ka and Kb using Kw = Ka × Kb.
 *
 * @param K - Either Ka or Kb value
 * @param type - Type of constant provided ('Ka' or 'Kb')
 * @returns The complementary constant
 *
 * @example
 * ```typescript
 * // Given Ka of acetic acid, find Kb of acetate ion
 * convertKaKb(1.8e-5, 'Ka')
 * // 5.56e-10 (Kb of acetate)
 * ```
 */
export function convertKaKb(K: number, type: 'Ka' | 'Kb'): number {
  return Kw / K;
}

/**
 * Calculates pKa from Ka or pKb from Kb.
 *
 * @param K - Dissociation constant
 * @returns pK value (-log10(K))
 */
export function pK(K: number): number {
  return -Math.log10(K);
}

/**
 * Calculates Ka from pKa or Kb from pKb.
 *
 * @param pKValue - pK value
 * @returns K value (10^(-pK))
 */
export function KFromPK(pKValue: number): number {
  return Math.pow(10, -pKValue);
}

/**
 * Common acid Ka values at 25°C.
 */
export const COMMON_Ka: Record<string, number> = {
  'HF': 6.8e-4,           // Hydrofluoric acid
  'HNO2': 4.5e-4,         // Nitrous acid
  'HCOOH': 1.8e-4,        // Formic acid
  'C6H5COOH': 6.3e-5,     // Benzoic acid
  'CH3COOH': 1.8e-5,      // Acetic acid
  'H2CO3': 4.3e-7,        // Carbonic acid (Ka1)
  'H2S': 1.0e-7,          // Hydrogen sulfide (Ka1)
  'H3PO4': 7.5e-3,        // Phosphoric acid (Ka1)
  'H2PO4-': 6.2e-8,       // Dihydrogen phosphate (Ka2)
  'HCN': 4.9e-10,         // Hydrocyanic acid
};

/**
 * Common base Kb values at 25°C.
 */
export const COMMON_Kb: Record<string, number> = {
  'NH3': 1.8e-5,          // Ammonia
  'CH3NH2': 4.4e-4,       // Methylamine
  '(CH3)2NH': 5.4e-4,     // Dimethylamine
  '(CH3)3N': 6.4e-5,      // Trimethylamine
  'C5H5N': 1.7e-9,        // Pyridine
  'C6H5NH2': 4.3e-10,     // Aniline
};
