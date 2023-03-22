// useful f(x)s
import settings from './settings'
import { unit } from './stores'
import { typeOf } from './helpers'
import { NonError, Fail, Hint, MissingOperand, UnitMismatch, UnrecognizedUnit } from './error'
export const eqKey = Symbol() // each equation has a context

let sigFigs, useScalar, simplify, system;
settings.subscribe(s => {
  useScalar = s.includeScalar
  sigFigs = s.precision
  simplify = s.simplify
  system = s.system
})

// json AST => single result
export let getResultUnits = (json, currentResult) => {
  if (inProgress(json)) return currentResult

  let result = ''
  try {
    let value = converge(json)
    console.log('Unit', value)
    console.log("unit object when being used")
    console.log(unit.definitions())
    if (simplify) value = value.simplify();
    result = toLaTeX(value)
    console.log('Result:', result)
  } catch (e) {
    switch (e.constructor) {
    case NonError: console.warn(e.message); break
    case UnitMismatch:
      console.error(e.message); break
    case UnrecognizedUnit:
      console.error(e.message)
      console.error("Define new unit?"); break
    case MissingOperand: console.error(e.message); break
    case Hint:
      console.error(e.message)
      console.error("You might wanna czech this one out")
      break
    case Fail:
      console.error(e.message)
      console.error("User failed."); break
    default:
      console.error(e)
    }
  }

  return result == '' ? currentResult : '=' + result
}

// recursively processes json AST, returns a Unit
let converge = ast => {
  // console.log("Ast:", ast)
  switch (typeOf(ast)) {
  case 'array': break
  case 'unit': return ast
  case 'number': return unit(ast)
  case 'string':
    throw new UnrecognizedUnit(ast)
  case 'object':
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
      try {
        return eval(`a.${op.toLowerCase().substring(0, 3)}(b)`)
      } catch (e) {
        if (e.message.includes("dimensions do not match")) {
          throw new UnitMismatch(e.message)
        } else throw e
      }
  })
  case "Sequence":
    if (ast.length == 1) throw new NonError()
    return ast.slice(1).forEach(member => {
      converge(member) // till we hit an error
    });
  
  case 'Power': return power(ast)
  case 'Sqrt': return converge(ast[1]).sqrt()
  case 'Negate': return converge(ast[1]).mul(-1)
  case 'UNIT': return unit(ast[1])
  case 'List': return ast.slice(1)
  case 'Delimiter': 
    if (ast[1] !== undefined) return converge(ast[1])
    else return ''
  case "Error": return handleError(ast)
  default: return ''
  }
}

let power = (arr) => {
  arr = [converge(arr[1]), converge(arr[2])].flat()
  return arr.flat().reduceRight((a, b) => {
    if (typeOf(b) === 'number') { b = unit(b) }
    return b.pow(a) 
  })
}

// formats a Unit object as LaTeX
let toLaTeX = u => {
  // console.log(u)
  let scalar = u.getValue()
  let units = u.units
  // scalar string generation
  scalar = (useScalar && scalar) ? `${parseFloat(scalar.toFixed(sigFigs))}` : ''
  if (units.length == 0) return scalar

  // getting the right unit format for Latex
  let numerator = '', denominator = ''
  units.forEach(u => {
    let latex = `\\${u.prefix}${u.unit.name}`
    if (Math.abs(u.power) != 1) latex += `^{${Math.abs(u.power)}}`
    if (u.power > 0) {numerator += (latex)}
    else {denominator += (latex)}
  });

  let uStr
  if (numerator == '' && denominator != '') numerator = '1'
  if (denominator == '') { uStr = numerator }
  else { uStr = `\\frac{${numerator}}{${denominator}}` }
  
  return scalar + ' ' + uStr  
}

function inProgress(json) {
  let str = JSON.stringify(json)
  return (
    str == '' ||
    str.includes('Nothing') ||
    str.includes('HorizontalSpacing') ||
    str.includes('["Delimiter"]')
  ) // might be nice to handle various errors here
}

// handed an ast, this determines the proper error
const handleError = ast => {
  console.log("Error AST", ast)
  if (ast[0] === "Error") {
    if (typeOf(ast[1]) === "array") handleError(ast[1])
    else if (typeOf(ast[1]) === "string") {
      if (ast[1] === "'missing'") throw new MissingOperand()
    }
  } else if (ast[0] === "ErrorCode") {
    let code = ast[1]
    switch (code) {
    case "'unexpected-command'":
      let re = /["|']\\(?<name>.*)["|']/
      let badUnit = ast[2].match(re).groups.name
      throw new UnrecognizedUnit(badUnit)
    default:
      return ''
    }
  }
}
