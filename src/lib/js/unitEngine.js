// these functions create unit abbreviations, macros, and parsing data for starting lists of units or units added by the user at any time
// @ts-ignore
import { ComputeEngine } from '@cortex-js/compute-engine'
import { get } from 'svelte/store'
import { supabase, user, isAuthed } from '$pj/auth'
import {
  prefixDictionary,
  unitMacros,
  parseDict,
  userUnits,
  unit
} from '$pj/stores'

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

export const isUnitDefined = u => {
  console.log(unit.definitions().units)
  let units = unit.definitions().units
  if (units.hasOwnProperty(u)) return true
  // must check all aliases
  for (const key in units) {
    if (units.hasOwnProperty(key)) {
      const cur = units[key]
      if (cur.aliases && cur.aliases.includes(u)) {
        return true
      }
    }
  }
  return false
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
export const addUnit = async (name, attrs) => {
  if (isUnitDefined(name)) {
    await alert('This unit is already defined.')
    return false
  }
  userUnits.update(units => {
    // FIXME what if value units don't exist?
    console.log(`Adding Unit ${name}`)
    units[name] = attrs
    return units
  })

  // display/parsing info
  let names = aliasPrefixCombos(name, attrs)
  unitMacros.update(macros => ({
    ...macros,
    ...makeMacros(names)
  }))

  parseDict.update(dict => [...dict, ...makeParse(names)])

  // push to db
  if (!isAuthed()) return true
  const { data, error } = await supabase
    .from('custom_units')
    .insert([{ id: get(user).id, name, ...attrs }])
  return true
}

// database sync for custom units
user.subscribe(async u => {
  if (!isAuthed()) return
  let { data: customUnits, error } = await supabase
    .from('custom_units')
    .select('name, value, prefixes, aliases')
    .eq('id', u.id)

  let definitions = {},
    newMacros = {},
    newParse = []
  // for each custom unit
  customUnits.forEach(u => {
    // add to unit obj
    let name = u.name
    let attrs = {
      value: u.value,
      prefixes: u.prefixes,
      aliases: u.aliases
    }
    definitions[name] = attrs
    // create display/parsing info
    let names = aliasPrefixCombos(name, attrs)
    newMacros = { ...newMacros, ...makeMacros(names) }
    newParse = [...newParse, ...makeParse(names)]
  })

  unitMacros.update(macros => ({ ...macros, ...newMacros }))
  parseDict.update(dict => [...dict, ...newParse])
  userUnits.set(definitions)
})
