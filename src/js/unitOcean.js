// this file defines unit abbreviation, macro, and parsing data 
// and makes it available as stores
// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { unit } from './unitmathSetup'
import { writable, get } from 'svelte/store';

///////////////////
// processing f(x)s
let getPrefixDictionary = () => {
  let prefixDict = {};
  for (const [group, prefixes] of Object.entries(unit.definitions().prefixes)) {
    prefixDict[group] = Object.keys(prefixes)
  }
  return prefixDict;
}
export const prefixDictionary = writable(getPrefixDictionary())


let aliasPrefixCombos = (name, attrs) => {
  let unitStrings = [];
  let names
  if (attrs.aliases != undefined) {
    names = [name, ...attrs.aliases]
  } else names = [name]
  names.forEach(name => {
    if (attrs.prefixes != undefined) {
      get(prefixDictionary)[attrs.prefixes].forEach(prefix => {
        unitStrings.push(prefix + name)
      });
    } else unitStrings.push(name)
  });
  return unitStrings
}

let makeMacros = unitList => {
  let macros = {}
  unitList.forEach(unit => {
    macros[unit] = `\\mathrm{${unit}}`
  })
  return macros
}

let makeParse = unitList => {
  let parseInfo = []
  unitList.forEach((alias) => {
    parseInfo.push({
      trigger: `\\${alias}`,
      parse: ["UNIT", alias]
    })
  })
  return parseInfo
}

let filterCEParsingInfo = unitParse => {
  // hashmap for quick lookup
  let startHash = new Map();
  unitParse.forEach(entry => {
    startHash.set(entry["trigger"], true);
  }) 
  let defaultParse = ComputeEngine.getLatexDictionary()
  // below we have to filter out latex commands that
  // conflict with units so that parsing works properly
  defaultParse = defaultParse.filter(def =>
    !startHash.has(`${def["trigger"]}`)
  )
  return defaultParse
}

///////////////////
// first-time setup
let getDefaultUnits = () => {
  let starterUnits = []
  for (const [name, attributes] of Object.entries(unit.definitions().units)) {
    starterUnits = [...starterUnits ,...aliasPrefixCombos(name, attributes)]
  }
  return starterUnits
}
// define starting stores for unit info
let defaultUnits = getDefaultUnits()
let starterParse = makeParse(defaultUnits)
export const unitMacros = writable(makeMacros(defaultUnits))
export const parseDict = writable([
  ...starterParse, 
  ...filterCEParsingInfo(starterParse)
])

/////////////////////
// user defined units

// adding a new unit requires these updates
export let addUnit = unit => {
  unitMacros.update(macros => {
    return {
      ...macros,
      ...makeMacros([unit])
    }
  });

  parseDict.update(dict => {
    return [
      ...dict,
      ...makeParse([unit])
    ]
  });

}


// legacy: how we imported units from js-quantities
// import Qty from 'js-quantities';
// Qty.getKinds().forEach((kind) => {
//   Qty.getUnits(kind).forEach((unit) => {
//     Qty.getAliases(unit).forEach((alias) => {
//       starterUnits.push(alias);
//     })
//   })
// })
