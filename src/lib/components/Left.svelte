<script>
import { onMount, getContext } from 'svelte'
import { unitMacros } from '../js/stores'
import { isMobile } from '../js/helpers'
import { eqKey } from '../js/equation'
import { engine } from '../js/computeEngine'
import {
  ejectionRangeFromOffset,
  positionFromOffset,
  nearestPhRange,
  ph,
  phRE
} from '../js/left'
import Range from '../js/Range.js'
import Fragment from './Fragment.svelte'

// each equation has a separate context
const eq = getContext(eqKey)
// internal vars
let left

onMount(() => {
  left.setOptions({
    enablePopover: false,
    macros: unitMacros,
    computeEngine: engine,
    onExport: (mf, latex, range) => `${mf.getValue(range, 'latex')}`
  })

  unitMacros.subscribe((val) => {
    left.setOptions({
      macros: val,
      computeEngine: engine
    })
  })
  left.value = $eq.left
})

const process = () => {
  $eq = {
    left: left.value,
    right: $eq.right
  }
}

const ejectTargetRange = (range, e) => {
  let ejectedFragment = left.value.slice(range.start, range.end)
  if (ejectedFragment === ph) return // don't eject placeholders
  left.value = range.replace(left.value, ph)
  let playground = left.parentNode.parentNode.parentNode
  new Fragment({
    props: {
      x: e.x - playground.offsetLeft - 30,
      y: e.y - playground.offsetTop - 100,
      initVal: ejectedFragment
    },
    target: playground
  })
  process()
}

let numClicks = 0
let singleClickTimer
const handleClick = (e) => {
  numClicks++
  if (numClicks === 1) {
    singleClickTimer = setTimeout(() => {
      numClicks = 0
    }, 300)
  } else if (numClicks > 1) {
    clearTimeout(singleClickTimer)
    numClicks = 0

    let offset = left.offsetFromPoint(e.x, e.y)
    let range = ejectionRangeFromOffset(
      left.value,
      left.getValue(0, offset, 'latex')
    )
    ejectTargetRange(range, e)
    left.selection = range.start
  }
}
export const getValue = (...args) => left.getValue(...args)

const getPhCount = () => {
  let re = new RegExp(phRE.source, 'g')
  const matches = left.value.match(re)
  return matches ? matches.length : 0
}

const insertFragment = (event) => {
  let fragment = event.detail.fragmentValue
  let x = event.detail.x
  let y = event.detail.y
  let offset = left.offsetFromPoint(x, y)

  let range
  let pos = positionFromOffset(left.value, left.getValue(0, offset))
  switch (getPhCount()) {
    case 0:
      range = ejectionRangeFromOffset(left.value, left.getValue(0, offset))
      left.value = range.insertOnClosestSide(left.value, fragment, pos)
      break
    case 1: // fill the one placeholder
      let re = new RegExp(phRE.source, 'd')
      const indices = left.value.match(re).indices[0]
      range = new Range(indices[0], indices[1])
      left.value = range.replace(left.value, fragment)
      break
    default: // fill the nearest placeholder
      range = nearestPhRange(left.value, pos)
      left.value = range.replace(left.value, fragment)
  }
  process()
}

const handleKeydown = (e) => {
  if (e.ctrlKey === false) return
  // shortcuts
  e.preventDefault()
  let val
  switch (e.keyCode) {
    case 65: // select all
      left.executeCommand('selectAll')
      break
    case 67: // copy
      val = left.getValue(left.selection, 'latex')
      // let cleanValue = val.replace(/\\mathrm{([A-z]+)}/g, '\\$1')
      navigator.clipboard.writeText(val)
      // input.executeCommand('copyToClipboard')
      break
    case 88: // cut
      val = left.getValue(left.selection)
      navigator.clipboard.writeText(val)
      left.setValue('')
      // input.executeCommand('cutToClipboard')
      break
    case 86: // paste
      // val = await navigator.clipboard.readText()
      // input.setValue('3')
      // input.executeCommand('pasteFromClipboard')
      break
    default:
      break
  }
}
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={left}
  on:input={process}
  on:click|preventDefault={handleClick}
  on:fragmentDrop={insertFragment}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
math-field {
  outline: none;
}
</style>
