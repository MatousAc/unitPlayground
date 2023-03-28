// taken from https://stackoverflow.com/a/32859917/14062356
let findFirstDiffPos = (a, b) => {
  var i = 0;
  if (a === b) return -1;
  while (a[i] === b[i]) i++;
  return i;
}

let positionFromOffset = (source, offsetLatex) => {
  let position = offsetLatex.length
  
  // console.log("clicked on: ", getValue(offset, offset+6 , 'latex'))
  if (offsetLatex === source.substring(0, position)) {
  // console.log(`At ${position}:${source.substring(0, position)}`)
    return position
  }
  // console.log("valid latex to offset: ", offsetLatex)
  // console.log(`At ${position}:${source.substring(0, position)}`)

  // adjust for missing latex
  let diffIndex = findFirstDiffPos(offsetLatex, source)
  offsetLatex = offsetLatex.substring(diffIndex)
  let sourceLatex = source.substring(diffIndex)
  // numerator
  let len = offsetLatex.length
  // console.log(`Matching offset: ${offsetLatex}`)
  while (sourceLatex.indexOf(offsetLatex.substring(0, len)) === -1) len--
  let foundAt = sourceLatex.indexOf(offsetLatex.substring(0, len))
  position = diffIndex + foundAt + len
  // console.log(`Matched offset: ${offsetLatex.substring(0, len)} at: ${foundAt} with len: ${len}`)
  // console.log(`At ${position}:${source.substring(0, position)}`)
  
  offsetLatex = offsetLatex.substring(len)
  sourceLatex = sourceLatex.substring(foundAt + len)
  if (offsetLatex.length === 0) {
  // console.log(`At ${position}:${source.substring(0, position)}`)
    return position
  }
  // denominator
  // console.log(`Matching offset: ${offsetLatex}`)
  position += sourceLatex.indexOf(offsetLatex.substring(0, len)) + offsetLatex.length
  // console.log(`At ${position}:${source.substring(0, position)}`)
  return position
}

let splitOnTopLevelOps = source => {
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
        splitArray.push({start: i, end: i + op[0].length})
      }
      opIter = ops.next()
      // console.log("splitArray", splitArray)
      op = opIter.value
      if (opIter.done === true) break
    }
  }
  return splitArray
}

let intervalFromPositionAndSplitArray = (pos, last, splitArray) => {
  let start = 0, end = last, endSet = false
  splitArray.forEach(interval => {
    if (pos <= interval.start && !endSet) {
      end = interval.start
      endSet = true
    }
    if (pos >= interval.end) start = interval.end
  });
  return { start, end }
}

let getFractionPieces = (source, interval) => {
  const re = /(?<before>[^{}]*)\\frac{(?<numerator>(?:(?:\\frac{.*}{.*})+|[^{}]+|\\placeholder{})+)}{(?<denominator>(?:(?:\\frac{.*}{.*})+|[^{}]+)+|\\placeholder{})}(?<after>[^{}]*)/d

  let fraction = source.substring(interval.start, interval.end)
  let groups = fraction.match(re, interval.start, interval.end).indices.groups
  
  for (let group in groups) {
    groups[group] = {
      start: groups[group][0] + interval.start,
      end: groups[group][1] + interval.start
    }
  }
  return groups
}

let inInterval = (pos, range) => {
  return pos >= range.start && pos <= range.end
}
let intervalFromPositionPieces = (pos, pc) => {
  let start = 0, end = 0
  if (inInterval(pos, pc.before) || inInterval(pos, pc.after)) {
    start = pc.before.start
    end = pc.after.end
  } else if (inInterval(pos, pc.numerator)) {
    return pc.numerator
  } else if (inInterval(pos, pc.denominator)) {
    return pc.denominator
  }
  return { start, end }
}

export let ejectionIntervalFromOffset = (source, offsetLatex) => {
  // get the position within source LaTeX
  let position = positionFromOffset(source, offsetLatex);
  // split on +-*
  let splitArray = splitOnTopLevelOps(source)
  let interval = intervalFromPositionAndSplitArray(position, source.length, splitArray)
  // determine fraction part in necessary
  if (source.substring(interval.start, interval.end).indexOf("\\frac{") === -1) return interval
  let fractionPieces = getFractionPieces(source, interval)
  interval = intervalFromPositionPieces(position, fractionPieces)
  return interval
}