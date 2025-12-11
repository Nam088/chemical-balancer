import { Parser } from './parser';
import { MathSolver } from './solver';
import { BalancedResult, ElementCounts } from './types';
import { t } from './i18n';

/**
 * Main class for balancing chemical equations.
 * Uses Gaussian elimination to find stoichiometric coefficients.
 *
 * @example
 * ```typescript
 * import { ChemicalBalancer } from '@nam088/chemical-balancer';
 *
 * // Simple equation
 * const result = ChemicalBalancer.balance('H2 + O2 -> H2O');
 * console.log(result.balancedString); // '2H2 + O2 -> 2H2O'
 *
 * // Complex organic combustion
 * const result2 = ChemicalBalancer.balance('C6H12O6 -> C2H5OH + CO2');
 * console.log(result2.balancedString); // 'C6H12O6 -> 2C2H5OH + 2CO2'
 * ```
 */
export class ChemicalBalancer {
  /**
   * Balances a chemical equation string.
   *
   * @param equation - The chemical equation to balance.
   *   Supports separators: `->`, `=>`, `=`, `→`, `⇌`
   *   Supports parentheses: `Ca(OH)2`, `(NH4)2SO4`
   *   Supports hydrates: `CuSO4.5H2O`
   *   Supports ionic charges: `Fe^3+`, `e-`
   *
   * @returns A {@link BalancedResult} object containing:
   *   - `status`: 'success' or 'error'
   *   - `coefficients`: Map of molecule to its coefficient
   *   - `balancedString`: The balanced equation string
   *   - `message`: Error message if status is 'error'
   *   - `debug`: Detailed parsing and balance verification info
   *
   * @example
   * ```typescript
   * const result = ChemicalBalancer.balance('Fe + O2 -> Fe2O3');
   * // result.status === 'success'
   * // result.balancedString === '4Fe + 3O2 -> 2Fe2O3'
   * // result.coefficients === { Fe: 4, O2: 3, Fe2O3: 2 }
   * ```
   */
  static balance(equation: string): BalancedResult {
    try {
        if (!equation || equation.trim() === '') {
            throw new Error(t('error.empty_equation'));
        }

        // Split reactants and products
        // Support "->" or "=" or "=>" or "→" or "⇌"
        const separator = equation.match(/->|=>|=|→|⇌/);
        if (!separator) {
             throw new Error(t('error.missing_separator'));
        }

        const parts = equation.split(separator[0]);
        if (parts.length !== 2) {
             throw new Error(t('error.multiple_separators'));
        }

        const reactantsStr = parts[0];
        const productsStr = parts[1];

        // Capture user-provided coefficients
        const userCoefficients: Record<string, number> = {};

        // Parse molecules
        // Use a regex to split by "+" but ONLY if it is a separator.
        // Rule: A "+" is a separator if it is surrounded by spaces (" + ") or is at start/end (unlikely).
        // If we just split by " + " (space plus space), we are safe for "Fe^3+ + e-".
        // But we must support "A + B" (one space).
        // Let's split by regex: /\s+\+\s+/
        const parseSide = (sideStr: string): { molecules: string[]; counts: ElementCounts[] } => {
            const molecules = sideStr.split(/\s+\+\s+/).map(s => {
                let m = s.trim();
                
                // Extract and capture coeff
                const match = m.match(/^(\d+)(.+)/);
                if (match) {
                    const coeff = parseInt(match[1], 10);
                    const name = match[2].trim();
                    userCoefficients[name] = coeff;
                    return name;
                }
                
                // If no digits or not match properly (just molecule)
                return m;
            }).filter(s => s !== '');
            
            if (molecules.length === 0) return { molecules: [], counts: [] };
            
            const counts = molecules.map(m => Parser.parseFormula(m));
            return { molecules, counts };
        };

        const reactantsData = parseSide(reactantsStr);
        const productsData = parseSide(productsStr);

        if (reactantsData.molecules.length === 0 || productsData.molecules.length === 0) {
            throw new Error(t('error.missing_reactants_or_products'));
        }

        // Validate elements conservation
        const getElements = (data: ElementCounts[]) => new Set(data.flatMap(d => Object.keys(d)));
        const rElements = getElements(reactantsData.counts);
        const pElements = getElements(productsData.counts);

        // Check for missing elements
        // Note: Charge '_Q' is handled implicitly by MathSolver if present in uniqueElements.
        // We skip strict presence check for '_Q' because a neutral side won't have it explicitly.
        
        const allElementsUnion = new Set([...rElements, ...pElements]);
        
        for (const el of allElementsUnion) {
             if (el === '_Q') continue; 
             
             if (!rElements.has(el)) {
                 throw new Error(t('error.element_missing_in_reactants', { element: el }));
             }
             if (!pElements.has(el)) {
                 throw new Error(t('error.element_missing_in_products', { element: el }));
             }
        }
        
        const allElements = Array.from(allElementsUnion).sort();
        
        // Solve
        const solveResult = MathSolver.solve(reactantsData.counts, productsData.counts);

        // Determine Scaling Factor based on constraints
        let scalingFactor = 1;
        
        // Check constraints
        // We look for a consistent scaling factor: userCoeff / solverCoeff
        // If multiple defined, they must match (approx).
        // If inconsistent, we ignore user input (fallback to minimal).
        
        let consistent = true;
        let detectedScale: number | null = null;
        
        const rMols = reactantsData.molecules;
        const pMols = productsData.molecules;
        
        // Helper to check
        const checkScaling = (mol: string, baseCoeff: number) => {
            if (userCoefficients[mol] !== undefined) {
                const userVal = userCoefficients[mol];
                // Scale = user / base
                if (baseCoeff === 0) return; // Should not happen in valid balance
                
                const s = userVal / baseCoeff;
                if (detectedScale === null) {
                    detectedScale = s;
                } else {
                    if (detectedScale !== s) {
                        consistent = false;
                    }
                }
            }
        };
        
        const rCoeffsRaw = solveResult.slice(0, rMols.length);
        const pCoeffsRaw = solveResult.slice(rMols.length);
        
        rMols.forEach((m, i) => checkScaling(m, rCoeffsRaw[i]));
        pMols.forEach((m, i) => checkScaling(m, pCoeffsRaw[i]));
        
        if (consistent && detectedScale !== null && detectedScale > 0) {
            if (Number.isInteger(detectedScale)) {
                 scalingFactor = detectedScale;
            } else {
                 // Warn? Or ignore float scaling?
                 // Usually for school problems, scaling is integer. 
                 // If floating (e.g. 1.5), we might support it, but let's stick to int to keep coeffs integer.
                 if (Number.isInteger(detectedScale * 100000)) scalingFactor = detectedScale; // allow float?
                 // Just integer for now to be safe with "avoid wrong input"
                 if (detectedScale % 1 === 0) scalingFactor = detectedScale;
            }
        }

        // Apply scaling
        const rCoeffs = rCoeffsRaw.map(x => x * scalingFactor);
        const pCoeffs = pCoeffsRaw.map(x => x * scalingFactor);

        // Construct result
        const coefficients: Record<string, number> = {};
        let balancedString = '';

        // Helper to format part
        const formatSide = (molecules: string[], values: number[]): string => {
            return molecules.map((mol, i) => {
                const coeff = values[i];
                coefficients[mol] = coeff; // Store in coefficients map
                return (coeff === 1 ? '' : coeff) + mol;
            }).join(' + ');
        };

        const lhs = formatSide(reactantsData.molecules, rCoeffs);
        const rhs = formatSide(productsData.molecules, pCoeffs);
        balancedString = `${lhs} -> ${rhs}`;
        
        // Debug info construction
        const debugReactants: Record<string, ElementCounts> = {};
        reactantsData.molecules.forEach((m, i) => debugReactants[m] = reactantsData.counts[i]);
        
        const debugProducts: Record<string, ElementCounts> = {};
        productsData.molecules.forEach((m, i) => debugProducts[m] = productsData.counts[i]);
        
        // Calculate total atoms for balance check
        const balanceCheck: Record<string, { left: number; right: number }> = {};
        allElements.forEach(el => {
            let left = 0;
            reactantsData.counts.forEach((c, i) => {
                left += (c[el] || 0) * rCoeffs[i];
            });
            let right = 0;
            productsData.counts.forEach((c, i) => {
                right += (c[el] || 0) * pCoeffs[i];
            });
            balanceCheck[el] = { left, right };
        });

        return {
            status: 'success',
            coefficients,
            balancedString,
            debug: {
                elements: allElements,
                reactants: debugReactants,
                products: debugProducts,
                balanceCheck
            }
        };

    } catch (err: unknown) {
        return {
            status: 'error',
            message: err instanceof Error ? err.message : String(err)
        };
    }
  }
}
