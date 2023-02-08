import units from 'unitmath'
import settings from './settings'

export let unit

settings.subscribe(s => {
  unit = units.config({
    system: s.system,
    precision: s.precision,
    simplifyThreshold: 2
  })
})

console.log(unit.config())
  
