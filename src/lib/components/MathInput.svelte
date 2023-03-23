<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'
  import { engine, parse } from '../js/computeEngine'
	import { beforeNavigate } from '$app/navigation';

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    input.setOptions({
      enablePopover: false,
      macros: unitMacros,
      computeEngine: engine,
      onExport: (mf, latex, range) => `${mf.getValue(range, 'latex')}`
    })

    
    unitMacros.subscribe(val => {
      input.setOptions({
        macros: val,
        computeEngine: engine
      })
    })

    input.value = left
  })

  const feedback = () => {
    $eq = {
      left: input.value,
      right: right,
    }
  }

  const ejectTarget = e => {
    console.log("Ejecting target!")
  }


  let splitOnTopLevelOperators = latex => {
    let splitArray = []
    const re = /[+\-]|(?:\\cdot)|(?:\\times)(?![^{]*})/g
    let ops = latex.matchAll(re)
    let opIter = ops.next()
    if (opIter.done === true) return splitArray
    let op = opIter.value

    let braces = 0, brackets = 0, parens = 0
    for (let i = 0; i < latex.length; i++) {
      let c = latex[i]
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
    let start = 0, end = last
    splitArray.forEach(interval => {
      if (pos < interval.start) end = interval.start
      if (pos > interval.end) start = interval.end
    });
    return { start, end }
  }

  let getFractionPieces = (fullLatex, interval) => {
    const re = /(?<before>[^{}]*)\\frac{(?<numerator>(?:(?:\\frac{.*}{.*})+|[^{}]+)+)}{(?<denominator>(?:(?:\\frac{.*}{.*})+|[^{}]+)+)}(?<after>[^{}]*)/d

    let fraction = fullLatex.substring(interval.start, interval.end)
    let groups = fraction.match(re, interval.start, interval.end).indices.groups
    
    for (let group in groups) {
      groups[group] = {
        start: groups[group][0] + interval.start,
        end: groups[group][1] + interval.start
      }
    }
    console.log("grp", groups)

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

  let determineEjectionInterval = offset => {
    // get the position within source LaTeX
    let fullLatex = input.value
    console.log(fullLatex)

    let latexToPosition = input.getValue(0, offset, 'latex')
    let position = latexToPosition.length

    let area = input.getValue(offset, offset+6 , 'latex')
    console.log("clicked on: ", area)
    console.log("latexToPosition: ", latexToPosition)

    let splitArray = splitOnTopLevelOperators(fullLatex)
    console.log("splitArray: ", splitArray)
    let interval = intervalFromPositionAndSplitArray(position, fullLatex.length, splitArray)

    console.log("within section:", fullLatex.substring(interval.start, interval.end))

    let fractionPieces = getFractionPieces(fullLatex, interval)
    console.log("fraction pieces", fractionPieces)
    console.log("position", position)
    interval = intervalFromPositionPieces(position, fractionPieces)
    console.log("Interval: ", interval, "Str: ", fullLatex.substring(interval.start, interval.end))
  }

  let numClicks = 0;
  let singleClickTimer
  const handleClick = e => {
    numClicks++;
    if (numClicks === 1) {
      singleClickTimer = setTimeout(() => {
        numClicks = 0;
        console.log(e)
      }, 300)
    } else if (numClicks > 1) {
      clearTimeout(singleClickTimer);
      numClicks = 0;
      
      let offset = input.offsetFromPoint(e.x-5, e.y)
      determineEjectionInterval(offset)
      console.log("hitbox", input.hitboxFromOffset(offset))
    }
  };

  const handleKeydown = e => {
    console.log(e)
		if (e.ctrlKey === false) return 
    // shortcuts
    e.preventDefault()
    let val
    switch (e.keyCode) {
    case 65: // select all
      input.executeCommand('selectAll')
      break
    case 67: // copy
      val = input.getValue(input.selection, 'latex')
      // let cleanValue = val.replace(/\\mathrm{([A-z]+)}/g, '\\$1')
      console.log("copying: ", val)
      navigator.clipboard.writeText(val)
      // input.executeCommand('copyToClipboard')
      break
    case 88: // cut
      val = input.getValue(input.selection)
      navigator.clipboard.writeText(val)
      input.setValue('')
      // input.executeCommand('cutToClipboard')
      break
    case 86: // paste
      // val = await navigator.clipboard.readText()
      console.log("pasting: ", val)
      // input.setValue('3')
      console.log(e.clipboardData.getData())
      // input.executeCommand('pasteFromClipboard')
      break
    default:
      break;
    }
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={input}
  on:input={feedback}
  on:click|preventDefault={handleClick}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
math-field {
  outline: none;
  display: flex;
  align-items: center;
}
</style>
