/// file handles custom && default unit stores ///
/// unitmath Setup ///
import { writable } from 'svelte/store'
import units from 'unitmath'
import settings from '$pj/settings'
import {
  aliasPrefixCombos,
  makeMacros,
  makeParse,
  filterCEParsingInfo
} from '$pj/unitEngine'

// start with library default
export let unitmath = writable(units)
settings.subscribe(s => {
  // only change settings
  unitmath.update(um =>
    um.config({
      system: s.system,
      simplifyThreshold: 2,
      // fixme: check if this works once we update unitmath
      formatPrefixDefault: true
    })
  )
})

// store for user-defined units
export const userUnits = writable({})

// update unit obj
userUnits.subscribe(async definitions => {
  unitmath.update(um =>
    um.config({
      definitions: {
        units: definitions
      }
    })
  )
})

/// unit parsing information and math-field macros ///
const getDefaultUnits = () => {
  let defaultUnits = []
  for (const [name, attributes] of Object.entries(units.definitions().units)) {
    defaultUnits = [...defaultUnits, ...aliasPrefixCombos(name, attributes)]
  }
  return defaultUnits
}
// define starting stores for unit info
let defaultUnits = getDefaultUnits()
let starterParse = makeParse(defaultUnits)
export const unitMacros = writable(makeMacros(defaultUnits))
export const parseDict = writable([
  ...starterParse,
  ...filterCEParsingInfo(starterParse)
])

/// make a global reference to the playground element ///
export const playground = writable('')
