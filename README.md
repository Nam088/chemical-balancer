# Chemical Equation Balancer

A lightweight TypeScript library for chemistry calculations: equation balancing, molar mass, stoichiometry, and more.

## Features

- **Balance Equations** - Using Gaussian elimination
- **Molar Mass Calculator** - All 118 elements
- **Stoichiometry** - Mol/gram conversions
- **Limiting Reagent** - Find what runs out first
- **Reaction Classifier** - Combustion, acid-base, redox, etc.
- **State Annotations** - Support for `(s)`, `(l)`, `(g)`, `(aq)`

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
import { calculateMolarMass } from '@nam088/chemical-balancer';

calculateMolarMass('H2O');     // 18.015
calculateMolarMass('C6H12O6'); // 180.16
calculateMolarMass('NaCl');    // 58.44
```

### Stoichiometry

```typescript
import { calculateStoichiometry } from '@nam088/chemical-balancer';

// How many grams of H2O from 2 moles of H2?
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
console.log(result.excess);   // [{ molecule: 'H2', remaining: 2 }]
```

### Classify Reactions

```typescript
import { classifyReaction } from '@nam088/chemical-balancer';

classifyReaction('CH4 + O2 -> CO2 + H2O');
// { type: 'combustion', confidence: 0.95 }

classifyReaction('HCl + NaOH -> NaCl + H2O');
// { type: 'acid-base', confidence: 0.9 }
```

### Parse with State Annotations

```typescript
import { Parser } from '@nam088/chemical-balancer';

Parser.parseFormulaWithState('H2O(l)');
// { elements: { H: 2, O: 1 }, state: 'l' }

Parser.parseFormulaWithState('NaCl(aq)');
// { elements: { Na: 1, Cl: 1 }, state: 'aq' }
```

## Advanced: The Monster Equation

The library handles extremely complex equations:

```typescript
const input = '[Cr(N2H4CO)6]4[Cr(CN)6]3 + KMnO4 + H2SO4 -> K2Cr2O7 + MnSO4 + CO2 + KNO3 + K2SO4 + H2O';
const result = ChemicalBalancer.balance(input);
// Coefficients up to 1879!
```

## API Reference

| Function | Description |
|----------|-------------|
| `ChemicalBalancer.balance(eq)` | Balance a chemical equation |
| `calculateMolarMass(formula)` | Get molar mass in g/mol |
| `calculateMolarMassDetailed(formula)` | Molar mass with element breakdown |
| `calculateStoichiometry(input)` | Mol/gram conversions |
| `findLimitingReagent(input)` | Find limiting reagent |
| `classifyReaction(eq)` | Classify reaction type |
| `Parser.parseFormula(formula)` | Parse to element counts |
| `Parser.parseFormulaWithState(formula)` | Parse with state annotation |
| `isValidElement(symbol)` | Check if element exists |
| `setLocale(locale)` | Set language ('en' or 'vi') |

## Internationalization (i18n)

The library supports English and Vietnamese for error messages and reaction classification:

```typescript
import { setLocale, classifyReaction } from '@nam088/chemical-balancer';

// Default: English
classifyReaction('CH4 + O2 -> CO2 + H2O');
// { typeName: 'Combustion', reason: 'Reaction involves O2...' }

// Switch to Vietnamese
setLocale('vi');
classifyReaction('CH4 + O2 -> CO2 + H2O');
// { typeName: 'Phản ứng đốt cháy', reason: 'Phản ứng có O2...' }
```

## License

MIT
