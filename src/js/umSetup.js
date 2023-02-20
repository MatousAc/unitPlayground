///// unitmath Setup /////
import units from 'unitmath'
import settings from './settings'
import { userUnits } from './stores'
export let unit

settings.subscribe(s => {
  unit = units.config({
    system: s.system,
    precision: s.precision,
    simplifyThreshold: 2
  })
})

userUnits.subscribe(defs => {
  unit = unit.config({
    definitions: {
      units: defs
    }
  })
})

console.log(unit.config())
console.log(unit.definitions())