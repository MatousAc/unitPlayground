import Range from './Range.js'
// taken from https://stackoverflow.com/a/32859917/14062356
const findFirstDiffPos = (a, b) => {
  var i = 0
  if (a === b) return -1
  while (a[i] === b[i]) i++
  return i
}

export const positionFromOffset = (source, offsetLatex) => {
  let position = offsetLatex.length
  
  // console.log("clicked on: ", getValue(offset, offset+6 , 'latex'))
  if (offsetLatex === source.slice(0, position)) {
  // console.log(`At ${position}:${source.slice(0, position)}`)
    return position
  }
  // console.log("valid latex to offset: ", offsetLatex)
  // console.log(`At ${position}:${source.slice(0, position)}`)

  // adjust for missing latex
  let diffIndex = findFirstDiffPos(offsetLatex, source)
  offsetLatex = offsetLatex.slice(diffIndex)
  let sourceLatex = source.slice(diffIndex)
  // numerator
  let len = offsetLatex.length
  // console.log(`Matching offset: ${offsetLatex}`)
  while (sourceLatex.indexOf(offsetLatex.slice(0, len)) === -1) len--
  let foundAt = sourceLatex.indexOf(offsetLatex.slice(0, len))
  position = diffIndex + foundAt + len
  // console.log(`Matched offset: ${offsetLatex.slice(0, len)} at: ${foundAt} with len: ${len}`)
  // console.log(`At ${position}:${source.slice(0, position)}`)
  
  offsetLatex = offsetLatex.slice(len)
  sourceLatex = sourceLatex.slice(foundAt + len)
  if (offsetLatex.length === 0) {
  // console.log(`At ${position}:${source.slice(0, position)}`)
    return position
  }
  // denominator
  // console.log(`Matching offset: ${offsetLatex}`)
  position += sourceLatex.indexOf(offsetLatex.slice(0, len)) + offsetLatex.length
  // console.log(`At ${position}:${source.slice(0, position)}`)
  return position
}

const splitOnTopLevelOps = source => {
  let splitArray = []
  const re = /[+\-]|(?:\\cdot)|(?:\\times)(?![^{]*})/g
  let ops = source.matchAll(re)
  let opIter = ops.next()
  if (opIter.done === true) return splitArray
  let op = opIter.value

  let braces = 0, brackets = 0, parens = 0
  for (let i = 0; i < source.length; i++) {
    let c = source[i]
    switch (c) {
      case '{': braces++; break;
      case '}': braces--; break;
      case '[': brackets++; break;
      case ']': brackets--; break;
      case '(': parens++; break;
      case ')': parens--; break;
      default: break;
    }

    if (op.index === i) {
      // console.log(`i: ${i} c: ${c} op[0]: ${op[0]} op i: ${op.index} bbp:${braces},${brackets},${parens}`)
      if (braces === 0 || braces === 0 || parens === 0) {
        splitArray.push(new Range(i, i + op[0].length))
      }
      opIter = ops.next()
      // console.log("splitArray", splitArray)
      op = opIter.value
      if (opIter.done === true) break
    }
  }
  return splitArray
}

const rangeFromPositionAndSplitArray = (pos, last, splitArray) => {
  let range = new Range(0, last), endSet = false
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
  const re = /(?<before>[^{}]*)\\frac{(?<numerator>(?:(?:\\frac{.*}{.*})+|[^{}]+|\{\\Large\s*\\placeholder\{\}\})+)}{(?<denominator>(?:(?:\\frac{.*}{.*})+|[^{}]+)+|\{\\Large\s*\\placeholder{}\})}(?<after>[^{}]*)/d

  let fraction = source.slice(range.start, range.end)
  let groups = fraction.match(re, range.start, range.end).indices.groups
  
  for (let group in groups) {
    groups[group] = new Range(
      groups[group][0] + range.start,
      groups[group][1] + range.start
    )
  }
  return groups
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
  // console.log("Invalid full latex", source)
  // console.log("Valid full latex", offsetLatex)
  // get the position within source LaTeX
  let position = positionFromOffset(source, offsetLatex)
  // split on +-*
  let splitArray = splitOnTopLevelOps(source)
  let range = rangeFromPositionAndSplitArray(position, source.length, splitArray)
  // determine fraction part in necessary
  if (source.slice(range.start, range.end).indexOf("\\frac{") === -1) return range
  let fractionPieces = getFractionPieces(source, range)
  return rangeFromPositionPieces(position, fractionPieces)
}

const distance = (pos, match) => {
  let front = match.index, back = match[0].length + front
  return Math.min(Math.abs(pos - front), Math.abs(pos - back))
}

export const nearestPhRange = (source, position) => {
  const re = /\{\\Huge\s*\\placeholder\{\}\}/g
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