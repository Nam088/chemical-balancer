import Fraction from 'fraction.js';
import { ElementCounts } from './types';

/**
 * Maximum weight to search when combining basis vectors.
 * Higher values allow finding more solutions but increase computation time exponentially.
 */
const MAX_WEIGHT_SEARCH = 6;

/**
 * Solves the matrix equation Ax = 0 to find stoichiometric coefficients.
 */
export class MathSolver {
  /**
   * Solves for the coefficients.
   * @param reactants Array of element counts for each reactant molecule
   * @param products Array of element counts for each product molecule
   */
  static solve(reactants: ElementCounts[], products: ElementCounts[]): number[] {
    const allMolecules = [...reactants, ...products];
    const uniqueElements = Array.from(
      new Set(allMolecules.flatMap((m) => Object.keys(m)))
    ).sort(); // Sort for consistent row order

    const numRows = uniqueElements.length;
    const numCols = allMolecules.length;

    // Build the matrix via array of Fraction
    // Coefficient of reactant is positive, product is negative
    const matrix: Fraction[][] = uniqueElements.map((element) => {
      return allMolecules.map((counts, index) => {
        const count = counts[element] || 0;
        // If it's a product (index >= reactants.length), it should be negative
        const val = index < reactants.length ? count : -count;
        return new Fraction(val);
      });
    });

    // Gaussian Elimination to RREF
    this.toRREF(matrix);

    // Find the null space (kernel)
    // The system is Ax = 0.
    // We expect (numCols - 1) pivots. The last column is typically free.
    // If rank < numCols - 1, we have multiple free variables (basis vectors).
    
    // Identify pivot columns
    const pivotCols: number[] = [];
    const freeCols: number[] = [];
    
    let r = 0;
    for (let c = 0; c < numCols; c++) {
        if (r < numRows && !matrix[r][c].equals(0)) {
            pivotCols.push(c);
            r++;
        } else {
            freeCols.push(c);
        }
    }
    
    // We have `freeCols.length` dimensions in null space.
    // For each free variable, we set it to 1 and others to 0 to get a basis vector.
    const basisVectors: Fraction[][] = [];
    
    for (const freeCol of freeCols) {
        const solution = new Array(numCols).fill(new Fraction(0));
        solution[freeCol] = new Fraction(1);
        
        // Back substitute
        for (let i = pivotCols.length - 1; i >= 0; i--) {
            const row = i;
            const pivotCol = pivotCols[i];
            
            let sum = new Fraction(0);
            for (let j = pivotCol + 1; j < numCols; j++) {
                sum = sum.add(matrix[row][j].mul(solution[j]));
            }
            solution[pivotCol] = sum.neg();
        }
        basisVectors.push(solution);
    }
    
    if (basisVectors.length === 0) {
        // Trivial solution 0
         return new Array(numCols).fill(0);
    }
    
    // If only 1 basis vector, use it.
    if (basisVectors.length === 1) {
        return this.normalize(basisVectors[0]);
    }
    
    // If multiple basis vectors exist, find a positive linear combination
    // Search for small integer weights to ensure all coefficients are non-negative
    let bestVector: Fraction[] | null = null;
    
    // Normalize each basis first so they are comparable
    const normalizedBasis = basisVectors.map(v => v); // No-op if already 1 or 0, but can ensure positive leader?
    // Actually, basis vectors from RREF might have negative components.
    
    /**
     * Recursively search for a linear combination of basis vectors
     * that yields all non-negative coefficients.
     * Uses small integer weights (1 to MAX_WEIGHT_SEARCH) to combine vectors.
     */
    const searchWeights = (index: number, currentVec: Fraction[]) => {
        if (index === basisVectors.length) {
            // Check if valid (all components non-negative)
            // Prefer solution with fewest zeros if multiple exist
            const isNonNegative = currentVec.every(v => v.s >= 0); 
            if (isNonNegative) {
                const zeroCount = currentVec.filter(v => v.equals(0)).length;
                if (!bestVector) {
                    bestVector = currentVec;
                } else {
                    const bestZeros = bestVector.filter(v => v.equals(0)).length;
                    if (zeroCount < bestZeros) {
                        bestVector = currentVec;
                    }
                }
            }
            return;
        }
        
        // Try weights 1 to MAX_WEIGHT_SEARCH
        for (let w = 1; w <= MAX_WEIGHT_SEARCH; w++) {
            const weight = new Fraction(w);
            const weightedBasis = basisVectors[index].map(v => v.mul(weight));
            const nextVec = currentVec.map((v, i) => v.add(weightedBasis[i]));
            
            searchWeights(index + 1, nextVec);
            if (bestVector && bestVector.every(v => v.n > 0)) return; 
        }
    };
    
    // Start search with initial zero vector
    searchWeights(0, new Array(numCols).fill(new Fraction(0)));
    
    if (bestVector) {
        return this.normalize(bestVector);
    }
    
    // Fallback: simple sum of basis vectors
    let fallbackVector = new Array(numCols).fill(new Fraction(0));
    for (const vec of normalizedBasis) {
        for(let i=0; i<numCols; i++) {
           fallbackVector[i] = fallbackVector[i].add(vec[i]);
        }
    }
    return this.normalize(fallbackVector);
  }

  /**
   * Converts matrix to Reduced Row Echelon Form in-place.
   */
  private static toRREF(matrix: Fraction[][]) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;

    for (let r = 0; r < numRows; r++) {
      if (numCols <= lead) return;

      let i = r;
      while (matrix[i][lead].equals(0)) {
        i++;
        if (numRows === i) {
          i = r;
          lead++;
          if (numCols === lead) return;
        }
      }

      // Swap rows i and r
      [matrix[i], matrix[r]] = [matrix[r], matrix[i]];

      // Divide row r by matrix[r][lead] to make pivot 1
      const val = matrix[r][lead];
      for (let j = 0; j < numCols; j++) {
        matrix[r][j] = matrix[r][j].div(val);
      }

      // Eliminate other rows
      for (let i = 0; i < numRows; i++) {
        if (i !== r) {
          const val = matrix[i][lead];
          for (let j = 0; j < numCols; j++) {
            matrix[i][j] = matrix[i][j].sub(val.mul(matrix[r][j]));
          }
        }
      }
      lead++;
    }
  }

  /**
   * Normalizes a vector of Fractions to smallest positive integers.
   */
  private static normalize(vector: Fraction[]): number[] {
    // Fraction.js (in newer versions) uses BigInt for n and d.
    // We strictly cast them to number for chemistry coefficients which are small ints.
    
    // Find LCM of all denominators
    let lcmDenom = 1;
    for (const val of vector) {
        const d = Number(val.d); // Cast bigint to number
        lcmDenom = this.lcm(lcmDenom, d);
    }
    
    // Convert to integers by multiplying by LCM
    const integers = vector.map(v => {
        const n = Number(v.n);
        const d = Number(v.d);
        const s = Number(v.s);
        // value = s * n / d
        // scaled = value * lcm = s * n * (lcm / d)
        return s * n * (lcmDenom / d);
    });
    
    // Enforce positive coefficients (absolute value)
    let finalRes = integers.map(x => Math.abs(x));
    
    // Reduce by GCD of all numerators to get simplest form (Lowest Common Ratio)
    let commonGCD = finalRes[0];
    for(let i=1; i<finalRes.length; i++) {
        commonGCD = this.gcd(commonGCD, finalRes[i]);
    }
    
    if (commonGCD === 0) return finalRes; // Should not happen for valid reactions
    
    return finalRes.map(x => x / commonGCD);
  }
  
  private static gcd(a: number, b: number): number {
    if (!b) return a;
    return this.gcd(b, a % b);
  }
  
  private static lcm(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return (a * b) / this.gcd(a, b);
  }
}

