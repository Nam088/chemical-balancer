import { ChemicalBalancer } from './balancer';

describe('Advanced Chemical Balancing Features', () => {

    describe('Hydrates Support', () => {
        test('should balance simple hydrate decomposition: CuSO4.5H2O -> CuSO4 + H2O', () => {
            const input = 'CuSO4.5H2O -> CuSO4 + H2O';
            const expected = 'CuSO4.5H2O -> CuSO4 + 5H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance complex hydrate: Na2CO3.10H2O -> Na2CO3 + H2O', () => {
            const input = 'Na2CO3.10H2O -> Na2CO3 + H2O';
            const expected = 'Na2CO3.10H2O -> Na2CO3 + 10H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });
        
        test('should balance hydrate formation: MgSO4 + H2O -> MgSO4.7H2O', () => {
             const input = 'MgSO4 + H2O -> MgSO4.7H2O';
             const expected = 'MgSO4 + 7H2O -> MgSO4.7H2O';
             const result = ChemicalBalancer.balance(input);
             expect(result.status).toBe('success');
             expect(result.balancedString).toBe(expected);
        });
    });

    describe('Ions and Charge Balancing', () => {
        test('should balance half-reaction: Fe^3+ + e- -> Fe^2+', () => {
            const input = 'Fe^3+ + e- -> Fe^2+';
            // 1 Fe^3+ + 1 e- -> 1 Fe^2+
            const expected = 'Fe^3+ + e- -> Fe^2+';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance half-reaction: Cu -> Cu^2+ + e-', () => {
            const input = 'Cu -> Cu^2+ + e-';
            // Cu -> Cu^2+ + 2e-
            const expected = 'Cu -> Cu^2+ + 2e-';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance complex redox with ions: MnO4- + H+ + e- -> Mn^2+ + H2O', () => {
            const input = 'MnO4- + H+ + e- -> Mn^2+ + H2O';
            // MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O
            const expected = 'MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance dichromate reduction: Cr2O7^2- + H+ + e- -> Cr^3+ + H2O', () => {
            const input = 'Cr2O7^2- + H+ + e- -> Cr^3+ + H2O';
            // Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O
            const expected = 'Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });
        
        test('should handle simple unit charges without caret: Na+ + Cl- -> NaCl', () => {
             const input = 'Na+ + Cl- -> NaCl';
             const expected = 'Na+ + Cl- -> NaCl';
             const result = ChemicalBalancer.balance(input);
             expect(result.status).toBe('success');
             expect(result.balancedString).toBe(expected);
        });

        test('should handle electron notation variations: e, e-, e^-', () => {
             // Use 'e'
             const r1 = ChemicalBalancer.balance('Na -> Na+ + e');
             expect(r1.balancedString).toBe('Na -> Na+ + e');
             
             // Use 'e^-'
             const r2 = ChemicalBalancer.balance('Na -> Na+ + e^-');
             expect(r2.balancedString).toBe('Na -> Na+ + e^-');
        });
    });
    
    describe('Robustness and Separators', () => {
        test('should handle equation with extra spaces around separator', () => {
            const input = 'Fe^3+   +    e-    ->   Fe^2+';
            const expected = 'Fe^3+ + e- -> Fe^2+'; // Output formatting standardizes to ' + '
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            // Note: Our formatter might strip extra spaces in output, which is good.
            expect(result.balancedString).toBe(expected);
        });

        test('should handle equation with minimal spaces around separator', () => {
            // Note: We require at least one space around "+" if it is a separator, to distinguish from ions.
            // "Na+ + Cl-" is valid. "Na++Cl-" is invalid (ambiguous).
            const input = 'Na+ + Cl- -> NaCl';
            const expected = 'Na+ + Cl- -> NaCl';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });
    });

    describe('More Complex Hydrate Scenarios', () => {
        test('should balance Al2(SO4)3.18H2O formation', () => {
            const input = 'Al2(SO4)3 + H2O -> Al2(SO4)3.18H2O';
            const expected = 'Al2(SO4)3 + 18H2O -> Al2(SO4)3.18H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance Double Salt Hydrate (Mohr\'s Salt): FeSO4 + (NH4)2SO4 + H2O -> Fe(NH4)2(SO4)2.6H2O', () => {
            const input = 'FeSO4 + (NH4)2SO4 + H2O -> Fe(NH4)2(SO4)2.6H2O';
            const expected = 'FeSO4 + (NH4)2SO4 + 6H2O -> Fe(NH4)2(SO4)2.6H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });
    });

    describe('Advanced Redox & Half-Reactions', () => {
        test('should balance disproportionation of Chlorine in basic solution: Cl2 + OH- -> Cl- + ClO3- + H2O', () => {
            // 3Cl2 + 6OH- -> 5Cl- + ClO3- + 3H2O
            const input = 'Cl2 + OH- -> Cl- + ClO3- + H2O';
            const expected = '3Cl2 + 6OH- -> 5Cl- + ClO3- + 3H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance acidic permanganate and oxalate: MnO4- + C2O4^2- + H+ -> Mn^2+ + CO2 + H2O', () => {
            // 2MnO4- + 5C2O4^2- + 16H+ -> 2Mn^2+ + 10CO2 + 8H2O
            const input = 'MnO4- + C2O4^2- + H+ -> Mn^2+ + CO2 + H2O';
            const expected = '2MnO4- + 5C2O4^2- + 16H+ -> 2Mn^2+ + 10CO2 + 8H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });

        test('should balance Zinc in acid half-reaction: Zn -> Zn^2+ + e-', () => {
             const input = 'Zn -> Zn^2+ + e-';
             const expected = 'Zn -> Zn^2+ + 2e-';
             const result = ChemicalBalancer.balance(input);
             expect(result.status).toBe('success');
             expect(result.balancedString).toBe(expected);
        });
        
        test('should balance Hydrogen peroxide reduction: H2O2 + H+ + e- -> H2O', () => {
            // H2O2 + 2H+ + 2e- -> 2H2O
            const input = 'H2O2 + H+ + e- -> H2O';
            const expected = 'H2O2 + 2H+ + 2e- -> 2H2O';
            const result = ChemicalBalancer.balance(input);
            expect(result.status).toBe('success');
            expect(result.balancedString).toBe(expected);
        });
    });
});
