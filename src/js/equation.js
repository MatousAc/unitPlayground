// useful f(x)s
import Qty from 'js-quantities'
import settings from './settings'

let sigFigs, inScale, toSI;
settings.subscribe(s => {
  inScale = s.includeScalar;
  sigFigs = s.significantDigits;
  toSI = s.convertToSI;
})


// json AST => single result, converts to Latex
export let getResultUnits = (json, fallbackValue) => {
  if (inProgress(JSON.stringify(json))) {
    return fallbackValue
  }
  let res = ''
  try {
    let qty = converge(json)
    if (toSI) qty = qty.toBase();
    res = qty.format(toLatex())
    console.log('res:', res)
  } catch (e) {
    console.error(e.message)
  }

  return res == '' ? fallbackValue : '=' + res
}

// custom formatter to convert a quantity to Latex
let toLatex =  () => { return function (scalar, units) {
  // scalar string generation
  scalar = inScale ? `${+scalar.toFixed(sigFigs)}` : ''
  if (units == '' || units == null) return scalar

  // getting the right unit format for Latex
  console.log(`starts w/ '1/' ${units.match('1/.+')}`)
  let isDenom = units.match('1/.+');
  console.log(`initial ${units}`)
  units = units.match(RegExp('[A-Za-z]+[0-9]*[s/]?', 'g'))
  console.log(`split ${units}`)
  units = units.map(unit => {
    let parts = unit.match(RegExp('[a-zA-Z/]+|[0-9/]+', 'g'))
    console.log(`parts of each ${parts}`)
    if (parts == null) return unit;
    return parts.join('^');
  })
  console.log(`units ${units}`)
  units = `\\${units.join('\\')}`
  console.log(`joined ${units}`)
  let frac = units.split('/')
  units = frac.length === 2 ? `\\frac{${frac[0]}}{${frac[1]}}` : units
  if (isDenom) units = `\\frac{1}{${units}}`
  return scalar + units
}}

// recursively drills through a json AST, returns a Qty
let converge = ast => {
  if (!Array.isArray(ast)) return Qty(ast)

  let op = ast[0]
  switch (op) {
  case 'Add':
  case 'Divide':
  case 'Subtract':
  case 'Multiply':
    return ast.slice(1).reduce((a, b) =>
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
