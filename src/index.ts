export { validate, normalize } from './validate'
export type { CompanyData, LookupResult, LookupOptions } from './types'

import { validate, normalize } from './validate'
import { fetchCompany } from './sources/mf'
import type { LookupOptions, LookupResult } from './types'

export async function lookup(nip: string, options?: LookupOptions): Promise<LookupResult> {
  const clean = normalize(nip)

  if (!validate(clean)) {
    return { success: false, error: 'Invalid NIP' }
  }

  return fetchCompany(clean, options?.date)
}
