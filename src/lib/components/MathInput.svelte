<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    input.setOptions({
      enablePopover: false,
      macros: unitMacros
    })
    
    unitMacros.subscribe(val => {
      input.setOptions({ macros: val })
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

  let numClicks = 0;
  let singleClickTimer
  const handleClick = e => {
    numClicks++;
    if (numClicks === 1) {
      singleClickTimer = setTimeout(() => {
        numClicks = 0;
        console.log("single click!");
        console.log(e)
      }, 300);
    } else if (numClicks === 2) {
      clearTimeout(singleClickTimer);
      numClicks = 0;
      console.log("double click!");

    }
  };

  const handle_keydown = e => {
		console.log(e)
		if (e.keyCode === 27) { // esc
      console.log("Escape!")
      console.log(input.selection)
      let select = input.getValue(input.selection, 'latex')
      console.log("input selection: ", select)
      let hbo = input.hitboxFromOffset(select)
      console.log("input offset", hbo)
      let ofp = input.offsetFromPoint(100, 60)
      console.log("offset form point", ofp)
      console.log("last offset", input.lastOffset)
    }
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={input}
  on:input={feedback}
  on:keydown={handle_keydown}
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
