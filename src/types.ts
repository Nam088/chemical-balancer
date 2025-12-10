export interface ElementCounts {
  [element: string]: number;
}

export interface Molecule {
  raw: string;
  elements: ElementCounts;
}

export interface ReactionComponent {
  coefficient: number; // Will be 1 initially
  molecule: Molecule;
}

export interface BalancedResult {
  status: 'success' | 'error';
  message?: string;
  coefficients?: Record<string, number>;
  balancedString?: string;
  debug?: {
    elements: string[];
    reactants: Record<string, ElementCounts>;
    products: Record<string, ElementCounts>;
    balanceCheck?: Record<string, { left: number; right: number }>;
  };
}
