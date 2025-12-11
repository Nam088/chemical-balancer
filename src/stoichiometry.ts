import { ChemicalBalancer } from './balancer';
import { calculateMolarMass } from './molar-mass';
import { t } from './i18n';

/**
 * Input for stoichiometry calculation.
 */
export interface StoichiometryInput {
  /** The chemical equation (can be unbalanced) */
  equation: string;
  /** The known amount */
  given: {
    /** Molecule formula */
    molecule: string;
    /** Amount value */
    amount: number;
    /** Unit of amount */
    unit: 'mol' | 'g';
  };
  /** What to calculate */
  find: {
    /** Target molecule formula */
    molecule: string;
    /** Desired unit */
    unit: 'mol' | 'g';
  };
}

/**
 * Result of stoichiometry calculation.
 */
export interface StoichiometryResult {
  /** Calculated amount */
  amount: number;
  /** Unit of the result */
  unit: 'mol' | 'g';
  /** The balanced equation used */
  balancedEquation: string;
  /** Step-by-step calculation breakdown */
  steps: string[];
}

/**
 * Performs stoichiometry calculations.
 *
 * @param input - Stoichiometry input with equation, given amount, and target
 * @returns Calculated amount with steps
 *
 * @example
 * ```typescript
 * // How many grams of H2O are produced from 2 moles of H2?
 * calculateStoichiometry({
 *   equation: 'H2 + O2 -> H2O',
 *   given: { molecule: 'H2', amount: 2, unit: 'mol' },
 *   find: { molecule: 'H2O', unit: 'g' }
 * })
 * // { amount: 36.03, unit: 'g', steps: [...] }
 * ```
 */
export function calculateStoichiometry(input: StoichiometryInput): StoichiometryResult {
  const { equation, given, find } = input;
  const steps: string[] = [];

  // Step 1: Balance the equation
  const balanced = ChemicalBalancer.balance(equation);
  if (balanced.status !== 'success' || !balanced.coefficients) {
    throw new Error(t('error.balance_failed', { message: balanced.message || '' }));
  }
  steps.push(t('step.balanced_equation', { equation: balanced.balancedString || '' }));

  // Step 2: Get coefficients
  const givenCoeff = balanced.coefficients[given.molecule];
  const findCoeff = balanced.coefficients[find.molecule];

  if (givenCoeff === undefined) {
    throw new Error(t('error.molecule_not_found', { molecule: given.molecule }));
  }
  if (findCoeff === undefined) {
    throw new Error(t('error.molecule_not_found', { molecule: find.molecule }));
  }

  steps.push(t('step.coefficients', {
    given: given.molecule,
    givenCoeff: String(givenCoeff),
    find: find.molecule,
    findCoeff: String(findCoeff),
  }));

  // Step 3: Convert given to moles if necessary
  let givenMoles = given.amount;
  if (given.unit === 'g') {
    const givenMolarMass = calculateMolarMass(given.molecule);
    givenMoles = given.amount / givenMolarMass;
    steps.push(t('step.convert_to_mol', {
      amount: String(given.amount),
      molecule: given.molecule,
      molarMass: String(givenMolarMass),
      result: givenMoles.toFixed(4),
    }));
  } else {
    steps.push(t('step.given_mol', {
      amount: String(given.amount),
      molecule: given.molecule,
    }));
  }

  // Step 4: Use mole ratio
  const findMoles = (givenMoles * findCoeff) / givenCoeff;
  steps.push(t('step.mole_ratio', {
    givenMol: givenMoles.toFixed(4),
    findCoeff: String(findCoeff),
    givenCoeff: String(givenCoeff),
    result: findMoles.toFixed(4),
    find: find.molecule,
  }));

  // Step 5: Convert to desired unit
  let result = findMoles;
  if (find.unit === 'g') {
    const findMolarMass = calculateMolarMass(find.molecule);
    result = findMoles * findMolarMass;
    steps.push(t('step.convert_to_grams', {
      mol: findMoles.toFixed(4),
      molarMass: String(findMolarMass),
      result: result.toFixed(4),
    }));
  }

  return {
    amount: Math.round(result * 1000) / 1000,
    unit: find.unit,
    balancedEquation: balanced.balancedString!,
    steps,
  };
}
