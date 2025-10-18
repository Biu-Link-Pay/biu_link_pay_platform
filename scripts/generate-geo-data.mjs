#!/usr/bin/env node

// Generate per-country geo data using country-state-city API (safer than reading raw assets)
// Output directory: public/geo/

import { writeFile, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import process from 'process'
import { Country, State, City } from 'country-state-city'

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

function sortByName(a, b) {
  return String(a.name).localeCompare(String(b.name))
}

async function main() {
  const projectRoot = process.cwd()
  const outRoot = path.resolve(projectRoot, 'public/geo')

  // Clean output root
  if (existsSync(outRoot)) {
    await rm(outRoot, { recursive: true, force: true })
  }
  await ensureDir(outRoot)

  const countries = Country.getAllCountries()
  const countryList = countries
    .slice()
    .sort(sortByName)
    .map(c => ({ code: c.isoCode, name: c.name }))
  await writeFile(path.join(outRoot, 'countries.json'), JSON.stringify(countryList, null, 2), 'utf8')

  for (const c of countries) {
    const code = c.isoCode
    const countryDir = path.join(outRoot, code)
    await ensureDir(countryDir)

    const info = {
      code: c.isoCode,
      name: c.name,
      phonecode: c.phonecode ?? null,
      currency: c.currency ?? null,
      flag: c.flag ?? null,
      latitude: c.latitude ?? null,
      longitude: c.longitude ?? null,
    }

    const states = (State.getStatesOfCountry(code) || [])
      .slice()
      .sort(sortByName)
      .map(s => ({ code: s.isoCode, name: s.name }))

    // Prefer aggregating by states, fallback to country-level lookup if no states
    /** @type {{ name:string, stateCode:string }[]} */
    let cities = []
    if (states.length > 0) {
      for (const st of states) {
        const list = City.getCitiesOfState(code, st.code) || []
        if (list.length > 0) {
          for (const ct of list) {
            cities.push({ name: ct.name, stateCode: st.code })
          }
        }
      }
    }
    if (cities.length === 0) {
      cities = (City.getCitiesOfCountry(code) || [])
        .slice()
        .map(ct => ({ name: ct.name, stateCode: ct.stateCode }))
    }
    cities.sort((a, b) => String(a.stateCode).localeCompare(String(b.stateCode)) || String(a.name).localeCompare(String(b.name)))

    await Promise.all([
      writeFile(path.join(countryDir, 'info.json'), JSON.stringify(info, null, 2), 'utf8'),
      writeFile(path.join(countryDir, 'states.json'), JSON.stringify(states, null, 2), 'utf8'),
      writeFile(path.join(countryDir, 'cities.json'), JSON.stringify(cities, null, 2), 'utf8'),
    ])
  }

  console.log(`Generated geo data at ${outRoot}`)
  console.log(`Countries: ${countryList.length}`)
}

main().catch(err => {
  console.error('Failed to generate geo data:', err)
  process.exit(1)
})


