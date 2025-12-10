import { ElementCounts } from './types';

/**
 * Parses a chemical formula string into an object counting atoms of each element.
 * Example: "H2O" -> { H: 2, O: 1 }
 * Example: "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 * Example: "(NH4)2SO4" -> { N: 2, H: 8, S: 1, O: 4 }
 */
export class Parser {
  static parseFormula(formula: string): ElementCounts {
    // 1. Normalize: Remove all whitespace
    let cleanFormula = formula.replace(/\s+/g, '');
    
    // Strip leading coefficients (digits at start)
    // Example: "2H2O" -> "H2O"
    // We only remove digits at the VERY START.
    cleanFormula = cleanFormula.replace(/^\d+/, '');
    
    const counts: ElementCounts = {};

    // Base case: empty string
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
                expandedPart += `${element}${count * multiplier}`;
            }
            return expandedPart;
        });
        
        // Safety break if parentheses exist but regex didn't match (malformed, e.g. "Ca(OH")
        if (!found && processedFormula.includes('(')) {
             throw new Error(`Invalid formula syntax (unbalanced or malformed parentheses): ${formula}`);
        }
    }

    // Now parse strictly
    const finalCounts = this.parseSimpleFormula(processedFormula, true); // Pass flag to check validity
    return finalCounts;
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
          throw new Error(`Invalid characters in formula '${formula}': '${invalidChar}'`);
      }
      
      const element = match[1];
      const countStr = match[2];
      const count = countStr ? parseInt(countStr, 10) : 1;
      
      counts[element] = (counts[element] || 0) + count;
      
      lastIndex = elementRegex.lastIndex;
      matchedLength += match[0].length;
    }
    
    if (checkValidity && lastIndex !== formula.length) {
        throw new Error(`Invalid characters at end of formula '${formula}': '${formula.substring(lastIndex)}'`);
    }
    
    return counts;
  }
}
