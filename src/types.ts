/**
 * A mapping of element symbols to their counts in a molecule.
 *
 * @example
 * ```typescript
 * // H2O -> { H: 2, O: 1 }
 * // Ca(OH)2 -> { Ca: 1, O: 2, H: 2 }
 * ```
 */
export interface ElementCounts {
  [element: string]: number;
}

/**
 * Physical state of matter annotation.
 * - `s` - solid
 * - `l` - liquid
 * - `g` - gas
 * - `aq` - aqueous (dissolved in water)
 */
export type MatterState = 's' | 'l' | 'g' | 'aq';

/**
 * Result of parsing a formula with optional state annotation.
 *
 * @example
 * ```typescript
 * // "H2O(l)" -> { elements: {H:2, O:1}, state: 'l' }
 * // "NaCl(aq)" -> { elements: {Na:1, Cl:1}, state: 'aq' }
 * ```
 */
export interface ParsedFormula {
  /** Element counts for the molecule */
  elements: ElementCounts;
  /** Optional physical state annotation */
  state?: MatterState;
}

/**
 * Represents a parsed molecule with its raw string and element breakdown.
 */
export interface Molecule {
  /** The original formula string */
  raw: string;
  /** Element counts for this molecule */
  elements: ElementCounts;
}

/**
 * A component of a chemical reaction (reactant or product).
 */
export interface ReactionComponent {
  /** Stoichiometric coefficient (initially 1 before balancing) */
  coefficient: number;
  /** The parsed molecule */
  molecule: Molecule;
}

/**
 * Result returned by {@link ChemicalBalancer.balance}.
 */
export interface BalancedResult {
  /** Whether the balancing was successful */
  status: 'success' | 'error';
  /** Error message if status is 'error' */
  message?: string;
  /** Map of molecule formula to its balanced coefficient */
  coefficients?: Record<string, number>;
  /** The fully balanced equation string (e.g., '2H2 + O2 -> 2H2O') */
  balancedString?: string;
  /** Debug information for verification */
  debug?: {
    /** All unique elements in the equation */
    elements: string[];
    /** Element counts for each reactant */
    reactants: Record<string, ElementCounts>;
    /** Element counts for each product */
    products: Record<string, ElementCounts>;
    /** Verification that atoms are balanced on both sides */
    balanceCheck?: Record<string, { left: number; right: number }>;
  };
}
