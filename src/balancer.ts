import { Parser } from './parser';
import { MathSolver } from './solver';
import { BalancedResult, ElementCounts } from './types';

export class ChemicalBalancer {
  /**
   * Balances a chemical equation string.
   * Input: "H2 + O2 -> H2O"
   */
  static balance(equation: string): BalancedResult {
    try {
        if (!equation || equation.trim() === '') {
            throw new Error('Empty equation');
        }

        // Split reactants and products
        // Support "->" or "=" or "=>" or "→" or "⇌"
        const separator = equation.match(/->|=>|=|→|⇌/);
        if (!separator) {
             throw new Error('Invalid equation syntax: missing separator (->, =>, =)');
        }

        const parts = equation.split(separator[0]);
        if (parts.length !== 2) {
             throw new Error('Invalid equation syntax: multiple separators found');
        }

        const reactantsStr = parts[0];
        const productsStr = parts[1];

        // Capture user-provided coefficients
        const userCoefficients: Record<string, number> = {};

        // Parse molecules
        const parseSide = (sideStr: string): { molecules: string[]; counts: ElementCounts[] } => {
            const molecules = sideStr.split('+').map(s => {
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
            throw new Error('Missing reactants or products');
        }

        // Validate elements conservation
        const getElements = (data: ElementCounts[]) => new Set(data.flatMap(d => Object.keys(d)));
        const rElements = getElements(reactantsData.counts);
        const pElements = getElements(productsData.counts);

        // Check for missing elements
        for (const el of rElements) {
            if (!pElements.has(el)) {
                 throw new Error(`Element '${el}' is present in reactants but missing in products`);
            }
        }
        for (const el of pElements) {
            if (!rElements.has(el)) {
                 throw new Error(`Element '${el}' is present in products but missing in reactants`);
            }
        }

        const allElements = Array.from(rElements).sort();

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

    } catch (err: any) {
        return {
            status: 'error',
            message: err.message
        };
    }
  }
}
