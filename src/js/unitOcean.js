// this file defines unit abbreviation, macro, and parsing data 
// and makes it available as stores
// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { unit } from './unitmathSetup'
import { writable } from 'svelte/store';

// initial values
let starterUnits = [];
let prefixDict = {};

for (const [group, prefixes] of Object.entries(unit.definitions().prefixes)) {
  prefixDict[group] = Object.keys(prefixes)
}

let unitStrings = (name, attrs) => {
  let names
  if (attrs.aliases != undefined) {
    names = [name, ...attrs.aliases]
  } else names = [name]
  names.forEach(name => {
    if (attrs.prefixes != undefined) {
      prefixDict[attrs.prefixes].forEach(prefix => {
        starterUnits.push(prefix + name)
      });
    } else starterUnits.push(name)
  });
}

for (const [name, attributes] of Object.entries(unit.definitions().units)) {
  unitStrings(name, attributes)
}


let starterMacros = {
  Mu: '\\mathrm{M}',
  euler: '\\mathrm{e}',
  imaginary: '\\mathrm{i}',
}
starterUnits.forEach(unit => {
  starterMacros[unit] = `\\mathrm{${unit}}`
})

let unitParse = []
starterUnits.forEach((alias) => {
  unitParse.push(makeUnitParse(alias))
})

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

// define stores for unit info
export const unitList = writable(starterUnits)
export const unitMacros = writable(starterMacros)
export const parseDict = writable([
  ...unitParse, 
  ...defaultParse
])

// adding a new unit requires this?
export let addUnit = (unit) => {
  unitList.update(list => {
    list.push(unit);
    return list
  })

  unitMacros.update(macros => {
    return {
      ...macros,
      unit: `\\mathrm{${unit}}`
    }
  });

  parseDict.update(dict => {
    return [
      ...dict,
      makeUnitParse(unit)
    ]
  });
  // Qty.add_unit() or something
}

// helper
function makeUnitParse(unit) {
  return {
    trigger: `\\${unit}`,
    parse: ["UNIT", unit]
  }
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
