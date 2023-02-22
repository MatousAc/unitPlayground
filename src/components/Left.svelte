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
