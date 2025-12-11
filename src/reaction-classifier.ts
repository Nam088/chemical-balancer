import { Parser } from './parser';
import { ElementCounts } from './types';
import { t, MessageKey } from './i18n';

/**
 * Types of chemical reactions.
 */
export type ReactionType =
  | 'combustion'         // Burning with O2, produces CO2 and/or H2O
  | 'acid-base'          // Acid + Base -> Salt + Water
  | 'precipitation'      // Two solutions form a solid precipitate
  | 'redox'              // Oxidation-reduction reaction
  | 'decomposition'      // One compound breaks into multiple
  | 'synthesis'          // Multiple compounds combine into one
  | 'single-replacement' // A + BC -> AC + B
  | 'double-replacement' // AB + CD -> AD + CB
  | 'unknown';

/**
 * Result of reaction classification.
 */
export interface ClassificationResult {
  /** Primary reaction type */
  type: ReactionType;
  /** Translated name of the reaction type (based on current locale) */
  typeName: string;
  /** Confidence level (0-1) */
  confidence: number;
  /** Possible secondary types */
  alternativeTypes?: ReactionType[];
  /** Explanation of classification */
  reason: string;
}

/**
 * Common acids (H at beginning)
 */
const COMMON_ACIDS = ['HCl', 'HBr', 'HI', 'HF', 'HNO3', 'H2SO4', 'H3PO4', 'H2CO3', 'CH3COOH'];

/**
 * Common bases (OH group)
 */
const COMMON_BASES_PATTERNS = [/OH$/, /\(OH\)\d*$/];

/**
 * Insoluble compounds (for precipitation detection)
 */
const INSOLUBLE_PATTERNS = [
  /AgCl/, /AgBr/, /AgI/, /PbCl2/, /PbBr2/, /PbI2/, /PbSO4/,
  /BaSO4/, /CaSO4/, /SrSO4/,
  /CaCO3/, /BaCO3/, /MgCO3/,
  /Fe\(OH\)/, /Cu\(OH\)/, /Al\(OH\)/, /Mg\(OH\)2/,
];

/**
 * Classifies a chemical reaction by its type.
 *
 * @param equation - The chemical equation string
 * @returns Classification result with type, confidence, and reason
 *
 * @example
 * ```typescript
 * classifyReaction('CH4 + O2 -> CO2 + H2O')
 * // { type: 'combustion', confidence: 0.95, reason: '...' }
 *
 * classifyReaction('HCl + NaOH -> NaCl + H2O')
 * // { type: 'acid-base', confidence: 0.9, reason: '...' }
 * ```
 */
export function classifyReaction(equation: string): ClassificationResult {
  // Parse the equation to get reactants and products
  const separator = equation.match(/-\>|=\>|=|→|⇌/);
  if (!separator) {
    return { type: 'unknown', typeName: t('reaction.unknown'), confidence: 0, reason: t('reason.invalid_format') };
  }

  const [reactantsSide, productsSide] = equation.split(separator[0]);
  const reactants = reactantsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);
  const products = productsSide.split(/\s+\+\s+/).map(s => s.trim()).filter(Boolean);

  // Parse element counts for each molecule
  const reactantCounts = reactants.map(r => {
    const m = r.match(/^(\d+)?(.+)/);
    return { formula: m ? m[2] : r, elements: Parser.parseFormula(m ? m[2] : r) };
  });
  const productCounts = products.map(p => {
    const m = p.match(/^(\d+)?(.+)/);
    return { formula: m ? m[2] : p, elements: Parser.parseFormula(m ? m[2] : p) };
  });

  // Check for combustion: organic compound + O2 -> CO2 + H2O
  if (isCombustion(reactantCounts, productCounts)) {
    return {
      type: 'combustion',
      typeName: t('reaction.combustion'),
      confidence: 0.95,
      reason: t('reason.combustion'),
    };
  }

  // Check for acid-base: acid + base -> salt + water
  if (isAcidBase(reactants, products)) {
    return {
      type: 'acid-base',
      typeName: t('reaction.acid-base'),
      confidence: 0.9,
      reason: t('reason.acid-base'),
    };
  }

  // Check for decomposition: 1 reactant -> multiple products
  if (reactants.length === 1 && products.length > 1) {
    return {
      type: 'decomposition',
      typeName: t('reaction.decomposition'),
      confidence: 0.85,
      reason: t('reason.decomposition'),
    };
  }

  // Check for synthesis: multiple reactants -> 1 product
  if (reactants.length > 1 && products.length === 1) {
    return {
      type: 'synthesis',
      typeName: t('reaction.synthesis'),
      confidence: 0.85,
      reason: t('reason.synthesis'),
    };
  }

  // Check for precipitation
  if (isPrecipitation(products)) {
    return {
      type: 'precipitation',
      typeName: t('reaction.precipitation'),
      confidence: 0.8,
      reason: t('reason.precipitation'),
    };
  }

  // Check for single replacement: A + BC -> AC + B
  if (isSingleReplacement(reactantCounts, productCounts)) {
    return {
      type: 'single-replacement',
      typeName: t('reaction.single-replacement'),
      confidence: 0.75,
      reason: t('reason.single-replacement'),
    };
  }

  // Check for double replacement: AB + CD -> AD + CB
  if (isDoubleReplacement(reactants, products)) {
    return {
      type: 'double-replacement',
      typeName: t('reaction.double-replacement'),
      confidence: 0.7,
      reason: t('reason.double-replacement'),
    };
  }

  // Default to redox if we can't classify (many reactions are redox)
  if (hasOxidationChange(reactantCounts, productCounts)) {
    return {
      type: 'redox',
      typeName: t('reaction.redox'),
      confidence: 0.6,
      reason: t('reason.redox'),
    };
  }

  return {
    type: 'unknown',
    typeName: t('reaction.unknown'),
    confidence: 0.3,
    reason: t('reason.unknown'),
  };
}

function isCombustion(
  reactants: { formula: string; elements: ElementCounts }[],
  products: { formula: string; elements: ElementCounts }[]
): boolean {
  const hasO2 = reactants.some(r => r.formula === 'O2');
  const hasCO2 = products.some(p => p.formula === 'CO2');
  const hasH2O = products.some(p => p.formula === 'H2O');
  const hasOrganic = reactants.some(r => r.elements['C'] && r.elements['H']);
  
  return hasO2 && (hasCO2 || hasH2O) && hasOrganic;
}

function isAcidBase(reactants: string[], products: string[]): boolean {
  const hasAcid = reactants.some(r => {
    const formula = r.replace(/^\d+/, '');
    return COMMON_ACIDS.includes(formula) || /^H\d*[A-Z]/.test(formula);
  });
  const hasBase = reactants.some(r => {
    const formula = r.replace(/^\d+/, '');
    return COMMON_BASES_PATTERNS.some(p => p.test(formula));
  });
  const hasWater = products.some(p => p.replace(/^\d+/, '') === 'H2O');
  
  return hasAcid && hasBase && hasWater;
}

function isPrecipitation(products: string[]): boolean {
  return products.some(p => {
    const formula = p.replace(/^\d+/, '');
    return INSOLUBLE_PATTERNS.some(pattern => pattern.test(formula));
  });
}

function isSingleReplacement(
  reactants: { formula: string; elements: ElementCounts }[],
  products: { formula: string; elements: ElementCounts }[]
): boolean {
  // Check if one reactant is a single element
  const singleElements = reactants.filter(r => Object.keys(r.elements).length === 1);
  return singleElements.length === 1 && reactants.length === 2;
}

function isDoubleReplacement(reactants: string[], products: string[]): boolean {
  // Typically AB + CD -> AD + CB pattern
  return reactants.length === 2 && products.length === 2;
}

function hasOxidationChange(
  reactants: { formula: string; elements: ElementCounts }[],
  products: { formula: string; elements: ElementCounts }[]
): boolean {
  // Simple check: if O2 is involved or elements appear in different oxidation states
  const hasO2 = reactants.some(r => r.formula === 'O2');
  const hasH2 = reactants.some(r => r.formula === 'H2');
  return hasO2 || hasH2;
}
