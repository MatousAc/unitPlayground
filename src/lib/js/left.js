import Range from '$pj/Range.js'

export const ph = '{\\Huge\\placeholder{}}'
export const phRE = /\{\\Huge\s*\\placeholder\{\}\}/
// taken from https://stackoverflow.com/a/32859917/14062356
const matchTo = (a, b, excludeArr) => {
  var i = 0
  if (a === b) return -1
  while (a[i] === b[i]) {
    for (let j = 0; j < excludeArr.length; j++) {
      if (excludeArr[j] === a[i]) return i
    }
    i++
  }
  return i
}

function removeLeading(str, arr) {
  let removedLen = 0
  let result = str
  let matchFound = true

  while (matchFound) {
    matchFound = false
    for (let i = 0; i < arr.length; i++) {
      if (result.startsWith(arr[i])) {
        result = result.substring(arr[i].length)
        removedLen += arr[i].length
        matchFound = true
      }
    }
  }

  return { result, removedLen }
}

export const positionFromOffset = (source, offsetLatex) => {
  let position = offsetLatex.length
  if (offsetLatex === source.slice(0, position)) return position

  // adjust for missing latex
  position = 0
  // console.log(`At ${position}: ${source.slice(0, position)}`)
  let ignorables = [
    '\\frac{',
    '\\sqrt',
    '\\left(',
    '\\left\\lbrack',
    '\\left\\lbrace',
    '}{',
    '{',
    '^',
    ' '
  ]
  let fullLatex = source
  while (offsetLatex.length !== 0) {
    // consume ignorables from both strings
    let { result, removedLen } = removeLeading(fullLatex, ignorables)
    fullLatex = result
    position += removedLen
    result = removeLeading(offsetLatex, ignorables).result
    offsetLatex = result

    // only consume '\' if it isn't part of an ignorable
    if (offsetLatex.slice(0, 1) === '\\' && fullLatex.slice(0, 1) === '\\') {
      position++
      offsetLatex = offsetLatex.slice(1)
      fullLatex = fullLatex.slice(1)
    }

    let p = matchTo(offsetLatex, fullLatex, ['\\', '^', '{'])
    offsetLatex = offsetLatex.slice(p)
    fullLatex = fullLatex.slice(p)
    position += p
  }
  return position
}

const getTopLevelOpSplit = source => {
  let splitArray = []
  const re = /[+\-]|(?:\\cdot)|(?:\\times)(?![^{]*})/g
  let ops = source.matchAll(re)
  let opIter = ops.next()
  if (opIter.done === true) return splitArray
  let op = opIter.value

  let braces = 0,
    brackets = 0,
    parens = 0
  for (let i = 0; i < source.length; i++) {
    let c = source[i]
    switch (c) {
      case '{':
        braces++
        break
      case '}':
        braces--
        break
      case '[':
        brackets++
        break
      case ']':
        brackets--
        break
      case '(':
        parens++
        break
      case ')':
        parens--
        break
      default:
        break
    }

    if (op.index === i) {
      if (braces === 0 && braces === 0 && parens === 0) {
        splitArray.push(new Range(i, i + op[0].length))
      }
      opIter = ops.next()
      op = opIter.value
      if (opIter.done === true) break
    }
  }
  return splitArray
}

const rangeFromPositionAndOpSplit = (pos, last, splitArray) => {
  let range = new Range(0, last),
    endSet = false
  splitArray.forEach(r => {
    if (pos <= r.start && !endSet) {
      range.end = r.start
      endSet = true
    }
    if (pos >= r.end) range.start = r.end
  })
  return range
}

const getFractionPieces = (source, range) => {
  let start = range.start
  // match before
  let toMatch = '\\frac{'
  const bi = range.extract(source).indexOf(toMatch) + range.start

  const before = new Range(start, bi)
  start = bi + toMatch.length
  // match numerator
  let depth = 1
  let i = start
  while (depth > 0) {
    if (source[i] == '{') depth++
    if (source[i] == '}') depth--
    i++
  }
  const numerator = new Range(start, i - 1)
  // match denominator
  start = ++i
  depth = 1
  while (depth > 0) {
    if (source[i] == '{') depth++
    if (source[i] == '}') depth--
    i++
  }
  const denominator = new Range(start, i - 1)
  const after = new Range(i, range.end)
  return { before, numerator, denominator, after }
}

const rangeFromPositionPieces = (pos, frac) => {
  let range = new Range(0, 0)
  if (frac.before.includes(pos) || frac.after.includes(pos)) {
    range.start = frac.before.start
    range.end = frac.after.end
  } else if (frac.numerator.includes(pos)) {
    return frac.numerator
  } else if (frac.denominator.includes(pos)) {
    return frac.denominator
  }
  return range
}

export const ejectionRangeFromOffset = (source, offsetLatex) => {
  // get the position within source LaTeX
  let position = positionFromOffset(source, offsetLatex)
  // split on +-*
  let opSplit = getTopLevelOpSplit(source)
  let range = rangeFromPositionAndOpSplit(position, source.length, opSplit)
  // console.dir(range.toString())
  // determine fraction part in necessary
  if (source.slice(range.start, range.end).indexOf('\\frac{') === -1)
    return range
  let fractionPieces = getFractionPieces(source, range)
  return rangeFromPositionPieces(position, fractionPieces)
}

const distance = (pos, match) => {
  let front = match.index,
    back = match[0].length + front
  return Math.min(Math.abs(pos - front), Math.abs(pos - back))
}

export const nearestPhRange = (source, position) => {
  const re = new RegExp(phRE.source, 'g')
  let match = re.exec(source)
  let nearest = match
  let minDist = distance(position, match)
  while ((match = re.exec(source)) !== null) {
    let dist = distance(position, match)
    if (dist < minDist) {
      nearest = match
      minDist = dist
    }
  }
  return new Range(nearest.index, nearest.index + nearest[0].length)
}
