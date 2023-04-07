// @ts-ignore
import { ComputeEngine } from '@cortex-js/compute-engine'
import { parseDict } from '$pj/stores'

export let engine
let parseInfo

export const restartEngine = () => {
  engine = new ComputeEngine({
    latexDictionary: parseInfo
  })
  engine.jsonSerializationOptions = { exclude: ['Rational'] }
  // console.log('Engine restarted.')
}

parseDict.subscribe(pd => {
  parseInfo = pd
  restartEngine()
})

export const parse = latex => engine.parse(latex, { canonical: false })
