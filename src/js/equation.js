// useful f(x)s
import Qty from 'js-quantities'


// custom formatter to convert a quantity to Latex
var toLatex = function (significantDigits, includeScalar) {
  return function (scalar, units) {
    // scalar string generation
    scalar = includeScalar ? `${+scalar.toFixed(significantDigits)}` : ''
    if (units == '' || units == null) return scalar

    // getting the right unit format for Latex
    units = units.match(RegExp('[A-Za-z]+[0-9]*[s/]?', 'g'))
    units = units.map(unit => {
      let parts = unit.match(RegExp('[a-zA-Z/]+|[0-9/]+', 'g'))
      if (parts == null) return unit
      return parts.join('^')
    })
    units = `\\${units.join('\\')}`
    let frac = units.split('/')
    units = frac.length === 2 ? `\\frac{${frac[0]}}{${frac[1]}}` : units
    return scalar + units
  }
}

export let getResultUnits = (json, fallbackValue) => {
  if (inProgress(JSON.stringify(json))) {
    return fallbackValue
  }
  let res = ''
  try {
    let qty = converge(json)
    res = qty.format(toLatex(3, true))
    console.log('res:', res)
  } catch (e) {
    console.error(e.message)
  }

  return res == '' ? fallbackValue : '=' + res
}

let converge = ast => {
  if (!Array.isArray(ast)) return Qty(ast)

  let op = ast[0]
  op = (op = 'Rational') ? 'Divide' : op
  switch (op) {
    case 'Add':
    case 'Divide':
    case 'Subtract':
    case 'Multiply':
      return ast
        .slice(1)
        .reduce((a, b) =>
          eval(`converge(a).${op.toLowerCase().substring(0, 3)}(converge(b))`)
        )
    case 'Power':
      return Qty(`${converge(ast[1])}^${converge(ast[2])}`)
    case 'UNIT':
      return Qty(ast[1])
    default:
      return ''
  }
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
