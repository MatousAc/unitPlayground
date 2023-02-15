// this file defines unit abbreviation, macro, and parsing data 
// and makes it available as stores
// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { get } from 'svelte/store';
import {
  prefixDictionary,
  unitMacros,
  parseDict
} from './stores';

///// processing f(x)s /////
export const aliasPrefixCombos = (name, attrs) => {
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

export const makeMacros = unitList => {
  let macros = {}
  unitList.forEach(unit => {
    macros[unit] = `\\mathrm{${unit}}`
  })
  return macros
}

export const makeParse = unitList => {
  let parseInfo = []
  unitList.forEach((alias) => {
    parseInfo.push({
      trigger: `\\${alias}`,
      parse: ["UNIT", alias]
    })
  })
  return parseInfo
}

export const filterCEParsingInfo = unitParse => {
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

///// user defined units /////
// adding a new unit requires these updates
export let addUnit = unit => {
  console.log("Adding Unit")
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
