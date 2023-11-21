// useful f(x)s
import { unitmath } from 'pj/stores'
import settings from 'pj/settings'
import { typeOf } from 'pj/helpers'
import * as E from 'pj/error'
import { roundScalar } from 'pj/helpers'
export const eqKey = Symbol() // each equation has a context

let decimals, useScalar, simplify, system, unit
settings.subscribe(s => {
  useScalar = s.scalar
  decimals = s.decimals
  simplify = s.simplify
  system = s.system
})
unitmath.subscribe(um => (unit = um))

// json AST => single result
export const getResultUnits = json => {
  if (inProgress(json)) throw new E.NonError()

  let result = ''
  let value = converge(json)
  if (simplify) value = value.simplify()
  result = toLaTeX(value)

  if (!result) throw new NonError()
  return result
}

// recursively processes json AST, returns a Unit
export const converge = ast => {
  // console.log("Ast:", ast)
  switch (typeOf(ast)) {
    case 'array':
      break
    case 'unit':
      return ast
    case 'number':
      return unit(ast)
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
      // LTX += op
      return ast.slice(1).reduce((a, b) => {
        a = converge(a)
        b = converge(b)
        try {
          return eval(`a.${op.toLowerCase().substring(0, 3)}(b)`)
        } catch (e) {
          if (e.message.includes('dimensions do not match')) {
            throw new E.DimensionMismatch(e.message)
          } else if (e.message.includes('both units must have values')) {
            throw new E.ValueMissingOnUnit(e.message)
          } else throw e
        }
      })
    case 'Sequence':
      if (ast.length == 1) throw new E.NonError()
      return ast.slice(1).forEach(member => {
        converge(member) // till we hit an error
      })

    case 'Power':
      return power(ast)
    case 'Sqrt':
      return converge(ast[1]).sqrt()
    case 'Negate':
      return converge(ast[1]).mul(-1)
    case 'UNIT':
      // FIXME sometimes custom units cannot be found
      return unit(ast[1])
    case 'List':
      return ast.slice(1)
    case 'Delimiter':
      if (ast[1] !== undefined) return converge(ast[1])
      else return ''
    case 'Error':
      return handleError(ast)
    default:
      return ''
  }
}

const power = arr => {
  arr = [converge(arr[1]), converge(arr[2])].flat()
  return arr.flat().reduceRight((a, b) => {
    if (typeOf(b) === 'number') {
      b = unit(b)
    }
    return b.pow(a)
  })
}

// formats a Unit object as LaTeX
const toLaTeX = u => {
  u = unit(u.toString()) // so we format with prefixes
  let scalar = u.getValue()
  let units = u.units
  // scalar string generation
  scalar = useScalar && scalar ? roundScalar(scalar) : ''
  if (units.length == 0) return scalar

  // getting the right unit format for Latex
  let numerator = '',
    denominator = ''
  units.forEach(u => {
    let latex = `\\${u.prefix}${u.unit.name}`
    if (Math.abs(u.power) != 1) latex += `^{${Math.abs(u.power)}}`
    if (u.power > 0) {
      numerator += latex
    } else {
      denominator += latex
    }
  })

  let uStr
  if (numerator == '' && denominator != '') numerator = '1'
  if (denominator == '') {
    uStr = numerator
  } else {
    uStr = `\\frac{${numerator}}{${denominator}}`
  }

  return scalar + ' ' + uStr
}

function inProgress(json) {
  let str = JSON.stringify(json)
  if (str.includes('Nothing') || str.includes('\\placeholder{}')) {
    throw new E.FillPH()
  }

  return (
    str == '' ||
    str.includes('HorizontalSpacing') ||
    str.includes('["Delimiter"]')
  )
}

// handed an ast, this determines the proper error
const handleError = ast => {
  // console.log('Error AST', ast)
  if (ast[0] === 'Error') {
    if (typeOf(ast[1]) === 'array') handleError(ast[1])
    else if (typeOf(ast[1]) === 'string') {
      if (ast[1] === "'missing'") throw new E.MissingOperand()
    }
  } else if (ast[0] === 'ErrorCode') {
    let code = ast[1]
    switch (code) {
      case "'unexpected-command'":
        let re = /["|']\\(?<name>.*)["|']/
        let badUnit = ast[2].match(re).groups.name
        throw new E.UnrecognizedUnit(badUnit)
      default:
        return ''
    }
  }
}
