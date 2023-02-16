// useful f(x)s
import { unit, add, multiply, subtract, divide, pow, format } from 'mathjs'
import settings from './settings'

let sigFigs, inScale, toSI;
settings.subscribe(s => {
  inScale = s.includeScalar;
  sigFigs = s.precision;
  toSI = s.simplify;
})


// json AST => single result, converts to Latex
export let getResultUnits = (json, fallbackValue) => {
  if (inProgress(JSON.stringify(json))) {
    return fallbackValue
  }
  let res = ''
  try {
    let qty = converge(json)
    if (toSI) qty = qty.toSI();
    res = toLatex(qty)
  } catch (e) {
    console.error(e)
  }

  return res == '' ? fallbackValue : '=' + res
}

// custom formatter to convert a quantity to Latex
let toLatex = (qty) => {
  if (!isNaN(qty)) qty = unit(qty)
  let scalar = qty.toJSON().value
  let units = qty.toJSON().unit
  // scalar string generation
  scalar = inScale ? `${+scalar.toFixed(sigFigs)}` : ''
  if (units == '' || units == null) return scalar

  // getting the right unit format for Latex
  units = units.split(' / ')
  units = units.map(ssUnits => { // space-separated units
    ssUnits = ssUnits.replace(/\((.+?)\)/, `$1`)
    let csUnits = ssUnits.split(' ')
    
    return '\\' + csUnits.join('\\');
  })
  units = (units.length === 2) ? `\\frac{${units[0]}}{${units[1]}}` : units
  return scalar + units
}

// recursively drills through a json AST, returns a Qty
let converge = ast => {
  if (!Array.isArray(ast)) {
    return  unit(ast)
  }

  let op = ast[0]
  switch (op) {
  case 'Add':
  case 'Divide':
  case 'Subtract':
  case 'Multiply':
  case 'Power':
    return ast.slice(1).reduce((a, b) => {
      a = converge(a)
      b = converge(b)
      return eval(`${op.toLowerCase()}(a, b)`)
    })
    
  case 'UNIT':
    return unit(ast[1])
  case 'List':
    return ast
  default:
    return ''
  }
}

let power = (base, exp) => {
  if (Array.isArray(exp)) {
    exp = exp.slice(1).reduceRight((a, b) => {
      a = converge(a)
      b = converge(b)
      return pow(a, b.toJSON().value)
    })
  }
  return pow(base, exp.toJSON().value)
}

function inProgress(jstr) {
  return (
    jstr == '' ||
    jstr.includes('Error') ||
    jstr.includes('missing') ||
    jstr.includes('Sequence') ||
    jstr.includes('Nothing') ||
    jstr.includes('HorizontalSpacing')
  ) // might be nice to handle various errors here
}

export const eqKey = Symbol()
export const precKey = Symbol()
