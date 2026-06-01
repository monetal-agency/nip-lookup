export interface CompanyData {
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
  fetchedAt: string
}

export interface LookupOptions {
  date?: string // YYYY-MM-DD, defaults to today
}

export interface LookupResult {
  success: boolean
  data?: CompanyData
  error?: string
}
