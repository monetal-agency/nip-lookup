#!/usr/bin/env node

import { lookup, validate, normalize } from './src/index'

async function main() {
  const raw = process.argv[2]

  if (!raw) {
    console.error('Usage: nip-lookup <NIP>')
    process.exit(1)
  }

  const clean = normalize(raw)

  if (!validate(clean)) {
    console.log('❌ Podany NIP jest nieprawidłowy.')
    process.exit(1)
  }

  console.log(`✅ NIP: ${clean} — prawidłowy`)

  const result = await lookup(clean)

  if (!result.success) {
    if (result.error?.startsWith('No company found')) {
      console.log(`⚠️  Nie znaleziono firmy dla NIP: ${clean}`)
    } else {
      console.log(`🔴 Błąd: ${result.error}`)
    }
    process.exit(1)
  }

  const d = result.data!
  const vatLabel: Record<string, string> = {
    active: 'Czynny',
    exempt: 'Zwolniony',
    inactive: 'Niezarejestrowany',
    unknown: 'Nieznany',
  }

  const addressParts = [d.address.street, d.address.zipCode, d.address.city].filter(Boolean)
  const addressStr = addressParts.join(', ') || '—'

  console.log(`📋 Nazwa:        ${d.name}`)
  if (d.regon) console.log(`🏢 REGON:        ${d.regon}`)
  if (d.krs)   console.log(`📜 KRS:          ${d.krs}`)
  console.log(`📍 Adres:        ${addressStr}`)
  console.log(`💳 Status VAT:   ${vatLabel[d.vatStatus]} (${d.vatStatus})`)

  if (d.bankAccounts.length > 0) {
    console.log('🏦 Konta bankowe:')
    d.bankAccounts.forEach(acc => console.log(`→ ${acc}`))
  }
}

main().catch(err => {
  console.error(`🔴 Błąd: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})
