import type { CompanyData, LookupResult } from '../types'

const BASE_URL = 'https://wl-api.mf.gov.pl/api/search/nip'

type VatStatus = CompanyData['vatStatus']

function mapVatStatus(status: string): VatStatus {
  switch (status) {
    case 'Czynny': return 'active'
    case 'Zwolniony': return 'exempt'
    case 'Niezarejestrowany': return 'inactive'
    default: return 'unknown'
  }
}

function parseAddress(raw: string | undefined): CompanyData['address'] {
  if (!raw) return {}

  const zipMatch = raw.match(/(\d{2}-\d{3})/)
  if (!zipMatch) return { street: raw }

  const zipCode = zipMatch[1]
  const zipIndex = raw.indexOf(zipCode)
  const street = raw.slice(0, zipIndex).replace(/,\s*$/, '').trim() || undefined
  const city = raw.slice(zipIndex + zipCode.length).replace(/^[\s,]+/, '').trim() || undefined

  return { street, city, zipCode }
}

interface MfSubject {
  name?: string
  nip?: string
  regon?: string
  krs?: string
  residenceAddress?: string
  statusVat?: string
  accountNumbers?: string[]
}

interface MfResponse {
  result?: {
    subject?: MfSubject
  }
}

export async function fetchCompany(nip: string, date?: string): Promise<LookupResult> {
  const today = new Date().toISOString().slice(0, 10)
  const queryDate = date ?? today
  const url = `${BASE_URL}/${nip}?date=${queryDate}`

  let response: Response
  try {
    response = await fetch(url)
  } catch (err) {
    return { success: false, error: `Network error: ${err instanceof Error ? err.message : String(err)}` }
  }

  if (response.status === 404) {
    return { success: false, error: `No company found for NIP: ${nip}` }
  }

  if (!response.ok) {
    return { success: false, error: `API error: ${response.status} ${response.statusText}` }
  }

  let body: MfResponse
  try {
    body = (await response.json()) as MfResponse
  } catch {
    return { success: false, error: 'Failed to parse API response' }
  }

  const subject = body?.result?.subject
  if (!subject) {
    return { success: false, error: `No company found for NIP: ${nip}` }
  }

  const data: CompanyData = {
    nip: subject.nip ?? nip,
    name: subject.name ?? '',
    regon: subject.regon,
    krs: subject.krs,
    address: parseAddress(subject.residenceAddress),
    vatStatus: mapVatStatus(subject.statusVat ?? ''),
    bankAccounts: subject.accountNumbers ?? [],
    source: 'mf',
    fetchedAt: new Date().toISOString(),
  }

  return { success: true, data }
}
