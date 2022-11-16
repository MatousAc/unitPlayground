// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { parseDict } from './units.js'

let engine = new ComputeEngine();

parseDict.subscribe(parseInfo => {
  engine._latexDictionary = parseInfo;
})
// console.log("engine _lD: ", engine._latexDictionary)

export default engine;