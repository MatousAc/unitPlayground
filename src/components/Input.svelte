<script>
  import { unitMacros } from '../js/units'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'
  import engine from '../js/computeEngine'

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    input.setOptions({
      // enablePopover: false,
      macros: unitMacros,
      computeEngine: engine,
    })
    console.log(input.getOptions())
    // does subscribing here work? fixme?
    unitMacros.subscribe(val => {
      input.setOptions({ macros: val })
    })
  })

  let feedback = () => {
    $eq = {
      left: input.value,
      right: right,
    }
  }
</script>

<math-field
  bind:this={input}
  on:blur={feedback}
  on:input={feedback}
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
</style>
