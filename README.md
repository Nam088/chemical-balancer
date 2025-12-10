# Chemical Equation Balancer

A lightweight TypeScript library to balance chemical equations using linear algebra (Gaussian elimination).

## Features

- Balances complex chemical equations.
- Handles parentheses and nested groups (e.g., `(NH4)2SO4`).
- Validates equation syntax and conservation of mass.
- Returns detailed structured data including stoichiometric coefficients and debug information.
- Supports both `->` and `=` separators.

## Installation

```bash
npm install @nam088/chemical-balancer
```

## Usage

```typescript
import { ChemicalBalancer } from '@nam088/chemical-balancer';

const result = ChemicalBalancer.balance('H2 + O2 -> H2O');
console.log(result);

/* Output:
{
  status: 'success',
  coefficients: { H2: 2, O2: 1, H2O: 2 },
  balancedString: '2H2 + O2 -> 2H2O',
  debug: {
    elements: ['H', 'O'],
    reactants: { H2: {H: 2}, O2: {O: 2} },
    products: { H2O: {H: 2, O: 1} },
    balanceCheck: {
      H: { left: 4, right: 4 },
      O: { left: 2, right: 2 }
    }
  }
}
*/
```

## Advanced Example ("The Monster Equation")

The library can handle extremely complex equations with large coefficients, such as this famous "Monster" equation:

```typescript
const input = '[Cr(N2H4CO)6]4[Cr(CN)6]3 + KMnO4 + H2SO4 -> K2Cr2O7 + MnSO4 + CO2 + KNO3 + K2SO4 + H2O';
const result = ChemicalBalancer.balance(input);
console.log(result.balancedString);

// Output:
// 10(Cr(N2H4CO)6)4(Cr(CN)6)3 + 1176KMnO4 + 1399H2SO4 -> 35K2Cr2O7 + 1176MnSO4 + 420CO2 + 660KNO3 + 223K2SO4 + 1879H2O
```

## Error Handling

The library returns a status of `error` with a message if the equation is invalid or impossible to balance.

```typescript
const result = ChemicalBalancer.balance('H2 -> O2');
console.log(result);
// { status: 'error', message: "Element 'H' is present in reactants but missing in products" }
```

## API

### `ChemicalBalancer.balance(equation: string): BalancedResult`

Parses and balances the given chemical equation string.

**Parameters:**
- `equation`: A string representing the chemical reaction (e.g., `"Fe + O2 -> Fe2O3"`).

**Returns:**
- `BalancedResult`: An object containing:
    - `status`: `'success' | 'error'`
    - `coefficients`: Map of molecule to its balanced coefficient.
    - `balancedString`: The fully balanced equation string.
    - `message`: Error message (if status is error).
    - `debug`: Detailed info about parsing and atom counts.
