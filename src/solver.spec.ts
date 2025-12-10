import { MathSolver } from './solver';
import { ElementCounts } from './types';

describe('MathSolver', () => {
    test('should balance H2 + O2 -> H2O', () => {
        // H2, O2 -> H2O
        const reactants: ElementCounts[] = [{ H: 2 }, { O: 2 }];
        const products: ElementCounts[] = [{ H: 2, O: 1 }];
        
        const coeffs = MathSolver.solve(reactants, products);
        expect(coeffs).toEqual([2, 1, 2]);
    });

    test('should balance CH4 + O2 -> CO2 + H2O', () => {
        // CH4 + O2 -> CO2 + H2O
        const reactants: ElementCounts[] = [{ C: 1, H: 4 }, { O: 2 }];
        const products: ElementCounts[] = [{ C: 1, O: 2 }, { H: 2, O: 1 }];
        
        const coeffs = MathSolver.solve(reactants, products);
        expect(coeffs).toEqual([1, 2, 1, 2]);
    });
    
    test('should balance KClO3 -> KCl + O2', () => {
      const reactants: ElementCounts[] = [{ K: 1, Cl: 1, O: 3 }];
      const products: ElementCounts[] = [{ K: 1, Cl: 1 }, { O: 2 }];
      const coeffs = MathSolver.solve(reactants, products);
      expect(coeffs).toEqual([2, 2, 3]);
    });
});

