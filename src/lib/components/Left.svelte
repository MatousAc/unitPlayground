<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'
  import { engine, parse } from '../js/computeEngine'
	import {
    ejectionIntervalFromOffset, 
    positionFromOffset, 
    nearestPhInterval
  } from '../js/left'
	import Fragment from './Fragment.svelte';

  // left global vars
  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  let ph = "\{\\Large\\placeholder\{\}\}"
  const phRE = /\{\\Large\s*\\placeholder\{\}\}/

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

  const ejectTargetInterval = (interval, e) => {
    let ejectedFragment = input.value.slice(interval.start, interval.end)
    if (ejectedFragment === ph) return // don't eject placeholders
    input.value = input.value.slice(0, interval.start) + ph + input.value.slice(interval.end)  
    let playground = input.parentNode.parentNode.parentNode
    new Fragment({
      props: {
        x: e.x - playground.offsetLeft - 30,
        y: e.y - playground.offsetTop - 80,
        initVal: ejectedFragment
      },
      target: playground
    })
  }

  let numClicks = 0;
  let singleClickTimer
  const handleClick = e => {
    numClicks++;
    if (numClicks === 1) {
      singleClickTimer = setTimeout(() => {
        numClicks = 0;
      }, 300)
    } else if (numClicks > 1) {
      clearTimeout(singleClickTimer);
      numClicks = 0;
      
      let offset = input.offsetFromPoint(e.x, e.y)
      let interval = ejectionIntervalFromOffset(input.value, input.getValue(0, offset, 'latex'))
      ejectTargetInterval(interval, e)
      input.selection = interval.start
    }
  };
  export const getValue = (...args) => input.getValue(...args)

  const getPhCount = () => {
    let re = new RegExp(phRE.source, "g")
    const matches = input.value.match(re)
    return matches ? matches.length : 0
  };

  const insertNearOffset = (offset, fragment) => {

  }

  const insertFragment = event => {
    let fragment = event.detail.fragmentValue
    let x = event.detail.x
    let y = event.detail.y
    let offset = input.offsetFromPoint(x, y)

    switch (getPhCount()) {
    case 0: insertNearOffset(offset, fragment); break
    case 1: // fill the one placeholder
      let re = new RegExp(phRE.source, "d")
      const indices = input.value.match(re).indices[0]
      input.value = input.value.slice(0, indices[0]) + 
        fragment + input.value.slice(indices[1])
      break
    default: // fill the nearest placeholder
      let pos = positionFromOffset(input.value, input.getValue(0, offset))
      let interval = nearestPhInterval(input.value, pos)
      input.value = input.value.slice(0, interval.start) + fragment + input.value.slice(interval.end)
    }
  }
  
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
  on:fragmentDrop={insertFragment}
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
