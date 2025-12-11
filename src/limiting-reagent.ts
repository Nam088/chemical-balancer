import { ChemicalBalancer } from './balancer';
import { calculateMolarMass } from './molar-mass';
import { t } from './i18n';

/**
 * Reagent input with molecule and amount.
 */
export interface ReagentAmount {
  /** Molecule formula */
  molecule: string;
  /** Amount value */
  amount: number;
  /** Unit of amount */
  unit: 'mol' | 'g';
}

/**
 * Input for limiting reagent calculation.
 */
export interface LimitingReagentInput {
  /** The chemical equation (can be unbalanced) */
  equation: string;
  /** Array of reagent amounts */
  reagents: ReagentAmount[];
}

/**
 * Result of limiting reagent calculation.
 */
export interface LimitingReagentResult {
  /** The limiting reagent */
  limiting: string;
  /** Excess reagents */
  excess: Array<{
    molecule: string;
    /** Amount remaining after reaction */
    remaining: number;
    /** Unit */
    unit: 'mol';
  }>;
  /** The balanced equation used */
  balancedEquation: string;
  /** Explanation */
  explanation: string;
}

/**
 * Determines the limiting reagent in a chemical reaction.
 *
 * @param input - Limiting reagent input with equation and reagent amounts
 * @returns Which reagent is limiting and excess amounts
 *
 * @example
 * ```typescript
 * findLimitingReagent({
 *   equation: 'H2 + O2 -> H2O',
 *   reagents: [
 *     { molecule: 'H2', amount: 4, unit: 'mol' },
 *     { molecule: 'O2', amount: 1, unit: 'mol' }
 *   ]
 * })
 * // { limiting: 'O2', excess: [{ molecule: 'H2', remaining: 2, unit: 'mol' }], ... }
 * ```
 */
export function findLimitingReagent(input: LimitingReagentInput): LimitingReagentResult {
  const { equation, reagents } = input;

  // Step 1: Balance the equation
  const balanced = ChemicalBalancer.balance(equation);
  if (balanced.status !== 'success' || !balanced.coefficients) {
    throw new Error(t('error.balance_failed', { message: balanced.message || '' }));
  }

  // Step 2: Convert all reagents to moles
  const reagentMoles: Record<string, number> = {};
  for (const reagent of reagents) {
    let moles = reagent.amount;
    if (reagent.unit === 'g') {
      const molarMass = calculateMolarMass(reagent.molecule);
      moles = reagent.amount / molarMass;
    }
    reagentMoles[reagent.molecule] = moles;
  }

  // Step 3: Calculate how many "reactions" each reagent can support
  // reactions = moles / coefficient
  const reactionsSupported: Record<string, number> = {};
  for (const [molecule, moles] of Object.entries(reagentMoles)) {
    const coeff = balanced.coefficients[molecule];
    if (coeff === undefined) {
      throw new Error(t('error.molecule_not_found', { molecule }));
    }
    reactionsSupported[molecule] = moles / coeff;
  }

  // Step 4: Find the limiting reagent (smallest number of reactions)
  let limiting = '';
  let minReactions = Infinity;
  for (const [molecule, reactions] of Object.entries(reactionsSupported)) {
    if (reactions < minReactions) {
      minReactions = reactions;
      limiting = molecule;
    }
  }

  // Step 5: Calculate excess amounts
  const excess: LimitingReagentResult['excess'] = [];
  for (const [molecule, moles] of Object.entries(reagentMoles)) {
    if (molecule !== limiting) {
      const coeff = balanced.coefficients[molecule]!;
      const usedMoles = minReactions * coeff;
      const remaining = moles - usedMoles;
      if (remaining > 0.0001) { // Ignore very small amounts (floating point errors)
        excess.push({
          molecule,
          remaining: Math.round(remaining * 1000) / 1000,
          unit: 'mol',
        });
      }
    }
  }

  return {
    limiting,
    excess,
    balancedEquation: balanced.balancedString!,
    explanation: t('step.limiting_explanation', { limiting, reactions: minReactions.toFixed(4) }),
  };
}
