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
      console.log(e.composedPath())
    }
  };

  // const setEventHandlers = () => {
  //   let pieces = input.shadowRoot.querySelectorAll("span[data-atom-id]:not(.ML__base)")
  //   pieces.forEach(piece => {
  //     piece.onclick = handleClick
  //   });
  // }
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
</style>
