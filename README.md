# nip-lookup

[![npm version](https://img.shields.io/npm/v/nip-lookup)](https://www.npmjs.com/package/nip-lookup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

TypeScript wrapper for Polish company data lookup by NIP number, using the **Biała Lista** (White List) API provided by the Polish Ministry of Finance (Ministerstwo Finansów). No API key required.

---

## Installation

```bash
npm install nip-lookup
```

---

## Usage

### TypeScript

```typescript
import { lookup, validate, normalize } from 'nip-lookup'

// Full company lookup
const result = await lookup('5213289390')
if (result.success && result.data) {
  console.log(result.data.name)        // "Example Sp. z o.o."
  console.log(result.data.vatStatus)   // "active"
  console.log(result.data.bankAccounts)
}

// Lookup with a specific date
const result2 = await lookup('5213289390', { date: '2024-01-15' })

// Validate a NIP without fetching
console.log(validate('5213289390')) // true
console.log(validate('0000000000')) // false

// Normalize (strip dashes and spaces)
console.log(normalize('521-328-93-90')) // "5213289390"
```

### JavaScript (CommonJS)

```javascript
const { lookup, validate, normalize } = require('nip-lookup')

lookup('5213289390').then(result => {
  if (result.success) {
    console.log(result.data)
  } else {
    console.error(result.error)
  }
})
```

### CLI

```bash
# Using npx (no install needed)
npx nip-lookup 5213289390

# Or if installed globally
nip-lookup 5213289390
```

Example output:

```
✅ NIP: 5213289390 — prawidłowy
📋 Nazwa:        Example Sp. z o.o.
🏢 REGON:        123456789
📜 KRS:          0000123456
📍 Adres:        ul. Marszałkowska 1, 00-001 Warszawa
💳 Status VAT:   Czynny (active)
🏦 Konta bankowe:
→ 12 1234 5678 9012 3456 7890 1234
```

---

## API Reference

### `lookup(nip, options?): Promise<LookupResult>`

Fetches company data from the Biała Lista API.

| Parameter | Type | Description |
|-----------|------|-------------|
| `nip` | `string` | NIP number (dashes and spaces are stripped automatically) |
| `options.date` | `string` | Date in `YYYY-MM-DD` format (defaults to today) |

Returns a `LookupResult`:

```typescript
interface LookupResult {
  success: boolean
  data?: CompanyData
  error?: string
}
```

The `CompanyData` object:

```typescript
interface CompanyData {
  nip: string
  name: string
  regon?: string
  krs?: string
  address: {
    street?: string
    city?: string
    zipCode?: string
  }
  vatStatus: 'active' | 'inactive' | 'exempt' | 'unknown'
  bankAccounts: string[]
  source: 'mf'
  fetchedAt: string  // ISO date string
}
```

---

### `validate(nip): boolean`

Validates a NIP number using the official Polish checksum algorithm.

| Parameter | Type | Description |
|-----------|------|-------------|
| `nip` | `string` | NIP number (dashes and spaces allowed) |

Returns `true` if the NIP is structurally valid, `false` otherwise.

---

### `normalize(nip): string`

Strips dashes and spaces from a NIP string, returning a clean 10-character string.

| Parameter | Type | Description |
|-----------|------|-------------|
| `nip` | `string` | Raw NIP string |

---

## Data Source

All data is fetched from the **Biała Lista podatników VAT** (VAT White List) — an official registry maintained by the Polish Ministry of Finance. The API endpoint is publicly accessible and requires no authentication.

- Base URL: `https://wl-api.mf.gov.pl/api/search/nip/{nip}?date={date}`
- Coverage: All Polish VAT-registered entities
- Historical data: Supported via the `date` option

---

## Polski opis

`nip-lookup` to biblioteka TypeScript do pobierania danych firmowych na podstawie numeru NIP, korzystająca z oficjalnego API Białej Listy Ministerstwa Finansów. Nie wymaga klucza API.

**Instalacja:** `npm install nip-lookup`

**Dane:** nazwa firmy, REGON, KRS, adres, status VAT, numery kont bankowych.

---

Built with ❤️ by [Monetal Agency](https://monetal.agency)
