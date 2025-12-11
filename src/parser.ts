import { ElementCounts, MatterState, ParsedFormula } from './types';
import { isValidElement } from './periodic-table';
import { t } from './i18n';

/**
 * Valid state annotations
 */
const STATE_ANNOTATIONS: MatterState[] = ['s', 'l', 'g', 'aq'];

/**
 * Parses a chemical formula string into an object counting atoms of each element.
 * Example: "H2O" -> { H: 2, O: 1 }
 * Example: "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 * Example: "(NH4)2SO4" -> { N: 2, H: 8, S: 1, O: 4 }
 */
export class Parser {
  /**
   * Parses a formula and returns element counts only.
   * State annotations like (s), (l), (g), (aq) are stripped.
   */
  static parseFormula(formula: string): ElementCounts {
    return this.parseFormulaWithState(formula).elements;
  }

  /**
   * Parses a formula and returns both element counts and state annotation.
   * 
   * @param formula - Chemical formula, optionally with state annotation
   * @returns ParsedFormula with elements and optional state
   * 
   * @example
   * ```typescript
   * Parser.parseFormulaWithState('H2O(l)')
   * // { elements: { H: 2, O: 1 }, state: 'l' }
   * 
   * Parser.parseFormulaWithState('NaCl(aq)')
   * // { elements: { Na: 1, Cl: 1 }, state: 'aq' }
   * ```
   */
  static parseFormulaWithState(formula: string): ParsedFormula {
    // 1. Normalize: Remove all whitespace
    let cleanFormula = formula.replace(/\s+/g, '');
    
    // 2. Check for state annotation at the end: (s), (l), (g), (aq)
    let state: MatterState | undefined;
    const stateMatch = cleanFormula.match(/\((s|l|g|aq)\)$/);
    if (stateMatch) {
      state = stateMatch[1] as MatterState;
      cleanFormula = cleanFormula.slice(0, -stateMatch[0].length);
    }
    
    // 3. Handle Hydrates (e.g., "CuSO4.5H2O")
    if (cleanFormula.includes('.')) {
        const parts = cleanFormula.split('.');
        const totalCounts: ElementCounts = {};
        
        parts.forEach((part, index) => {
            let multiplier = 1;
            let subFormula = part;
            
            // For hydrate parts (index > 0), extract the multiplier coefficient
            if (index > 0) {
                const match = subFormula.match(/^(\d+)(.+)/);
                if (match) {
                    multiplier = parseInt(match[1], 10);
                    subFormula = match[2];
                }
            }
            
            const counts = this.parseStandardFormula(subFormula);
            
            // Merge counts
            for (const [element, count] of Object.entries(counts)) {
                totalCounts[element] = (totalCounts[element] || 0) + count * multiplier;
            }
        });
        
        return { elements: totalCounts, state };
    }

    return { elements: this.parseStandardFormula(cleanFormula), state };
  }

  /**
   * Parses a standard formula (no dots for hydrates)
   */
  private static parseStandardFormula(formula: string): ElementCounts {
    // Strip leading coefficients (digits at start)
    // Example: "2H2O" -> "H2O"
    let cleanFormula = formula.replace(/^\d+/, '');
    
    // Handle Ion Charges (e.g., Fe3+, SO4^2-, e-, e^-)
    // Strategy: Extract charge from end of string, remove it, then parse atoms.
    let charge = 0;
    
    // 1. Electron special case: "e", "e-", "e^-", "e^-"
    // If exact match or match with coeff (handled outside), but here formula is molecule part.
    if (cleanFormula === 'e' || cleanFormula === 'e-' || cleanFormula === 'e^-') {
        return { _Q: -1 };
    }
    
    // 2. Look for charge at the end
    // Patterns: 
    // ^...(\^\d+[+-])$    (Caret required for number: Fe^3+, Cl^1-)
    // ^...([+-])$         (Simple unit charge: Na+, Cl-, NH4+)
    // We do NOT support "Fe3+" without caret because it conflicts with "NH4+" (Is 4 a subscript or charge?)
    
    // Check for explicit caret charge first
    const caretChargeRegex = /\^(\d*)([+-])$/;
    const caretMatch = cleanFormula.match(caretChargeRegex);
    
    if (caretMatch) {
        const fullMatch = caretMatch[0];
        const magnitudeStr = caretMatch[1];
        const sign = caretMatch[2];
        const magnitude = magnitudeStr ? parseInt(magnitudeStr, 10) : 1;
        charge = sign === '+' ? magnitude : -magnitude;
        cleanFormula = cleanFormula.substring(0, cleanFormula.length - fullMatch.length);
    } else {
        // Check for simple unit charge (+ or -) at the very end
        // But be careful not to match if it's part of a caret expression (handled above)
        // or potentially other syntax? No, simple + or - at end.
        const unitChargeRegex = /([+-])$/;
        const unitMatch = cleanFormula.match(unitChargeRegex);
        
        if (unitMatch) {
             const sign = unitMatch[1];
             charge = sign === '+' ? 1 : -1;
             cleanFormula = cleanFormula.substring(0, cleanFormula.length - 1);
        }
    }
    
    const counts: ElementCounts = {};
    if (charge !== 0) {
        counts['_Q'] = charge;
    }

    // Base case: empty string (e.g. if input was just "e-", we returned early, but if "2+" it's invalid unless it's an ion alone?)
    // If formula was just a charge (like "2+"), cleanFormula is empty.
    // But usually formula has atoms.
    if (!cleanFormula) return counts;

    // Parse nested parentheses first
    const parenthesesRegex = /\(([^()]+)\)(\d*)/g;
    
    let processedFormula = cleanFormula;
    
    // Keep expanding innermost parentheses until none are left
    while (processedFormula.includes('(')) {
        let found = false;
        processedFormula = processedFormula.replace(parenthesesRegex, (match, content, multiplierStr) => {
            found = true;
            const multiplier = multiplierStr ? parseInt(multiplierStr, 10) : 1;
            const innerCounts = this.parseSimpleFormula(content);
            
            // Expand to string
            let expandedPart = '';
            for (const [element, count] of Object.entries(innerCounts)) {
                if (element === '_Q') {
                     // Inner charges? Usually charges are outside.
                     // (NH4)+ -> atoms NH4, then + outside.
                     // If we have (SO4)2-, inner is SO4.
                     // Inner parts usually don't have charges in this regex flow because we strip charge FIRST from the very end.
                     // So we don't expect _Q here.
                } else {
                     expandedPart += `${element}${count * multiplier}`;
                }
            }
            return expandedPart;
        });
        
        // Safety break if parentheses exist but regex didn't match (malformed, e.g. "Ca(OH")
        if (!found && processedFormula.includes('(')) {
             throw new Error(t('error.invalid_formula_syntax', { formula }));
        }
    }

    // Now parse strictly
    const finalCounts = this.parseSimpleFormula(processedFormula, true); // Pass flag to check validity
    
    // Merge atomic counts with charge
    for (const [el, count] of Object.entries(finalCounts)) {
        counts[el] = (counts[el] || 0) + count;
    }
    
    return counts;
  }

  /**
   * Parses a formula without parentheses
   * @param checkValidity If true, throws error for unparsed characters
   */
  private static parseSimpleFormula(formula: string, checkValidity = false): ElementCounts {
    const counts: ElementCounts = {};
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    
    let match;
    let lastIndex = 0;
    let matchedLength = 0;
    
    while ((match = elementRegex.exec(formula)) !== null) {
      // Check for gaps (unparsed characters) if checking validity
      if (checkValidity && match.index !== lastIndex) {
          const invalidChar = formula.substring(lastIndex, match.index);
          throw new Error(t('error.invalid_characters', { formula, chars: invalidChar }));
      }
      
      const element = match[1];
      const countStr = match[2];
      const count = countStr ? parseInt(countStr, 10) : 1;
      
      // Validate element exists in periodic table
      if (checkValidity && !isValidElement(element)) {
          throw new Error(t('error.unknown_element', { element, formula }));
      }
      
      counts[element] = (counts[element] || 0) + count;
      
      lastIndex = elementRegex.lastIndex;
      matchedLength += match[0].length;
    }
    
    if (checkValidity && lastIndex !== formula.length) {
        throw new Error(t('error.invalid_characters_end', { formula, chars: formula.substring(lastIndex) }));
    }
    
    return counts;
  }
}
