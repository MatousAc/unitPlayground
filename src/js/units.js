// this file defines unit abbreviation, macro, and parsing data 
// and makes it available as stores
// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import Qty from 'js-quantities';
import { writable } from 'svelte/store';

// initial values
let starterUnits = [];
Qty.getKinds().forEach((kind) => {
  Qty.getUnits(kind).forEach((unit) => {
    Qty.getAliases(unit).forEach((alias) => {
      starterUnits.push(alias);
    })
  })
})

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

