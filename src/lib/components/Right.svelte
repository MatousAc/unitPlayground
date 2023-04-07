<script>
import { onMount, getContext } from 'svelte'
import { get } from 'svelte/store'
import { unitMacros, parseDict } from '$pj/stores'
import { eqKey, getResultUnits } from '$pj/equation'
import settings from '$pj/settings'
import { isMobile } from '$pj/helpers'
import { restartEngine, parse } from '$pj/computeEngine'

let right
const { l, r } = getContext(eqKey)

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
  l.subscribe(l => reCalculate())
  settings.subscribe(s => reCalculate())
  parseDict.subscribe(p => reCalculate())
})

const reCalculate = () => {
  let json = parse(get(l)).json

  // console.log(`Left => JSON | ${get(l)} => ${JSON.stringify(json)}`)
  right.value = getResultUnits(json, right.value)
  r.set(right.value)
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
