// these functions create unit abbreviations, macros, and parsing data for starting lists of units or units added by the user at any time
// @ts-ignore
import { ComputeEngine } from '@cortex-js/compute-engine'
import { get } from 'svelte/store'
import { prefixDictionary, unitMacros, parseDict, userUnits } from '$pj/stores'
import { unit } from '$pj/stores'

/// processing f(x)s ///
export const aliasPrefixCombos = (name, attrs) => {
  let unitStrings = []
  let names
  if (attrs.aliases != undefined) {
    names = [name, ...attrs.aliases]
  } else names = [name]
  names.forEach(name => {
    if (attrs.prefixes != undefined) {
      get(prefixDictionary)[attrs.prefixes].forEach(prefix => {
        unitStrings.push(prefix + name)
      })
    } else unitStrings.push(name)
  })
  return unitStrings
}

export const makeMacros = unitList => {
  let macros = {}
  unitList.forEach(unit => {
    macros[unit] = `\\mathrm{${unit}}`
  })
  return macros
}

export const makeParse = unitList => {
  let parseInfo = []
  unitList.forEach(alias => {
    parseInfo.push({
      trigger: `\\${alias}`,
      parse: ['UNIT', alias]
    })
  })
  return parseInfo
}

export const isDefined = u => {
  return unit.definitions().units.hasOwnProperty(u)
}

export const filterCEParsingInfo = unitParse => {
  // hashmap for quick lookup
  let map = new Map()
  unitParse.forEach(entry => {
    map.set(entry['trigger'], true)
  })
  let defaultParse = ComputeEngine.getLatexDictionary()
  // below we have to filter out latex commands that
  // conflict with units so that parsing works properly
  defaultParse = defaultParse.filter(def => !map.has(`${def['trigger']}`))
  return defaultParse
}

/// user defined units ///
// adding a new unit requires these updates
export const addUnit = (name, attrs) => {
  userUnits.update(units => {
    if (!isDefined(name)) {
      console.log(`Adding Unit ${name}`)
      units[name] = attrs
    }
    return units
  })

  // display/parsing info
  let names = aliasPrefixCombos(name, attrs)
  unitMacros.update(macros => ({
    ...macros,
    ...makeMacros(names)
  }))

  parseDict.update(dict => [...dict, ...makeParse(names)])
}
