<script>
  import { unitMacros, parseDict } from '../js/stores'
  import { onMount, getContext } from 'svelte'
  import { eqKey, getResultUnits } from '../js/equation'
  import settings from '../js/settings'
  import { isMobile } from '../js/helpers'
  import { parse } from '../js/computeEngine'
  
  let input
  const eq = getContext(eqKey)

  onMount(() => {
    input.popoverPolicy = false
    input.macros = unitMacros
    
    unitMacros.subscribe(val => {
      input.macros = val
    })

    // all the places we need to recalculate
    eq.subscribe(() => reCalculate())
    settings.subscribe(() => reCalculate())
    parseDict.subscribe(() => reCalculate())
  })

  let reCalculate = () => {
    let json = parse($eq.left).json
    console.log(`Left => JSON | ${$eq.left} => ${JSON.stringify(json)}`)
    input.value = getResultUnits(json, input.value)
  }
</script>

<math-field bind:this={input}
  on:blur
  mathVirtualKeyboardPolicy={isMobile() ? 'auto' : 'off'}
/>

<style>
math-field {
  outline: none;
  display: flex;
  align-items: center;
}
</style>
