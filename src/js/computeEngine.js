// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { makeUnitParseInfo as makeUnitDict } from './helpers';

let engine = new ComputeEngine();
console.log("engine: ", engine._latexDictionary)

let unitDict = makeUnitDict();
let unitHash = new Map();
unitDict.forEach(unit => {
  unitHash.set(unit["trigger"], true);
})


let defaultDict = ComputeEngine.getLatexDictionary()
defaultDict = defaultDict.filter(def =>
  !unitHash.has(`${def["trigger"]}`)
 )

// console.log("unit hash", unitHash)
// console.log("unit parse", unitDict)

engine._latexDictionary = [
  ...unitDict,
  ...defaultDict
];

console.log("engine _lD: ", engine._latexDictionary)

export default engine;