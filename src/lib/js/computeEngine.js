// @ts-ignore
import { ComputeEngine } from '@cortex-js/compute-engine'
import { parseDict } from './stores'

let engine
const restartEngine = parseInfo => {
  engine = new ComputeEngine({
    latexDictionary: parseInfo
  });
  engine.jsonSerializationOptions = { exclude: ['Rational'] };
  console.log("Engine restarted")
}

parseDict.subscribe(parseInfo => {
  restartEngine(parseInfo)
})

export const parse = latex => engine.parse(latex, { canonical: false })
