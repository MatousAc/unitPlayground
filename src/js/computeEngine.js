// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { parseDict } from './unitOcean'

let engine = new ComputeEngine();
engine.jsonSerializationOptions = { exclude: ['Rational'] };

parseDict.subscribe(parseInfo => {
  engine._latexDictionary = parseInfo;
})

export default engine;