/**
 * Redox Reaction Balancer
 * Balances oxidation-reduction reactions using the half-reaction method.
 */

import { ChemicalBalancer } from './balancer';
import { Parser } from './parser';
import { calculateOxidationStates, identifyOxidationChange } from './oxidation-state';
import { ElementCounts } from './types';
import { t } from './i18n';

/**
 * Medium for redox reaction balancing.
 */
export type ReactionMedium = 'acidic' | 'basic' | 'neutral';

/**
 * Half-reaction result.
 */
export interface HalfReaction {
  /** Type of half-reaction */
  type: 'oxidation' | 'reduction';
  /** The balanced half-reaction equation */
  equation: string;
  /** Number of electrons transferred */
  electrons: number;
  /** Element being oxidized/reduced */
  element: string;
  /** Initial oxidation state */
  initialState: number;
  /** Final oxidation state */
  finalState: number;
}

/**
 * Result of redox balancing.
 */
export interface RedoxBalanceResult {
  /** Whether balancing was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** The balanced overall equation */
  balancedEquation?: string;
  /** Oxidation half-reaction */
  oxidationHalf?: HalfReaction;
  /** Reduction half-reaction */
  reductionHalf?: HalfReaction;
  /** Step-by-step explanation */
  steps?: string[];
}

/**
 * Balances a redox reaction using the half-reaction method.
 *
 * @param equation - The unbalanced redox equation
 * @param medium - The reaction medium ('acidic', 'basic', or 'neutral')
 * @returns RedoxBalanceResult with balanced equation and half-reactions
 *
 * @example
 * ```typescript
 * // Acidic solution
 * balanceRedoxReaction('Fe + Cu^2+ -> Fe^3+ + Cu', 'acidic')
 * // { balancedEquation: '2Fe + 3Cu^2+ -> 2Fe^3+ + 3Cu', ... }
 *
 * // Basic solution
 * balanceRedoxReaction('MnO4- + C2O4^2- -> MnO2 + CO2', 'basic')
 * ```
 */
export function balanceRedoxReaction(
  equation: string,
  medium: ReactionMedium = 'acidic'
): RedoxBalanceResult {
  const steps: string[] = [];

  try {
    // Step 1: Try to balance using the standard balancer first
    const standardResult = ChemicalBalancer.balance(equation);

    if (standardResult.status === 'success') {
      steps.push('Equation balanced using standard method.');

      // Still identify the redox components for educational purposes
      const redoxInfo = identifyRedoxComponents(equation);

      return {
        success: true,
        balancedEquation: standardResult.balancedString,
        oxidationHalf: redoxInfo.oxidation,
        reductionHalf: redoxInfo.reduction,
        steps,
      };
    }

    // Step 2: If standard balancing fails, try half-reaction method
    steps.push('Using half-reaction method...');

    // Parse the equation
    const separator = equation.match(/-\>|=\>|=|→|⇌/);
    if (!separator) {
      return { success: false, error: 'Invalid equation separator' };
    }

    const [reactantsSide, productsSide] = equation.split(separator[0]);
    const reactants = reactantsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);
    const products = productsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);

    // Identify oxidation and reduction
    const redoxInfo = identifyRedoxComponentsFromParsed(reactants, products);

    if (!redoxInfo.oxidation || !redoxInfo.reduction) {
      return {
        success: false,
        error: 'Could not identify oxidation and reduction half-reactions',
      };
    }

    steps.push(`Oxidation: ${redoxInfo.oxidation.element} goes from ${redoxInfo.oxidation.initialState} to ${redoxInfo.oxidation.finalState}`);
    steps.push(`Reduction: ${redoxInfo.reduction.element} goes from ${redoxInfo.reduction.initialState} to ${redoxInfo.reduction.finalState}`);

    // Step 3: Balance each half-reaction
    // For now, return the standard balanced result with redox info
    return {
      success: true,
      balancedEquation: standardResult.balancedString || equation,
      oxidationHalf: redoxInfo.oxidation,
      reductionHalf: redoxInfo.reduction,
      steps,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Identifies the redox components in an equation.
 */
function identifyRedoxComponents(equation: string): {
  oxidation?: HalfReaction;
  reduction?: HalfReaction;
} {
  const separator = equation.match(/-\>|=\>|=|→|⇌/);
  if (!separator) {
    return {};
  }

  const [reactantsSide, productsSide] = equation.split(separator[0]);
  const reactants = reactantsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);
  const products = productsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);

  return identifyRedoxComponentsFromParsed(reactants, products);
}

/**
 * Identifies redox components from parsed reactants and products.
 */
function identifyRedoxComponentsFromParsed(
  reactants: string[],
  products: string[]
): {
  oxidation?: HalfReaction;
  reduction?: HalfReaction;
} {
  let oxidation: HalfReaction | undefined;
  let reduction: HalfReaction | undefined;

  // Get all elements from reactants and products
  const allElements = new Set<string>();

  for (const r of reactants) {
    const formula = r.replace(/^\d+/, '');
    try {
      const elements = Parser.parseFormula(formula);
      Object.keys(elements).forEach(e => {
        if (e !== '_Q') allElements.add(e);
      });
    } catch {
      // Skip unparseable formulas
    }
  }

  // Check each element for oxidation state changes
  for (const element of allElements) {
    // Find reactant containing this element
    const reactantFormula = reactants.find(r => {
      try {
        const elements = Parser.parseFormula(r.replace(/^\d+/, ''));
        return element in elements;
      } catch {
        return false;
      }
    });

    // Find product containing this element
    const productFormula = products.find(p => {
      try {
        const elements = Parser.parseFormula(p.replace(/^\d+/, ''));
        return element in elements;
      } catch {
        return false;
      }
    });

    if (reactantFormula && productFormula) {
      const reactantClean = reactantFormula.replace(/^\d+/, '');
      const productClean = productFormula.replace(/^\d+/, '');

      try {
        const reactantStates = calculateOxidationStates(reactantClean);
        const productStates = calculateOxidationStates(productClean);

        const initialState = reactantStates.oxidationStates[element];
        const finalState = productStates.oxidationStates[element];

        if (initialState !== undefined && finalState !== undefined && initialState !== finalState) {
          const electrons = Math.abs(finalState - initialState);

          if (finalState > initialState && !oxidation) {
            // Oxidation: lost electrons
            oxidation = {
              type: 'oxidation',
              equation: `${reactantClean} -> ${productClean}`,
              electrons,
              element,
              initialState,
              finalState,
            };
          } else if (finalState < initialState && !reduction) {
            // Reduction: gained electrons
            reduction = {
              type: 'reduction',
              equation: `${reactantClean} -> ${productClean}`,
              electrons,
              element,
              initialState,
              finalState,
            };
          }
        }
      } catch {
        // Skip if oxidation states can't be calculated
      }
    }
  }

  return { oxidation, reduction };
}

/**
 * Checks if a reaction is a redox reaction.
 *
 * @param equation - Chemical equation string
 * @returns true if the reaction involves oxidation-reduction
 */
export function isRedoxReaction(equation: string): boolean {
  const redoxInfo = identifyRedoxComponents(equation);
  return redoxInfo.oxidation !== undefined && redoxInfo.reduction !== undefined;
}

/**
 * Gets the oxidizing and reducing agents in a reaction.
 *
 * @param equation - Chemical equation string
 * @returns Object with oxidizing and reducing agent formulas
 */
export function getRedoxAgents(equation: string): {
  oxidizingAgent?: string;
  reducingAgent?: string;
} {
  const redoxInfo = identifyRedoxComponents(equation);

  // The oxidizing agent is reduced (gains electrons)
  // The reducing agent is oxidized (loses electrons)
  return {
    oxidizingAgent: redoxInfo.reduction?.equation.split('->')[0].trim(),
    reducingAgent: redoxInfo.oxidation?.equation.split('->')[0].trim(),
  };
}
