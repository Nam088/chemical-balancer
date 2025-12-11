# Cân Bằng Phương Trình Hóa Học

Thư viện TypeScript nhẹ cho các phép tính hóa học: cân bằng phương trình, khối lượng mol, tính toán theo phương trình, và nhiều hơn nữa.

## Tính Năng

- **Cân Bằng Phương Trình** - Sử dụng phương pháp khử Gauss
- **Tính Khối Lượng Mol** - Đầy đủ 118 nguyên tố
- **Tính Toán Theo Phương Trình** - Chuyển đổi mol/gram
- **Chất Phản Ứng Giới Hạn** - Tìm chất phản ứng hết trước
- **Phân Loại Phản Ứng** - Đốt cháy, acid-base, oxi-hóa khử, v.v.
- **Trạng Thái Vật Chất** - Hỗ trợ `(s)`, `(l)`, `(g)`, `(aq)`

## Cài Đặt

```bash
npm install @nam088/chemical-balancer
```

## Hướng Dẫn Sử Dụng

### Cân Bằng Phương Trình

```typescript
import { ChemicalBalancer } from '@nam088/chemical-balancer';

const result = ChemicalBalancer.balance('Fe + O2 -> Fe2O3');
console.log(result.balancedString); // '4Fe + 3O2 -> 2Fe2O3'
```

### Tính Khối Lượng Mol

```typescript
import { calculateMolarMass } from '@nam088/chemical-balancer';

calculateMolarMass('H2O');     // 18.015
calculateMolarMass('C6H12O6'); // 180.16 (glucose)
calculateMolarMass('NaCl');    // 58.44
```

### Tính Toán Theo Phương Trình

```typescript
import { calculateStoichiometry } from '@nam088/chemical-balancer';

// Tính số gram H2O tạo thành từ 2 mol H2
const result = calculateStoichiometry({
  equation: 'H2 + O2 -> H2O',
  given: { molecule: 'H2', amount: 2, unit: 'mol' },
  find: { molecule: 'H2O', unit: 'g' }
});
console.log(result.amount); // 36.03
```

### Chất Phản Ứng Giới Hạn

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

### Phân Loại Phản Ứng

```typescript
import { classifyReaction } from '@nam088/chemical-balancer';

classifyReaction('CH4 + O2 -> CO2 + H2O');
// { type: 'combustion', confidence: 0.95 }

classifyReaction('HCl + NaOH -> NaCl + H2O');
// { type: 'acid-base', confidence: 0.9 }
```

### Phân Tích Công Thức Với Trạng Thái

```typescript
import { Parser } from '@nam088/chemical-balancer';

Parser.parseFormulaWithState('H2O(l)');
// { elements: { H: 2, O: 1 }, state: 'l' }

Parser.parseFormulaWithState('NaCl(aq)');
// { elements: { Na: 1, Cl: 1 }, state: 'aq' }
```

## Nâng Cao: Phương Trình "Monster"

Thư viện xử lý được các phương trình cực kỳ phức tạp:

```typescript
const input = '[Cr(N2H4CO)6]4[Cr(CN)6]3 + KMnO4 + H2SO4 -> K2Cr2O7 + MnSO4 + CO2 + KNO3 + K2SO4 + H2O';
const result = ChemicalBalancer.balance(input);
// Hệ số lên đến 1879!
```

## Tham Khảo API

| Hàm | Mô Tả |
|-----|-------|
| `ChemicalBalancer.balance(eq)` | Cân bằng phương trình hóa học |
| `calculateMolarMass(formula)` | Tính khối lượng mol (g/mol) |
| `calculateMolarMassDetailed(formula)` | Khối lượng mol chi tiết theo nguyên tố |
| `calculateStoichiometry(input)` | Chuyển đổi mol/gram |
| `findLimitingReagent(input)` | Tìm chất phản ứng giới hạn |
| `classifyReaction(eq)` | Phân loại loại phản ứng |
| `Parser.parseFormula(formula)` | Phân tích thành số nguyên tử |
| `Parser.parseFormulaWithState(formula)` | Phân tích với trạng thái vật chất |
| `isValidElement(symbol)` | Kiểm tra nguyên tố có tồn tại |
| `setLocale(locale)` | Đặt ngôn ngữ ('en' hoặc 'vi') |

## Đa Ngôn Ngữ (i18n)

Thư viện hỗ trợ tiếng Anh và tiếng Việt cho thông báo lỗi và phân loại phản ứng:

```typescript
import { setLocale, classifyReaction } from '@nam088/chemical-balancer';

// Mặc định: Tiếng Anh
classifyReaction('CH4 + O2 -> CO2 + H2O');
// { typeName: 'Combustion', reason: 'Reaction involves O2...' }

// Chuyển sang tiếng Việt
setLocale('vi');
classifyReaction('CH4 + O2 -> CO2 + H2O');
// { typeName: 'Phản ứng đốt cháy', reason: 'Phản ứng có O2...' }
```

## Giấy Phép

MIT

