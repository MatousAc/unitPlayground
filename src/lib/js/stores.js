/// file handles custom && default unit stores ///
/// unitmath Setup ///
import { writable, get } from 'svelte/store'
import units from 'unitmath'
import settings from '$pj/settings'

export let unit
settings.subscribe(s => {
  unit = units.config({
    system: s.system,
    precision: s.precision,
    simplifyThreshold: 2
    // definitions: get(userUnits)
  })
})

/// unit parsing information and math-field macros ///
import {
  aliasPrefixCombos,
  makeMacros,
  makeParse,
  filterCEParsingInfo
} from '$pj/unitEngine'

const getPrefixDictionary = () => {
  let prefixDict = {}
  for (const [group, prefixes] of Object.entries(unit.definitions().prefixes)) {
    prefixDict[group] = Object.keys(prefixes)
  }
  return prefixDict
}
export const prefixDictionary = writable(getPrefixDictionary())

const getDefaultUnits = () => {
  let defaultUnits = []
  for (const [name, attributes] of Object.entries(unit.definitions().units)) {
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

// store for user-defined units
export const userUnits = writable({
  lightyear: { value: '9460730472580800 m' },
  profo: {
    value: '70 in',
    prefixGroup: 'LONG',
    aliases: ['profos', 'Profo', 'Profos']
  }
})

// change the unit obj when defs are changed
userUnits.subscribe(defs => {
  unit = unit.config({
    definitions: {
      units: defs
    }
  })
})
