/**
 * Oxidation State Calculator
 * Calculates oxidation states for elements in chemical compounds.
 */

import { Parser } from './parser';
import { ELEMENTS, getElectronegativity } from './elements';
import { ElementCounts } from './types';
import { t } from './i18n';

/**
 * Result of oxidation state calculation.
 */
export interface OxidationStateResult {
  /** Formula that was analyzed */
  formula: string;
  /** Oxidation states for each element */
  oxidationStates: Record<string, number>;
  /** Whether the calculation was successful */
  success: boolean;
  /** Explanation of the calculation */
  explanation?: string;
}

/**
 * Known oxidation states for common elements in most compounds.
 */
const FIXED_OXIDATION_STATES: Record<string, number> = {
  // Alkali metals: always +1
  Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Fr: 1,
  // Alkaline earth metals: always +2
  Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Ra: 2,
  // Fluorine: always -1 (most electronegative)
  F: -1,
  // Aluminum: always +3
  Al: 3,
  // Zinc: always +2
  Zn: 2,
  // Silver: usually +1
  Ag: 1,
};

/**
 * Rules for oxygen oxidation state.
 * Usually -2, except in peroxides (-1) and OF2 (+2).
 */
const PEROXIDE_PATTERNS = ['H2O2', 'Na2O2', 'BaO2', 'K2O2'];
const SUPEROXIDE_PATTERNS = ['KO2', 'NaO2'];

/**
 * Rules for hydrogen oxidation state.
 * Usually +1, except in metal hydrides (-1).
 */
const HYDRIDE_PATTERNS = ['NaH', 'CaH2', 'LiH', 'KH', 'MgH2', 'AlH3'];

/**
 * Calculates the oxidation states of all elements in a chemical formula.
 *
 * @param formula - Chemical formula string (e.g., 'H2O', 'H2SO4', 'KMnO4')
 * @returns OxidationStateResult with oxidation states for each element
 *
 * @example
 * ```typescript
 * calculateOxidationStates('H2O')
 * // { oxidationStates: { H: 1, O: -2 }, success: true }
 *
 * calculateOxidationStates('H2SO4')
 * // { oxidationStates: { H: 1, S: 6, O: -2 }, success: true }
 *
 * calculateOxidationStates('KMnO4')
 * // { oxidationStates: { K: 1, Mn: 7, O: -2 }, success: true }
 * ```
 */
export function calculateOxidationStates(formula: string): OxidationStateResult {
  try {
    const elements = Parser.parseFormula(formula);
    const oxidationStates: Record<string, number> = {};
    const unknowns: string[] = [];
    let totalKnown = 0;

    // Skip charge if present
    const elementList = Object.entries(elements).filter(([el]) => el !== '_Q');

    // Step 1: Apply fixed rules
    for (const [element, count] of elementList) {
      if (FIXED_OXIDATION_STATES[element] !== undefined) {
        oxidationStates[element] = FIXED_OXIDATION_STATES[element];
        totalKnown += FIXED_OXIDATION_STATES[element] * count;
      } else if (element === 'O') {
        // Check for special oxygen cases
        if (PEROXIDE_PATTERNS.some(p => formula.includes(p.replace(/\d/g, '')))) {
          oxidationStates['O'] = -1;
        } else if (SUPEROXIDE_PATTERNS.some(p => formula.includes(p.replace(/\d/g, '')))) {
          oxidationStates['O'] = -0.5; // Superoxide O2^-
        } else if (formula === 'OF2') {
          oxidationStates['O'] = 2;
        } else {
          oxidationStates['O'] = -2;
        }
        totalKnown += oxidationStates['O'] * count;
      } else if (element === 'H') {
        // Check for hydrides
        if (HYDRIDE_PATTERNS.some(p => formula.includes(p.replace(/\d/g, '')))) {
          oxidationStates['H'] = -1;
        } else {
          oxidationStates['H'] = 1;
        }
        totalKnown += oxidationStates['H'] * count;
      } else {
        unknowns.push(element);
      }
    }

    // Step 2: Calculate unknown oxidation states
    // For neutral compounds, sum of oxidation states = 0
    // For ions, sum = charge
    const charge = elements['_Q'] || 0;
    const targetSum = charge;

    if (unknowns.length === 1) {
      // Only one unknown - solve directly
      const unknown = unknowns[0];
      const count = elements[unknown];
      const unknownTotal = targetSum - totalKnown;
      oxidationStates[unknown] = unknownTotal / count;
    } else if (unknowns.length === 0) {
      // All known - verify the sum
      const sum = Object.entries(oxidationStates).reduce(
        (acc, [el, state]) => acc + state * (elements[el] || 0),
        0
      );
      if (Math.abs(sum - targetSum) > 0.01) {
        return {
          formula,
          oxidationStates,
          success: false,
          explanation: `Sum of oxidation states (${sum}) does not match expected (${targetSum})`,
        };
      }
    } else {
      // Multiple unknowns - use electronegativity to assign
      // This is a simplified approach; may not work for all cases
      const sortedUnknowns = unknowns.sort((a, b) => {
        const enA = getElectronegativity(a) || 2.0;
        const enB = getElectronegativity(b) || 2.0;
        return enB - enA; // Higher electronegativity = more negative
      });

      // Assign most electronegative as negative, least as positive
      let remaining = targetSum - totalKnown;

      for (let i = 0; i < sortedUnknowns.length; i++) {
        const element = sortedUnknowns[i];
        const count = elements[element];

        if (i === sortedUnknowns.length - 1) {
          // Last element gets the remaining
          oxidationStates[element] = remaining / count;
        } else {
          // Use common oxidation state from element data
          const commonStates = ELEMENTS[element]?.oxidationStates || [0];
          // Pick the state that makes sense (positive for metals, negative for nonmetals)
          const en = getElectronegativity(element) || 2.0;
          const preferredState = en > 2.5 ? Math.min(...commonStates) : Math.max(...commonStates);
          oxidationStates[element] = preferredState;
          remaining -= preferredState * count;
        }
      }
    }

    // Build explanation
    const explanation = Object.entries(oxidationStates)
      .map(([el, state]) => `${el}: ${state > 0 ? '+' : ''}${state}`)
      .join(', ');

    return {
      formula,
      oxidationStates,
      success: true,
      explanation,
    };
  } catch {
    return {
      formula,
      oxidationStates: {},
      success: false,
      explanation: 'Failed to parse formula',
    };
  }
}

/**
 * Identifies which element is oxidized in a reaction by comparing oxidation states.
 *
 * @param reactantFormula - Formula of the reactant
 * @param productFormula - Formula of the product containing the same element
 * @param element - Element to check
 * @returns 'oxidized' if element lost electrons, 'reduced' if gained, 'unchanged' if same
 */
export function identifyOxidationChange(
  reactantFormula: string,
  productFormula: string,
  element: string
): 'oxidized' | 'reduced' | 'unchanged' {
  const reactantStates = calculateOxidationStates(reactantFormula);
  const productStates = calculateOxidationStates(productFormula);

  const reactantState = reactantStates.oxidationStates[element];
  const productState = productStates.oxidationStates[element];

  if (reactantState === undefined || productState === undefined) {
    return 'unchanged';
  }

  if (productState > reactantState) {
    return 'oxidized'; // Lost electrons, oxidation state increased
  } else if (productState < reactantState) {
    return 'reduced'; // Gained electrons, oxidation state decreased
  }
  return 'unchanged';
}

/**
 * Calculates the number of electrons transferred in a half-reaction.
 *
 * @param reactant - Reactant formula
 * @param product - Product formula
 * @param element - Element undergoing oxidation/reduction
 * @returns Number of electrons transferred (positive = lost, negative = gained)
 */
export function calculateElectronTransfer(
  reactant: string,
  product: string,
  element: string
): number {
  const reactantStates = calculateOxidationStates(reactant);
  const productStates = calculateOxidationStates(product);

  const reactantState = reactantStates.oxidationStates[element] || 0;
  const productState = productStates.oxidationStates[element] || 0;

  const reactantElements = Parser.parseFormula(reactant);
  const count = reactantElements[element] || 1;

  return (productState - reactantState) * count;
}
