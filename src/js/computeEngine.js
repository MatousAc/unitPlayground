// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
import { makeUnitParseInfo } from './helpers';

let engine = new ComputeEngine();

// let engine = new ComputeEngine({
//   latexDictionary: [
//       ...ComputeEngine.getLatexDictionary(), {
//         trigger: ["\\mol"],
//         parse: "mol"
//       }
//       // ...makeUnitParseInfo()
//   ]
// });

export default engine;