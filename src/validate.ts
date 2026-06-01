const WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7]

export function normalize(nip: string): string {
  return nip.replace(/[\s-]/g, '')
}

export function validate(nip: string): boolean {
  const clean = normalize(nip)
  if (!/^\d{10}$/.test(clean)) return false

  const digits = clean.split('').map(Number)
  const sum = WEIGHTS.reduce((acc, w, i) => acc + w * digits[i], 0)
  const remainder = sum % 11

  if (remainder === 10) return false
  return remainder === digits[9]
}
