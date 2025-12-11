# Chemical Equation Balancer

A comprehensive TypeScript library for chemistry calculations: equation balancing, molar mass, stoichiometry, gas laws, pH, and more.

## Features

- **Balance Equations** - Using Gaussian elimination
- **Molar Mass Calculator** - All 118 elements with detailed breakdown
- **Stoichiometry** - Mol/gram conversions with step-by-step solutions
- **Limiting Reagent** - Find what runs out first
- **Reaction Classifier** - Combustion, acid-base, redox, etc.
- **Oxidation States** - Calculate oxidation numbers for compounds
- **Redox Balancer** - Balance redox reactions with half-reaction method
- **Empirical/Molecular Formula** - Calculate from composition data
- **Gas Laws** - Ideal gas law (PV=nRT) and combined gas law
- **Concentration** - Molarity, molality, dilutions
- **pH Calculator** - Strong/weak acids and bases, buffers
- **State Annotations** - Support for `(s)`, `(l)`, `(g)`, `(aq)`
- **i18n** - English and Vietnamese support

## Installation

```bash
npm install @nam088/chemical-balancer
```

## Quick Start

### Balance Equations

```typescript
import { ChemicalBalancer } from '@nam088/chemical-balancer';

const result = ChemicalBalancer.balance('Fe + O2 -> Fe2O3');
console.log(result.balancedString); // '4Fe + 3O2 -> 2Fe2O3'
```

### Calculate Molar Mass

```typescript
import { calculateMolarMass, calculateMolarMassDetailed } from '@nam088/chemical-balancer';

calculateMolarMass('H2O');     // 18.015
calculateMolarMass('C6H12O6'); // 180.16

// With detailed breakdown
const detailed = calculateMolarMassDetailed('H2SO4');
// { molarMass: 98.08, breakdown: { H: {...}, S: {...}, O: {...} } }
```

### Oxidation States

```typescript
import { calculateOxidationStates } from '@nam088/chemical-balancer';

calculateOxidationStates('H2SO4');
// { oxidationStates: { H: 1, S: 6, O: -2 }, success: true }

calculateOxidationStates('KMnO4');
// { oxidationStates: { K: 1, Mn: 7, O: -2 }, success: true }
```

### Gas Laws

```typescript
import { idealGasLaw, combinedGasLaw, STP } from '@nam088/chemical-balancer';

// Find volume at STP
idealGasLaw({ P: 1, PUnit: 'atm', n: 1, T: 273.15, TUnit: 'K' });
// { V: 22.4, solvedFor: 'V', ... }

// Combined gas law
combinedGasLaw({ P1: 1, V1: 10, T1: 300, P2: 2, T2: 300 });
// { V2: 5, solvedFor: 'V2', ... }
```

### pH Calculator

```typescript
import { calculatePH, strongAcidPH, weakAcidPH, bufferPH } from '@nam088/chemical-balancer';

// From [H+] concentration
calculatePH(0.001); // { pH: 3, pOH: 11, nature: 'acidic' }

// Strong acids (complete dissociation)
strongAcidPH(0.1); // { pH: 1, ... }

// Weak acids (with Ka)
weakAcidPH(0.1, 1.8e-5); // Acetic acid: { pH: 2.87, percentIonization: 1.34 }

// Buffer solutions (Henderson-Hasselbalch)
bufferPH(4.76, 0.1, 0.15); // 4.94
```

### Concentration

```typescript
import { calculateMolarity, calculateDilution, calculateMolality } from '@nam088/chemical-balancer';

calculateMolarity(0.5, 2); // { molarity: 0.25 }

// Dilution: M1V1 = M2V2
calculateDilution({ M1: 6, V1: 0.01, M2: 2 });
// { V2: 0.03, volumeToAdd: 0.02 }
```

### Empirical Formula

```typescript
import { calculateEmpiricalFormula, calculateMolecularFormula } from '@nam088/chemical-balancer';

// From percentage composition
calculateEmpiricalFormula([
  { element: 'C', mass: 40.0, unit: 'percent' },
  { element: 'H', mass: 6.7, unit: 'percent' },
  { element: 'O', mass: 53.3, unit: 'percent' }
]);
// { formula: 'CH2O', molarMass: 30.03 }

// Molecular formula from empirical + molar mass
calculateMolecularFormula('CH2O', 180.16);
// { formula: 'C6H12O6', multiplier: 6 }
```

### Stoichiometry

```typescript
import { calculateStoichiometry } from '@nam088/chemical-balancer';

const result = calculateStoichiometry({
  equation: 'H2 + O2 -> H2O',
  given: { molecule: 'H2', amount: 2, unit: 'mol' },
  find: { molecule: 'H2O', unit: 'g' }
});
console.log(result.amount); // 36.03
```

### Limiting Reagent

```typescript
import { findLimitingReagent } from '@nam088/chemical-balancer';

const result = findLimitingReagent({
  equation: 'H2 + O2 -> H2O',
  reagents: [
    { molecule: 'H2', amount: 4, unit: 'mol' },
    { molecule: 'O2', amount: 1, unit: 'mol' }
  ]
});
console.log(result.limiting); // 'O2'
```

## API Reference

| Function | Description |
|----------|-------------|
| `ChemicalBalancer.balance(eq)` | Balance a chemical equation |
| `calculateMolarMass(formula)` | Get molar mass in g/mol |
| `calculateMolarMassDetailed(formula)` | Molar mass with element breakdown |
| `calculateOxidationStates(formula)` | Get oxidation states |
| `calculateStoichiometry(input)` | Mol/gram conversions |
| `findLimitingReagent(input)` | Find limiting reagent |
| `classifyReaction(eq)` | Classify reaction type |
| `isRedoxReaction(eq)` | Check if reaction is redox |
| `idealGasLaw(input)` | Solve PV=nRT |
| `combinedGasLaw(input)` | P1V1/T1 = P2V2/T2 |
| `calculatePH(H+)` | pH from H+ concentration |
| `strongAcidPH(conc)` | pH of strong acid |
| `weakAcidPH(conc, Ka)` | pH of weak acid |
| `bufferPH(pKa, acid, base)` | Buffer pH |
| `calculateMolarity(mol, L)` | Calculate molarity |
| `calculateDilution(input)` | Dilution calculation |
| `calculateEmpiricalFormula(comp)` | Empirical formula |
| `calculateMolecularFormula(emp, mass)` | Molecular formula |
| `setLocale(locale)` | Set language ('en' or 'vi') |

## Advanced: The Monster Equation

The library handles extremely complex equations:

```typescript
const input = '[Cr(N2H4CO)6]4[Cr(CN)6]3 + KMnO4 + H2SO4 -> K2Cr2O7 + MnSO4 + CO2 + KNO3 + K2SO4 + H2O';
const result = ChemicalBalancer.balance(input);
// Coefficients up to 1879!
```

## Internationalization (i18n)

The library supports English and Vietnamese:

```typescript
import { setLocale, classifyReaction } from '@nam088/chemical-balancer';

setLocale('vi'); // Switch to Vietnamese
classifyReaction('CH4 + O2 -> CO2 + H2O');
// { typeName: 'Phản ứng đốt cháy', ... }
```

## License

MIT

