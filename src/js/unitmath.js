// useful f(x)s
import settings from './settings'
import { unit } from './unitmathSetup'

let sigFigs, useScalar, simplify, system;
settings.subscribe(s => {
  useScalar = s.includeScalar;
  sigFigs = s.precision;
  simplify = s.simplify;
  system = s.system;
})

// json AST => single result
export let getResultUnits = (json, fallbackValue) => {
  console.log(unit.definitions())
  if (inProgress(JSON.stringify(json))) {
    return fallbackValue
  }
  let res = ''
  console.log(JSON.stringify(json))
  try {
    let qty = converge(json)
    console.log("qty", qty)
    if (simplify) qty = qty.simplify();
    res = toLatex(qty)
    console.log('res', res)
  } catch (e) {
    console.error(e)
  }

  return res == '' ? fallbackValue : '=' + res
}

// converts a quantity to Latex
let toLatex = (qty) => {
  // if (!isNaN(qty)) qty = unit(qty)
  let scalar = qty.value
  let units = qty.units
  // scalar string generation
  // scalar = (useScalar && scalar) ? scalar : ''
  scalar = (useScalar && scalar) ? `${parseFloat(scalar.toFixed(sigFigs))}` : ''
  if (units.length == 0) return scalar

  // getting the right unit format for Latex
  let numerator = '', denominator = ''
  units.forEach(u => {
    let latex = `\\${u.prefix}${u.unit.name}`
    if (Math.abs(u.power) != 1) latex += `^{${Math.abs(u.power)}}`
    console.log(latex)
    if (u.power > 0) {numerator += (latex)}
    else {denominator += (latex)}
  });

  let uStr
  if (numerator == '' && denominator != '') numerator = "1"
  if (denominator == '') { uStr = numerator }
  else { uStr = `\\frac{${numerator}}{${denominator}}` }
  
  return scalar + ' ' + uStr  
}

// recursively drills through a json AST, returns a Unit
let converge = ast => {
  console.log(ast)
  switch (typeof ast) {
    case "object":
      if (Array.isArray(ast)) break
      else return ast
    case "number":
    case "string":
      return unit(ast)
    default:
      return ast
  }

  let op = ast[0]
  switch (op) {
  case 'Add':
  case 'Subtract':
  case 'Multiply':
  case 'Divide':
    return ast.slice(1).reduce((a, b) => {
      a = converge(a)
      b = converge(b)
      console.log("a", a)
      console.log("b", b)
      return eval(`a.${op.toLowerCase().substring(0, 3)}(b)`)
  })
    
  case 'Power':
    return power(ast)
  case 'UNIT':
    return unit(ast[1])
  case "List":
    return ast
  default:
    return ''
  }
}

let power = (arr) => {
  arr = [converge(arr[1]), arr[2]].flat()
  console.log("power array", arr)
  return arr.flat().reduceRight((a, b) => {
    console.log("b", b)
    if (typeof b === "number") { b = unit(b) }
    console.log("typeof b", typeof b)
    console.log("b", b)
    console.log("a", a)
    return b.pow(a) 
  })
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
