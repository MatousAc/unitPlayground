<script>
  import { onMount, getContext } from 'svelte'
  import { unitMacros, parseDict } from '../js/stores'
  import { eqKey, getResultUnits } from '../js/equation'
  import settings from '../js/settings'
  import { isMobile } from '../js/helpers'
  import { parse } from '../js/computeEngine'
  
  let right
  const eq = getContext(eqKey)

  onMount(() => {
    right.setOptions({
      enablePopover: false,
      macros: unitMacros
    })

    unitMacros.subscribe(val => {
      right.setOptions({
        macros: val,
      })
    })

    // all the places we need to recalculate
    eq.subscribe(() => reCalculate())
    settings.subscribe(() => reCalculate())
    parseDict.subscribe(() => reCalculate())
  })

  const reCalculate = () => {
    let json = parse($eq.left).json
    // console.log(`Left => JSON | ${$eq.left} => ${JSON.stringify(json)}`)
    right.value = getResultUnits(json, right.value)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={right}
  read-only
  on:click={() => right.previousElementSibling.focus()}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
/>

<style>
math-field {
  outline: none;
}
</style>
