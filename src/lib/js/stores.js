import { writable, get } from 'svelte/store'
///// trash stack management /////
import Equation from '../components/Equation.svelte'
export const trashStack = writable([])

export const swallow = equation => {
  trashStack.update(list => {
    list.push(equation);
    return list
  })
}

export const vomit = dest => {
  let last = get(trashStack).pop()
  // @ts-ignore
  new Equation({
    props: {
      x: last.offsetX,
      y: last.offsetY,
      initLeft: last.value
    },
    target: dest
  })
}


///// unitmath Setup /////
import units from 'unitmath'
import settings from './settings'
export let unit

settings.subscribe(s => {
  unit = units.config({
    system: s.system,
    precision: s.precision,
    simplifyThreshold: 2,
    // definitions: get(userUnits)
  })
})

console.log(unit.config())
console.log(unit.definitions())


///// unit parsing information and math-field macros /////
import {
  aliasPrefixCombos,
  makeMacros,
  makeParse,
  filterCEParsingInfo
} from './unitEngine'

let getPrefixDictionary = () => {
  let prefixDict = {};
  for (const [group, prefixes] of Object.entries(unit.definitions().prefixes)) {
    prefixDict[group] = Object.keys(prefixes)
  }
  return prefixDict;
}
export const prefixDictionary = writable(getPrefixDictionary())


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