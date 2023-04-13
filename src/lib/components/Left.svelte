<script>
import { onMount, getContext } from 'svelte'
import { get } from 'svelte/store'
import { isAuthed } from '$pj/auth'
import { playground, unitMacros } from '$pj/stores'
import { isMobile } from '$pj/helpers'
import { eqKey } from '$pj/equation'
import { engine, restartEngine } from '$pj/computeEngine'
import Range from '$pj/Range.js'
import Fragment from '$pc/Fragment.svelte'
import {
  ejectionRangeFromOffset,
  positionFromOffset,
  nearestPhRange,
  ph,
  phRE
} from '$pj/left'
import AuthenticationRequired from '$pc/AuthenticationRequired.svelte'

// each equation has a separate context
const { l, hint } = getContext(eqKey)
// internal vars
let left

onMount(() => {
  left.setOptions({
    enablePopover: false,
    macros: unitMacros,
    computeEngine: engine,
    onExport: (mf, latex, range) => `${mf.getValue(range, 'latex')}`
  })

  unitMacros.subscribe(val => {
    left.setOptions({
      macros: val,
      computeEngine: engine
    })
  })
  left.value = get(l)
})

const process = () => {
  l.set(left.value)
}

const ejectTargetRange = (range, e) => {
  let ejectedFragment = left.value.slice(range.start, range.end)
  if (ejectedFragment === ph) return // don't eject placeholders
  left.value = range.replace(left.value, ph)
  let eq = left.parentNode.parentNode
  let { height: eqHeight } = eq.getBoundingClientRect()
  new Fragment({
    props: {
      x: e.x - get(playground).offsetLeft - 30,
      y: e.y - get(playground).offsetTop - eqHeight * 1.2,
      initVal: ejectedFragment
    },
    target: get(playground)
  })
  process()
}

let numClicks = 0
let singleClickTimer
const handleClick = e => {
  numClicks++
  if (numClicks === 1) {
    singleClickTimer = setTimeout(() => {
      numClicks = 0
    }, 300)
    if (!isAuthed()) {
      new AuthenticationRequired({ target: playground })
    }
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

const insertFragment = event => {
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

const handleKeydown = e => {
  // fixme: hitting Ctrl+C breaks the engine - make issue
  if (e.keyCode === 67) restartEngine()
}
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- define custom virtual keyboard so unit input with '\' is possible on mobile -->
<math-field
  bind:this={left}
  on:input={process}
  on:click|preventDefault={handleClick}
  on:fragmentDrop={insertFragment}
  on:keydown={handleKeydown}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
math-field {
  outline: none;
}
</style>
