// Geo data service: fetch static JSON files from public/geo with in-memory caching
// This replaces direct usage of `country-state-city` library data loading in the UI.

export interface CountryOption {
  name: string
  code: string
}

export interface StateOption {
  name: string
  isoCode: string
}

export interface CityOption {
  name: string
  stateCode?: string
}

const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '/')
const countriesUrl = `${baseUrl}geo/countries.json`

const countriesCache: { data?: CountryOption[] } = {}
const statesCache = new Map<string, StateOption[]>() // key: CC
const citiesCache = new Map<string, CityOption[]>() // key: CC (country-level city list)

async function fetchJSON<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const resp = await fetch(url, { signal: controller.signal, credentials: 'same-origin', cache: 'force-cache' })
    if (!resp.ok) throw new Error(`Failed to load ${url}: ${resp.status}`)
    return (await resp.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

export async function getCountries(): Promise<CountryOption[]> {
  if (countriesCache.data) return countriesCache.data
  const data = await fetchJSON<CountryOption[]>(countriesUrl)
  // normalize and sort by name
  countriesCache.data = data
    .filter(Boolean)
    .map(c => ({ name: c.name, code: (c as any).code || (c as any).isoCode || '' }))
    .filter(c => c.code)
    .sort((a, b) => a.name.localeCompare(b.name))
  return countriesCache.data
}

export async function getStatesOfCountry(countryCode: string): Promise<StateOption[]> {
  const cc = (countryCode || '').toUpperCase()
  if (!cc) return []
  if (statesCache.has(cc)) return statesCache.get(cc) as StateOption[]
  const url = `${baseUrl}geo/${cc}/states.json`
  try {
    const raw = await fetchJSON<Array<{ name: string; code?: string; isoCode?: string }>>(url)
    const list = (raw || [])
      .map(s => ({ name: s.name, isoCode: (s.isoCode || s.code || '').toString() }))
      .filter(s => !!s.isoCode)
      .sort((a, b) => a.name.localeCompare(b.name))
    statesCache.set(cc, list)
    return list
  } catch (e) {
    console.warn('Failed to load states:', cc, e)
    statesCache.set(cc, [])
    return []
  }
}

export async function getCitiesOfCountry(countryCode: string): Promise<CityOption[]> {
  const cc = (countryCode || '').toUpperCase()
  if (!cc) return []
  if (citiesCache.has(cc)) return citiesCache.get(cc) as CityOption[]
  const url = `${baseUrl}geo/${cc}/cities.json`
  try {
    const list = await fetchJSON<CityOption[]>(url)
    const normalized = (list || []).map(c => ({ name: c.name, stateCode: (c as any).stateCode }))
    citiesCache.set(cc, normalized)
    return normalized
  } catch (e) {
    console.warn('Failed to load cities:', cc, e)
    citiesCache.set(cc, [])
    return []
  }
}

export async function getCitiesOfState(countryCode: string, stateIsoCode: string): Promise<CityOption[]> {
  const cc = (countryCode || '').toUpperCase()
  const sc = (stateIsoCode || '').toUpperCase()
  if (!cc || !sc) return []
  const all = await getCitiesOfCountry(cc)
  return all
    .filter(c => (c.stateCode || '').toUpperCase() === sc)
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Utilities
export async function getStateDisplayName(countryCode?: string, stateValue?: string): Promise<string> {
  if (!countryCode || !stateValue) return stateValue || ''
  const cc = countryCode.toUpperCase()
  const valueTrim = stateValue.trim()
  if (!valueTrim) return ''
  const list = await getStatesOfCountry(cc)
  const byCode = list.find(s => s.isoCode.toUpperCase() === valueTrim.toUpperCase())
  if (byCode) return byCode.name
  const byName = list.find(s => s.name.trim().toLowerCase() === valueTrim.toLowerCase())
  return byName?.name || stateValue
}

export async function normalizeStateCode(countryCode?: string, stateValue?: string): Promise<string> {
  if (!countryCode || !stateValue) return stateValue || ''
  const cc = countryCode.toUpperCase()
  const valueTrim = stateValue.trim()
  if (!valueTrim) return ''
  const list = await getStatesOfCountry(cc)
  const byCode = list.find(s => s.isoCode.toUpperCase() === valueTrim.toUpperCase())
  if (byCode) return byCode.isoCode
  const byName = list.find(s => s.name.trim().toLowerCase() === valueTrim.toLowerCase())
  return byName?.isoCode || stateValue
}

// Synchronous helpers backed by caches (best-effort, may return fallback if not loaded)
export function tryGetStateDisplayFromCache(countryCode?: string, stateValue?: string): string {
  if (!countryCode || !stateValue) return stateValue || ''
  const cc = countryCode.toUpperCase()
  const valueTrim = stateValue.trim()
  const list = statesCache.get(cc)
  if (!list) return stateValue
  const byCode = list.find(s => s.isoCode.toUpperCase() === valueTrim.toUpperCase())
  if (byCode) return byCode.name
  const byName = list.find(s => s.name.trim().toLowerCase() === valueTrim.toLowerCase())
  return byName?.name || stateValue
}

export function clearGeoCaches() {
  countriesCache.data = undefined
  statesCache.clear()
  citiesCache.clear()
}


