<script>
import { onMount, getContext } from 'svelte'
import { unitMacros, parseDict } from '$pj/stores'
import { eqKey, getResultUnits } from '$pj/equation'
import settings from '$pj/settings'
import { isMobile } from '$pj/helpers'
import { parse } from '$pj/computeEngine'

let right
const eq = getContext(eqKey)

onMount(() => {
  right.setOptions({
    enablePopover: false,
    macros: unitMacros
  })

  unitMacros.subscribe(val => {
    right.setOptions({
      macros: val
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
