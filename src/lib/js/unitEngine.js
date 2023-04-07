// these functions create unit abbreviations, macros, and parsing data for starting lists of units or units added by the user at any time
// @ts-ignore
import { ComputeEngine } from '@cortex-js/compute-engine'
import { get } from 'svelte/store'
import Prefix from '$pj/Prefix'
import { supabase, user, isAuthed } from '$pj/auth'
import { unitMacros, parseDict, userUnits, unitmath } from '$pj/stores'

/// processing f(x)s ///
export const aliasPrefixCombos = (name, attrs) => {
  let unitStrings = []
  let names
  if (attrs.aliases != undefined) {
    names = [name, ...attrs.aliases]
  } else names = [name]
  names.forEach(name => {
    if (attrs.prefixes != undefined) {
      Prefix.dictionary[attrs.prefixes].forEach(prefix => {
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

const getDefinedUnit = units => {
  let defs = get(unitmath).definitions().units
  // check if the unit is a top-level unit
  for (let unit of units) {
    if (defs.hasOwnProperty(unit)) return unit
  }
  // check all aliases for a match
  for (let key in defs) {
    const cur = defs[key]?.aliases
    if (!cur) continue
    for (let unit of units) {
      if (cur.includes(unit)) return unit
    }
  }
  return null
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
  let definedUnit = getDefinedUnit([name, ...attrs.aliases])
  if (definedUnit) {
    await alert(`The unit "${definedUnit}" is already defined.`)
    return false
  }
  userUnits.update(units => {
    console.log(`Adding Unit ${name}`)
    // fixme: add to unit system once you update unitmath
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
  const { data, error } = await supabase.from('custom_units').insert([
    {
      id: get(user).id,
      name,
      value: attrs.value,
      prefixes: attrs.prefixes,
      aliases: attrs.aliases,
      format_prefixes: attrs.formatPrefixes
    }
  ])
  if (error) console.log(error)
  return true
}

// database sync for custom units
user.subscribe(async u => {
  if (!isAuthed()) return
  let { data: customUnits, error } = await supabase
    .from('custom_units')
    .select('name, value, prefixes, aliases, format_prefixes')
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
      aliases: u.aliases,
      formatPrefixes: u.format_prefixes
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
