/// file handles custom && default unit stores ///
/// unitmath Setup ///
import { writable, get } from 'svelte/store'
import units from 'unitmath'
import settings from '$pj/settings'
import {
  aliasPrefixCombos,
  makeMacros,
  makeParse,
  filterCEParsingInfo
} from '$pj/unitEngine'

// unit obj
export let unit
settings.subscribe(s => {
  unit = units.config({
    system: s.system,
    precision: s.precision,
    simplifyThreshold: 2
  })
})

/// unit parsing information and math-field macros ///
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
export const userUnits = writable({})

// save new unit obj
userUnits.subscribe(async definitions => {
  unit = unit.config({
    definitions: {
      units: definitions
    }
  })
})
