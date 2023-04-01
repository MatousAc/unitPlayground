<script>
  import { onMount, getContext } from 'svelte'
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { eqKey } from '../js/equation'
  import { engine } from '../js/computeEngine'
	import {
    ejectionIntervalFromOffset, 
    positionFromOffset, 
    nearestPhInterval
  } from '../js/left'
	import Fragment from './Fragment.svelte'

  // each equation has a separate context
  const eq = getContext(eqKey)
  // internal vars
  let left
  let ph = "\{\\Large\\placeholder\{\}\}"
  const phRE = /\{\\Large\s*\\placeholder\{\}\}/

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
    left.value = $eq.left
  })

  const process = () => {
    $eq = {
      left: left.value,
      right: $eq.right,
    }
  }

  const ejectTargetInterval = (interval, e) => {
    let ejectedFragment = left.value.slice(interval.start, interval.end)
    if (ejectedFragment === ph) return // don't eject placeholders
    left.value = left.value.slice(0, interval.start) + ph + left.value.slice(interval.end)  
    let playground = left.parentNode.parentNode.parentNode
    new Fragment({
      props: {
        x: e.x - playground.offsetLeft - 30,
        y: e.y - playground.offsetTop - 80,
        initVal: ejectedFragment
      },
      target: playground
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
    } else if (numClicks > 1) {
      clearTimeout(singleClickTimer)
      numClicks = 0
      
      let offset = left.offsetFromPoint(e.x, e.y)
      let interval = ejectionIntervalFromOffset(left.value, left.getValue(0, offset, 'latex'))
      ejectTargetInterval(interval, e)
      left.selection = interval.start
    }
  }
  export const getValue = (...args) => left.getValue(...args)

  const getPhCount = () => {
    let re = new RegExp(phRE.source, "g")
    const matches = left.value.match(re)
    return matches ? matches.length : 0
  }

  const insertFragment = event => {
    let fragment = event.detail.fragmentValue
    let x = event.detail.x
    let y = event.detail.y
    let offset = left.offsetFromPoint(x, y)

    let pos = positionFromOffset(left.value, left.getValue(0, offset))
    switch (getPhCount()) {
    case 0:
      let int = ejectionIntervalFromOffset(left.value, left.getValue(0, offset))
      if (Math.abs(int.start - pos) < Math.abs(int.end - pos)) {
        left.value = left.value.slice(0, int.start) + fragment + left.value.slice(int.start)
      } else {
        left.value = left.value.slice(0, int.end) + fragment + left.value.slice(int.end)
      }
      break
    case 1: // fill the one placeholder
      let re = new RegExp(phRE.source, "d")
      const indices = left.value.match(re).indices[0]
      left.value = left.value.slice(0, indices[0]) + 
        fragment + left.value.slice(indices[1])
      break
    default: // fill the nearest placeholder
      let interval = nearestPhInterval(left.value, pos)
      left.value = left.value.slice(0, interval.start) + fragment + left.value.slice(interval.end)
    }
    process()
  }
  
  const handleKeydown = e => {
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
      break;
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
