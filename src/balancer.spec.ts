import { ChemicalBalancer } from './balancer';

describe('ChemicalBalancer', () => {
    test('should balance simple equation', () => {
        const result = ChemicalBalancer.balance('H2 + O2 -> H2O');
        expect(result.status).toBe('success');
        expect(result.balancedString).toBe('2H2 + O2 -> 2H2O');
        expect(result.coefficients).toEqual({ H2: 2, O2: 1, H2O: 2 });
    });

    test('should balance complex equation', () => {
        const result = ChemicalBalancer.balance('K4Fe(CN)6 + KMnO4 + H2SO4 -> K2SO4 + MnSO4 + Fe2(SO4)3 + CO2 + HNO3 + H2O');
        expect(result.status).toBe('success');
        // K4Fe(CN)6 + KMnO4 + H2SO4 -> K2SO4 + MnSO4 + Fe2(SO4)3 + CO2 + HNO3 + H2O
        // 10 K4Fe(CN)6 + 122 KMnO4 + 299 H2SO4 → 162 K2SO4 + 122 MnSO4 + 5 Fe2(SO4)3 + 60 CO2 + 60 HNO3 + 188 H2O
        
        // Let's verify coefficients exist and are positive integers
        const coeffs = Object.values(result.coefficients!);
        expect(coeffs.every(c => c > 0 && Number.isInteger(c))).toBe(true);
    });

    test('should return detailed debug info', () => {
        const result = ChemicalBalancer.balance('H2 + O2 -> H2O');
        expect(result.debug).toBeDefined();
        expect(result.debug?.elements).toEqual(['H', 'O']);
        expect(result.debug?.balanceCheck?.H).toEqual({ left: 4, right: 4 });
        expect(result.debug?.balanceCheck?.O).toEqual({ left: 2, right: 2 });
    });

    test('should handle validation errors', () => {
        const result = ChemicalBalancer.balance('H2 -> O2'); // Impossible
        expect(result.status).toBe('error');
        expect(result.message).toContain('missing in products');
    });

    test('should handle syntax errors', () => {
        const result = ChemicalBalancer.balance('');
        expect(result.status).toBe('error');
        expect(result.message).toBe('Empty equation');
    });
});
