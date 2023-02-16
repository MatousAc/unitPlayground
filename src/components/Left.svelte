<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey, getResultUnits } from '../js/equation'
  import engine from '../js/computeEngine' 

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    input.setOptions({
      enablePopover: false,
      macros: unitMacros,
      computeEngine: engine,
    })
    console.log('Input Options', input.getOptions())
    // does subscribing here work? fixme?
    unitMacros.subscribe(val => {
      input.setOptions({ macros: val })
    })

    input.value = left
  })

  let feedback = () => {
    $eq = {
      left: input.value,
      right: right,
    }
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<math-field
  bind:this={input}
  on:input={feedback}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
</style>
